'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface MacroSplit {
  protein: number; // grams
  carbs: number;
  fat: number;
}

interface MacroDonutChartProps {
  data: MacroSplit;
}

const MACRO_COLORS: Record<string, string> = {
  Protein: '#fb923c',
  Carbs: '#facc15',
  Fat: '#f87171',
};

export function MacroDonutChart({ data }: MacroDonutChartProps) {
  const total = data.protein + data.carbs + data.fat;

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No macro data yet
      </div>
    );
  }

  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ];

  return (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={MACRO_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1c1c1e',
            border: '1px solid #27272a',
            borderRadius: 8,
            color: '#9ca3af',
          }}
          formatter={(value: number, name: string) => [`${value}g`, name]}
        />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: 12 }}
          formatter={(value: string) => <span style={{ color: '#9ca3af' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
