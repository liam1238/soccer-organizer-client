import React from "react";
import { PlayerRegistrationForm } from "./components/PlayerRegistrationForm";
import { PlayerList } from "./components/PlayerList";
import { TeamGenerator } from "./components/TeamGenerator";
import { MatchHistory } from "./components/MatchHistory";
import { PlayerStats } from "./components/PlayerStats";
import { AdminPanel } from "./components/AdminPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user, isAdmin, signIn, signOut } = useAuth();

  return (
    <div dir="rtl" className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-700">
          ארגון קבוצות כדורגל
        </h1>
        {user ? (
          <span>
            שלום, {user.email}
            <button
              onClick={signOut}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
            >
              התנתק
            </button>
          </span>
        ) : (
          <button
            onClick={signIn}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            התחבר עם Google
          </button>
        )}
      </div>

      {isAdmin && <PlayerRegistrationForm />}
      <hr className="my-6" />
      <PlayerList />
      <hr className="my-6" />
      {isAdmin && <TeamGenerator />}
      <hr className="my-6" />
      <MatchHistory />
      <hr className="my-6" />
      <PlayerStats />
      <hr className="my-6" />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
