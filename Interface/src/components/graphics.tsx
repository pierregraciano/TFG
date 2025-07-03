'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  date: string;
  temperatura?: number;
  umidadeAr?: number;
  umidadeSolo?: number;
}

interface LineChartExampleProps {
  data: DataPoint[];
}

export default function Graphics({ data }: LineChartExampleProps) {
  return (
    <div className="w-full h-64 bg-white rounded-2xl shadow p-4 mt-10">
      <h2 className="text-xl font-semibold mb-4">Dados Ambientais</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: '%', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura"
            stroke="#f97316"
            strokeWidth={3}
            name="Temperatura"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="umidadeAr"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Umidade do Ar"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="umidadeSolo"
            stroke="#10b981"
            strokeWidth={3}
            name="Umidade do Solo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
