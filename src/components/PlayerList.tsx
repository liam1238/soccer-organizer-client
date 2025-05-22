import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface Player {
  id: string;
  name: string;
  fitness: number;
  skill: number;
  teamwork: number;
  appearances: number;
  tags?: string[];
}

export const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/players`)
      .then((res) => res.json())
      .then(setPlayers)
      .catch((err) => console.error("Failed to load players", err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">שחקנים רשומים</h2>
      <ul className="space-y-2">
        {players.map((player) => (
          <li key={player.id} className="border-b pb-2">
            <strong>{player.name}</strong> - כושר: {player.fitness}, יכולת:{" "}
            {player.skill}, קבוצתיות: {player.teamwork}
            {player.tags && player.tags.length > 0 && (
              <div className="text-sm text-gray-500">
                תגיות: {player.tags.join(", ")}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
