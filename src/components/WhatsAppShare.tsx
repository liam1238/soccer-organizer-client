import React from 'react';

interface WhatsAppShareProps {
  date: string;
  teams: { playerIds: string[]; names: string[] }[];
}

export const WhatsAppShare = ({ date, teams }: WhatsAppShareProps) => {
  const buildMessage = () => {
    const lines = [`משחק בתאריך: ${new Date(date).toLocaleDateString('he-IL')}`];
    teams.forEach((team, idx) => {
      lines.push(`\nקבוצה ${idx + 1}:`);
      team.names.forEach(name => lines.push(`- ${name}`));
    });
    return encodeURIComponent(lines.join('\n'));
  };

  const handleShare = () => {
    const message = buildMessage();
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button onClick={handleShare}
      className="mt-2 text-sm text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
      שתף בוואטסאפ
    </button>
  );
};
