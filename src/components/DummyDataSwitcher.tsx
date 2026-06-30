"use client";

import { useState, useEffect } from "react";
import { Database, Lightning } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function DummyDataSwitcher() {
  const [useDummy, setUseDummy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/(^| )use_dummy_data=([^;]+)/);
    if (match && match[2] === "true") {
      setUseDummy(true);
    }
  }, []);

  const toggleDummyData = () => {
    const newValue = !useDummy;
    setUseDummy(newValue);
    document.cookie = `use_dummy_data=${newValue}; path=/; max-age=86400`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleDummyData}
      className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 ${
        useDummy 
          ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:bg-amber-500/20" 
          : "bg-sky-50 dark:bg-sky-500/10 text-foreground/40 border-sky-200/50 dark:border-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/15 hover:text-foreground/60"
      }`}
      title="Toggle Dummy Data"
    >
      {useDummy ? (
        <>
          <Lightning size={16} weight="duotone" className="animate-pulse" />
          <span>Dummy ON</span>
        </>
      ) : (
        <>
          <Database size={16} weight="duotone" />
          <span>Real Data</span>
        </>
      )}
    </button>
  );
}
