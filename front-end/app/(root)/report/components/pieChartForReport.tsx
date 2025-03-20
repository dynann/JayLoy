// PieChartComponent.tsx

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface PieData {
  name: string;
  value: any;
  color: string;
}

interface PieChartComponentProps {
  pieData: PieData[];
  numberConverter: (num: number) => string;
  remainingBalance: any;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  pieData,
  numberConverter,
  remainingBalance,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300} className="h-[300px] flex flex-col items-center text-sm">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="sub-header"
        >
          {numberConverter(remainingBalance)} {/* Placeholder for dynamic amount */}
        </text>
        <br />
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="description-small"
        >
          Remaining
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
