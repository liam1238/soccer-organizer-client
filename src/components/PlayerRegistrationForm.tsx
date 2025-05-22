import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export const PlayerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    fitness: "",
    skill: "",
    teamwork: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        fitness: parseInt(formData.fitness),
        skill: parseInt(formData.skill),
        teamwork: parseInt(formData.teamwork),
      }),
    });
    const data = await response.json();
    alert("שחקן נוסף בהצלחה!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-4 space-y-4"
    >
      <h2 className="text-xl font-bold text-center">רישום שחקן</h2>
      <input
        name="name"
        placeholder="שם"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      <input
        name="fitness"
        placeholder="כושר (1-10)"
        type="number"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      <input
        name="skill"
        placeholder="יכולת (1-10)"
        type="number"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      <input
        name="teamwork"
        placeholder="קבוצתיות (1-10)"
        type="number"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        הוסף שחקן
      </button>
    </form>
  );
};
