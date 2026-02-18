import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from '../common/Card';

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
  title: string;
  type?: 'pie' | 'bar';
  colors?: Record<string, string>;
}

const DEFAULT_COLORS = {
  'Pending': '#f59e0b',
  'Accepted': '#3b82f6',
  'Completed': '#10b981',
  'Cancelled': '#ef4444',
  'Active': '#f59e0b',
};

const StatusChart: React.FC<StatusChartProps> = ({ 
  data, 
  title, 
  type = 'pie',
  colors = DEFAULT_COLORS 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
          {title}
        </h2>
      </div>
      
      {type === 'pie' ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, count }) => `${status}: ${count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.status] || '#6b7280'} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default StatusChart;
