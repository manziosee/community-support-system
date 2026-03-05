import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Label,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import Card from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
  title: string;
  type?: 'pie' | 'bar';
  colors?: Record<string, string>;
}

const DEFAULT_COLORS: Record<string, string> = {
  Pending:   '#555555',
  Accepted:  '#111111',
  Completed: '#000000',
  Cancelled: '#aaaaaa',
  Active:    '#333333',
};

const RADIAN = Math.PI / 180;

/** Percentage label rendered inside each pie slice */
const renderSliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.08) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight="800" fontFamily="Manrope, system-ui, sans-serif">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/** Center label showing total inside the donut hole */
const CenterLabel = ({
  viewBox,
  total,
  isDark,
}: {
  viewBox?: { cx?: number; cy?: number };
  total: number;
  isDark: boolean;
}) => {
  const cx = viewBox?.cx ?? 0;
  const cy = viewBox?.cy ?? 0;
  return (
    <>
      <text x={cx} y={cy - 6} textAnchor="middle"
        fill={isDark ? '#f1f5f9' : '#111827'}
        fontSize={26} fontWeight="900" fontFamily="Manrope, system-ui, sans-serif">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle"
        fill={isDark ? '#64748b' : '#9ca3af'}
        fontSize={10} fontWeight="600"
        fontFamily="Source Sans 3, system-ui, sans-serif" letterSpacing="0.08em">
        TOTAL
      </text>
    </>
  );
};

/** Custom legend below chart with count + percentage badges */
const CustomLegend = ({
  data,
  colors,
  isDark,
}: {
  data: Array<{ status: string; count: number }>;
  colors: Record<string, string>;
  isDark: boolean;
}) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-3 px-2">
      {data.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const color = colors[item.status] || '#6b7280';
        return (
          <div key={item.status} className="flex items-center gap-1.5 min-w-0">
            {/* Colored dot — dynamic per-item color, must remain inline */}
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs font-bold text-gray-700 dark:text-slate-200">
              {item.status}
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/10 text-gray-900 dark:text-slate-100">
              {item.count}{' '}
              <span className="font-medium text-gray-500 dark:text-slate-400">({pct}%)</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

const StatusChart: React.FC<StatusChartProps> = ({
  data,
  title,
  type = 'pie',
  colors = DEFAULT_COLORS,
}) => {
  const { isDark } = useTheme();
  if (!data || data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  const tooltipStyle = {
    borderRadius: '12px',
    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f1f5f9' : '#111827',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'Source Sans 3, system-ui',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
  };

  const gridColor = isDark ? '#334155' : '#f0f0f0';
  const axisColor = isDark ? '#64748b' : '#9ca3af';

  return (
    <Card padding="md">
      {/* Chart header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
          <p className="text-xs font-semibold text-neutral-500 dark:text-slate-400">
            {total} {total === 1 ? 'record' : 'records'} total
          </p>
        </div>
      </div>

      {type === 'pie' ? (
        <>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                labelLine={false}
                label={renderSliceLabel}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.status] || '#6b7280'} />
                ))}
                <Label
                  content={(props) => (
                    <CenterLabel
                      viewBox={props.viewBox as { cx?: number; cy?: number }}
                      total={total}
                      isDark={isDark}
                    />
                  )}
                  position="center"
                />
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <CustomLegend data={data} colors={colors} isDark={isDark} />
        </>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barSize={24} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              {data.map((entry) => (
                <linearGradient key={entry.status} id={`bar-grad-${entry.status}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={colors[entry.status] || '#111111'} stopOpacity={1} />
                  <stop offset="100%" stopColor={colors[entry.status] || '#111111'} stopOpacity={0.65} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: axisColor, fontWeight: 600, fontFamily: 'Source Sans 3' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor, fontFamily: 'Source Sans 3' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', radius: 8 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={`url(#bar-grad-${entry.status})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default StatusChart;
