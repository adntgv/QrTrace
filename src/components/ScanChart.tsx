'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface ScanChartProps {
  data: { date: string; count: number }[];
  title: string;
}

export function ScansOverTime({ data, title }: ScanChartProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0ea5e9"
            fillOpacity={1}
            fill="url(#scanGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BarChartProps {
  data: { name: string; count: number }[];
  title: string;
}

export function TopCountries({ data, title }: BarChartProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6',
              }}
            />
            <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface PieChartProps {
  data: { name: string; value: number }[];
  title: string;
}

export function DeviceBreakdown({ data, title }: PieChartProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data yet</p>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="60%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-300">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
