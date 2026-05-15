"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#c9a84c", "#e0c76e", "#a88a3a", "#8e8e93", "#48484a", "#6b7280"];

interface ChartProps {
  type: "bar" | "pie";
  data: { name: string; value: number }[];
}

export default function Chart({ type, data }: ChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-burgos-gray-600 text-sm text-center py-8">Sin datos</p>;
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fill: "#8e8e93", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8e8e93", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#1a1a24", border: "1px solid #2c2c2e", borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: "#f5f5f7" }}
          />
          <Bar dataKey="value" fill="#c9a84c" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#1a1a24", border: "1px solid #2c2c2e", borderRadius: 12, fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
