'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

export interface WeightDataPoint {
  date: string; // ISO date string
  weight: number; // kg
}

interface WeightProgressChartProps {
  data: WeightDataPoint[];
}

export function WeightProgressChart({ data }: WeightProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No weight data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={(v: string) => format(parseISO(v), 'dd/MM')}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          domain={['dataMin - 2', 'dataMax + 2']}
          unit=" kg"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1c1c1e',
            border: '1px solid #27272a',
            borderRadius: 8,
            color: '#9ca3af',
          }}
          labelFormatter={(v: string) => format(parseISO(v), 'dd MMM yyyy')}
          formatter={(value: number) => [`${value} kg`, 'Weight']}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f97316' }}
          activeDot={{ r: 5, fill: '#f97316' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
