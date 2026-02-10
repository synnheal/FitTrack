'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface FrequencyDataPoint {
  week: string; // e.g. "W1", "Jan 6"
  days: number; // number of training days that week
}

interface FrequencyChartProps {
  data: FrequencyDataPoint[];
}

export function FrequencyChart({ data }: FrequencyChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No training data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="week"
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          domain={[0, 7]}
          ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1c1c1e',
            border: '1px solid #27272a',
            borderRadius: 8,
            color: '#9ca3af',
          }}
          formatter={(value: number) => [`${value} days`, 'Frequency']}
        />
        <Bar dataKey="days" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
