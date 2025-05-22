import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

export const AdminPanel = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = () => {
    fetch(`${API_URL}/api/players`)
      .then((res) => res.json())
      .then(setPlayers);
  };

  const deletePlayer = async (id: string) => {
    await fetch(`${API_URL}/api/players/${id}`, { method: "DELETE" });
    loadPlayers();
  };

  const updatePlayer = async () => {
    await fetch(`${API_URL}/api/players/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditingId(null);
    setEditData({});
    loadPlayers();
  };

  const canEdit = (player: Player) =>
    isAdmin || (user && user.id === player.id);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setEditData({ ...editData, tags });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">ניהול שחקנים</h2>
      <ul className="space-y-4">
        {players.map((player) => (
          <li key={player.id} className="border-b pb-2">
            {editingId === player.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue={player.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                />
                <input
                  type="text"
                  placeholder="תגיות מופרדות בפסיקים"
                  defaultValue={player.tags?.join(", ") || ""}
                  onChange={handleTagsChange}
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                />
                <button
                  onClick={updatePlayer}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  שמור
                </button>
              </div>
            ) : (
              <div>
                <strong>{player.name}</strong> (כושר: {player.fitness}, יכולת:{" "}
                {player.skill}, קבוצתיות: {player.teamwork})
                {player.tags && player.tags.length > 0 && (
                  <div className="text-sm text-gray-500">
                    תגיות: {player.tags.join(", ")}
                  </div>
                )}
                {canEdit(player) && (
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingId(player.id);
                        setEditData(player);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      ערוך
                    </button>
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      מחק
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
