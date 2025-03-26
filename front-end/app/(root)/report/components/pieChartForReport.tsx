// PieChartComponent.tsx

import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  pieData: PieData[];
  numberConverter: (num: number) => string;
  remainingBalance: number;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  pieData,
  numberConverter,
  remainingBalance,
}) => {
  // Add a small invisible segment if there's only one category
  const animatedData = useMemo(() => {
    if (pieData.length === 1) {
      return [
        ...pieData,
        {
          name: "invisible",
          value: 0.1,
          color: "transparent",
        }
      ]
    }
    return pieData
  }, [pieData])

  return (
    <ResponsiveContainer width="100%" height={200} className="h-[200px] flex flex-col items-center text-sm">
      <PieChart>
        <Pie
          data={animatedData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {animatedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.name === "invisible" ? "transparent" : entry.color}
              style={{ pointerEvents: "none" }}
            />
          ))}
        </Pie>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="sub-header"
        >
          {numberConverter(remainingBalance)}
        </text>
        <br />
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="description-small"
        >
          Total Income
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
