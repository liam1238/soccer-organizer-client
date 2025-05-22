import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface Player {
  id: string;
  name: string;
}

interface Match {
  id: string;
  winnerIndex?: number;
  teams: { playerIds: string[] }[];
}

interface PlayerStat {
  name: string;
  appearances: number;
  wins: number;
}

export const PlayerStats = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<PlayerStat[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/players`).then((res) => res.json()),
      fetch(`${API_URL}/api/matches`).then((res) => res.json()),
    ]).then(([playersData, matchesData]) => {
      const playerMap: Record<string, string> = {};
      playersData.forEach((p: Player) => {
        playerMap[p.id] = p.name;
      });

      const statMap: Record<string, PlayerStat> = {};
      matchesData.forEach((match: Match) => {
        match.teams.forEach((team, tidx) => {
          team.playerIds.forEach((pid) => {
            if (!statMap[pid]) {
              statMap[pid] = {
                name: playerMap[pid] || "לא ידוע",
                appearances: 0,
                wins: 0,
              };
            }
            statMap[pid].appearances++;
            if (match.winnerIndex === tidx) {
              statMap[pid].wins++;
            }
          });
        });
      });

      setStats(Object.values(statMap).sort((a, b) => b.wins - a.wins));
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        סטטיסטיקות שחקנים
      </h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-right">
            <th className="p-2">שם</th>
            <th className="p-2">הופעות</th>
            <th className="p-2">ניצחונות</th>
            <th className="p-2">אחוז ניצחונות</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, idx) => (
            <tr key={idx} className="border-b text-right">
              <td className="p-2">{stat.name}</td>
              <td className="p-2">{stat.appearances}</td>
              <td className="p-2">{stat.wins}</td>
              <td className="p-2">
                {((stat.wins / stat.appearances) * 100).toFixed(0)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
