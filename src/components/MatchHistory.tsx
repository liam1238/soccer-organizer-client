import React, { useEffect, useState } from "react";
import { WhatsAppShare } from "./WhatsAppShare";
const API_URL = import.meta.env.VITE_API_URL;

interface Match {
  id: string;
  date: string;
  teams: { playerIds: string[] }[];
  winnerIndex?: number;
}

interface Player {
  id: string;
  name: string;
}

export const MatchHistory = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API_URL}/api/players`)
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((p: Player) => {
          map[p.id] = p.name;
        });
        setPlayers(map);
      });

    fetch(`${API_URL}/api/matches`)
      .then((res) => res.json())
      .then(setMatches);
  }, []);

  const setWinner = async (matchId: string, winnerIndex: number) => {
    await fetch(`${API_URL}/api/matches/${matchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winnerIndex }),
    });

    const updated = matches.map((match) =>
      match.id === matchId ? { ...match, winnerIndex } : match
    );
    setMatches(updated);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        היסטוריית משחקים
      </h2>
      {matches.map((match, idx) => (
        <div key={match.id} className="mb-6 border-b pb-4">
          <h4 className="font-bold mb-2 text-blue-600">
            משחק {matches.length - idx} -{" "}
            {new Date(match.date).toLocaleDateString("he-IL")}
          </h4>
          {match.teams.map((team, tidx) => (
            <div key={tidx} className="bg-gray-50 rounded p-3 mb-2">
              <strong
                className={match.winnerIndex === tidx ? "text-green-700" : ""}
              >
                קבוצה {tidx + 1} {match.winnerIndex === tidx && "(מנצחת)"}
              </strong>
              <ul className="list-disc pr-4">
                {team.playerIds.map((pid) => (
                  <li key={pid}>{players[pid] || "שחקן לא ידוע"}</li>
                ))}
              </ul>
              {match.winnerIndex === undefined && (
                <button
                  onClick={() => setWinner(match.id, tidx)}
                  className="mt-2 text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  סמן כמנצחת
                </button>
              )}
            </div>
          ))}
          <WhatsAppShare
            date={match.date}
            teams={match.teams.map((team) => ({
              playerIds: team.playerIds,
              names: team.playerIds.map(
                (pid) => players[pid] || "שחקן לא ידוע"
              ),
            }))}
          />
        </div>
      ))}
    </div>
  );
};
