import React, { useState } from "react";
import {
  Calendar,
  Coins,
  Trophy,
  ShoppingBag,
  Target,
  Home,
} from "lucide-react";

const CodeStreakTracker = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [streak, setStreak] = useState(1);
  const [coins, setCoins] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [notification, setNotification] = useState("");
  const [lastSolved, setLastSolved] = useState(null);

  const [calendar, setCalendar] = useState({});

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const solveProblem = () => {
    const today = new Date();
    const todayStr = today.toDateString();

    if (lastSolved === todayStr) {
      showNotification("✅ You already solved today's problem!");
      return;
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const isStreakContinuing = lastSolved === yesterdayStr;

    const newStreak = isStreakContinuing ? streak + 1 : 1;
    const earnedCoins = Math.min(10 + Math.floor(newStreak / 5) * 5, 50);

    setStreak(newStreak);
    setCoins((prev) => prev + earnedCoins);
    setTotalProblems((prev) => prev + 1);
    setLastSolved(todayStr);
    setCalendar((prev) => ({ ...prev, [todayStr]: true }));

    showNotification(`🎉 You earned ${earnedCoins} coins!`);
  };

  const storeItems = [
    { id: 1, name: "Custom Theme", price: 50, icon: "🎨" },
    { id: 2, name: "Streak Shield", price: 100, icon: "🛡️" },
    { id: 3, name: "Double Coins", price: 75, icon: "⚡" },
  ];

  const purchaseItem = (item) => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      showNotification(`🛒 Purchased ${item.name}!`);
    } else {
      showNotification("❌ Not enough coins!");
    }
  };

  const achievements = [
    { name: "First Solve", icon: "🎯", unlocked: totalProblems >= 1 },
    { name: "7-Day Streak", icon: "📅", unlocked: streak >= 7 },
    { name: "100 Coins", icon: "💰", unlocked: coins >= 100 },
  ];

  const renderCalendar = () => {
    const days = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      days.push(
        <div
          key={i}
          className={`p-4 text-sm flex items-center justify-center w-6 h-6 rounded-full ${
            calendar[dateStr] ? "bg-green-500" : "bg-gray-300"
          }`}
        >{date.getDate()}</div>
      );
    }

    return <div className="grid grid-cols-10 gap-2 mt-2">{days}</div>;
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-screen mx-auto">
        <div className="flex justify-between flex-wrap gap-10 items-center mb-10">
          <h1 className="text-4xl font-bold">CodeStreak Tracker</h1>
          <div className="space-x-10 flex">
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-3 cursor-pointer text-black rounded-xl flex gap-3 ${activeTab === 'dashboard' ? "bg-blue-400":"bg-white"}`}>
              <Home/>Dashboard
            </button>
            <button onClick={() => setActiveTab("store")} className={`px-4 py-3 cursor-pointer text-black rounded-xl flex gap-3 ${activeTab === 'store' ? "bg-blue-400":"bg-white"}`}>
              <ShoppingBag/>Store
            </button>
          </div>
        </div>

        {notification && (
          <div className="mb-4 bg-yellow-400 text-black p-3 rounded-md shadow">
            {notification}
          </div>
        )}

        {activeTab === "dashboard" ? (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl shadow-md text-center">
                <div className="text-xl font-semibold">🔥 {streak} Day Streak</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-md text-center">
                <div className="flex items-center justify-center gap-2">
                  <Coins /> <span className="text-xl">{coins} Coins</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-md text-center">
                <div className="flex items-center justify-center gap-2">
                  <Target /> <span className="text-xl">{totalProblems} Solved</span>
                </div>
              </div>
            </div>

            {/* SOLVE BUTTON */}
            <div className="mb-6 text-center">
              <button
                onClick={solveProblem}
                className="bg-white text-black px-6 py-3 rounded-full hover:bg-blue-400 cursor-pointer transition"
              >
                🚀 Solve Today's Problem
              </button>
            </div>

            {/* CALENDAR */}
            <div className="mb-6 bg-white text-black p-5 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-5">
                <Calendar /> <h2 className="text-xl font-bold">Coding Calendar</h2>
              </div>
              <div className="mx-auto w-full translate-x-[5%]">
                {renderCalendar()}
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white text-black p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Trophy /> <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {achievements.map((ach, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-md shadow-md text-center ${
                      ach.unlocked ? "bg-green-400 text-white" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="text-3xl">{ach.icon}</div>
                    <div>{ach.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // STORE TAB
          <div className="bg-white text-black p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag /> <h2 className="text-xl font-bold">Store</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 rounded-lg text-center shadow"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm mb-2">{item.price} Coins</div>
                  <button
                    onClick={() => purchaseItem(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeStreakTracker;
