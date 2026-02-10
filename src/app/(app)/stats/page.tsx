'use client';

import { useState } from 'react';
import { BarChart2, TrendingUp, Target, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VolumeChart, type VolumeDataPoint } from '@/components/charts/volume-chart';
import { ExerciseProgressChart, type ExerciseDataPoint } from '@/components/charts/exercise-progress-chart';
import { MacroDonutChart, type MacroSplit } from '@/components/charts/macro-donut-chart';

const summaryStats = [
  { label: 'Séances ce mois', value: '0', icon: Calendar, trend: 'Aucune séance' },
  { label: 'Volume total', value: '0 kg', icon: BarChart2, trend: '--' },
  { label: 'Record personnel', value: '--', detail: 'Aucun record', icon: TrendingUp, trend: '--' },
  { label: 'Objectif', value: '0%', icon: Target, trend: 'Non défini' },
];

const volumeData: VolumeDataPoint[] = [];

const exerciseData: Record<string, ExerciseDataPoint[]> = {};

const macroAverage: MacroSplit = { protein: 0, carbs: 0, fat: 0 };

const exerciseNames = Object.keys(exerciseData);

export default function StatsPage() {
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0] ?? '');

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Statistiques</h2>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              {stat.detail && (
                <p className="text-sm text-gray-400 mb-1">{stat.detail}</p>
              )}
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volume Chart */}
      <Card>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">Volume d&apos;entraînement</h3>
          <p className="text-sm text-gray-400 mb-6">
            Évolution sur les 12 dernières semaines
          </p>
          {volumeData.length > 0 ? (
            <VolumeChart data={volumeData} />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Aucune donnée disponible — commence à t&apos;entraîner !
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise Progress Chart */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-1">Progression des charges</h3>
              <p className="text-sm text-gray-400">Poids + 1RM estimé</p>
            </div>
            {exerciseNames.length > 0 && (
              <div className="flex gap-2">
                {exerciseNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedExercise(name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedExercise === name
                        ? 'bg-brand/20 text-brand'
                        : 'bg-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedExercise && exerciseData[selectedExercise] ? (
            <ExerciseProgressChart
              data={exerciseData[selectedExercise]}
              exerciseName={selectedExercise}
            />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Aucun exercice enregistré
            </div>
          )}
        </CardContent>
      </Card>

      {/* Macro Donut */}
      <Card>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">Répartition macros</h3>
          <p className="text-sm text-gray-400 mb-6">Moyenne sur 7 jours</p>
          {macroAverage.protein + macroAverage.carbs + macroAverage.fat > 0 ? (
            <MacroDonutChart data={macroAverage} />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Aucune donnée nutritionnelle
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
