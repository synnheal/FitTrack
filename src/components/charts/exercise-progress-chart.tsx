'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

export interface ExerciseDataPoint {
  date: string; // ISO date string
  weight: number; // kg lifted
  estimated1RM?: number; // optional estimated 1RM
}

interface ExerciseProgressChartProps {
  data: ExerciseDataPoint[];
  exerciseName?: string;
}

export function ExerciseProgressChart({
  data,
  exerciseName = 'Exercise',
}: ExerciseProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No data for {exerciseName}
      </div>
    );
  }

  const has1RM = data.some((d) => d.estimated1RM != null);

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
        />
        {has1RM && <Legend wrapperStyle={{ color: '#9ca3af' }} />}
        <Line
          type="monotone"
          dataKey="weight"
          name="Weight"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f97316' }}
          activeDot={{ r: 5 }}
        />
        {has1RM && (
          <Line
            type="monotone"
            dataKey="estimated1RM"
            name="Est. 1RM"
            stroke="#fb923c"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#fb923c' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
