"use client";

import { useTheme } from "next-themes";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";



export function PerformanceChart({ data }: { data: { name: string; pengajuan: number; disetujui: number }[] }) {
  const { theme } = useTheme();
  
  const textColor = theme === "dark" ? "#7DD3FC" : "#0284C7"; // sky-300 : sky-600
  const gridColor = theme === "dark" ? "rgba(56, 189, 248, 0.08)" : "rgba(14, 165, 233, 0.08)";

  return (
    <div className="w-full h-[280px] mt-2">
      <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDisetujui" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPengajuan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 11, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
            dx={-5}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              border: theme === "dark" ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid rgba(14, 165, 233, 0.15)",
              boxShadow: "0 10px 40px -10px rgba(14, 165, 233, 0.15)",
              backdropFilter: "blur(12px)",
              color: theme === "dark" ? "#F0F9FF" : "#0C1829",
              fontSize: "12px",
              fontWeight: 600,
            }}
          />
          <Area type="monotone" name="Pengajuan Masuk" dataKey="pengajuan" stroke="#06B6D4" fillOpacity={1} fill="url(#colorPengajuan)" strokeWidth={3} dot={false} />
          <Area type="monotone" name="Disetujui" dataKey="disetujui" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorDisetujui)" strokeWidth={3} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
