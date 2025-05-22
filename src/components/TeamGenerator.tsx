import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface Player {
  id: string;
  name: string;
  fitness: number;
  skill: number;
  teamwork: number;
}

interface Match {
  id: string;
  date: string;
  teams: { playerIds: string[] }[];
  winnerIndex?: number;
}

export const TeamGenerator = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/players`)
      .then((res) => res.json())
      .then(setPlayers);

    fetchLatestMatch();
  }, []);

  const fetchLatestMatch = async () => {
    const res = await fetch(`${API_URL}/api/matches`);
    const data: Match[] = await res.json();
    if (data.length > 0) setLatestMatch(data[0]);
    else setLatestMatch(null);
  };

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const generateTeams = async () => {
    if (selectedIds.length % 5 !== 0) {
      alert("יש לבחור מספר שחקנים שהוא כפולה של 5 (למשל: 10, 15, 20)");
      return;
    }

    await fetch(`${API_URL}/api/teams/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerIds: selectedIds }),
    });

    setSelectedIds([]);
    await fetchLatestMatch();
  };

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name || "שחקן";

  const setWinner = async (index: number) => {
    if (!latestMatch) {
      console.warn("⚠️ No match loaded");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/matches/${latestMatch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerIndex: index }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Failed to update winner:", res.status, errorText);
        return;
      }
      await fetchLatestMatch();
    } catch (err) {
      console.error("❌ Error in setWinner:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        בחר שחקנים למשחק
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.includes(player.id)}
              onChange={() => togglePlayer(player.id)}
              className="accent-green-600"
            />
            <label className="text-sm">{player.name}</label>
          </li>
        ))}
      </ul>
      <button
        onClick={generateTeams}
        disabled={selectedIds.length < 6}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        צור קבוצות
      </button>

      {latestMatch && latestMatch.winnerIndex === null && (
        <div className="mt-6 space-y-4">
          {latestMatch.teams.map((team, idx) => (
            <div key={idx} className="bg-gray-100 rounded p-3">
              <h4 className="font-bold">
                קבוצה {idx + 1}{" "}
                {latestMatch.winnerIndex === idx && (
                  <span className="text-green-700">(מנצחת)</span>
                )}
              </h4>
              <ul className="list-disc pr-4">
                {team.playerIds.map((pid) => (
                  <li key={pid}>{getPlayerName(pid)}</li>
                ))}
              </ul>
              {latestMatch.winnerIndex === null && (
                <button
                  onClick={() => setWinner(idx)}
                  className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  סמן כמנצחת
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
