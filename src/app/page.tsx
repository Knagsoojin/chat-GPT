"use client";

import {useTheme} from "next-themes";

export default function Home() {
  const {theme, setTheme} = useTheme();
  return (
    <div className="light:bg-red dark:bg-pink">
      <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <p className="text-black-600 font-bold bg-blue-300">희희 나는 테일윈드!</p>
        <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}</div>
      </main>
    </div>
  );
}
