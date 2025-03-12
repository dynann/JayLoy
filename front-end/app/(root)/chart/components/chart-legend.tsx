"use client";

import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";
import type { ChartData } from "./pie-chart";
import { useState } from "react";

interface ChartLegendProps {
  chartData: ChartData[];
}

export function ChartLegend({ chartData }: ChartLegendProps) {
  const [showAllLegend, setShowAllLegend] = useState(false);

  // Sort data by value (percentage) for legend display
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  // Get top 3 for legend display
  const topLegendItems = sortedData.slice(0, 3);
  const legendItems = showAllLegend ? sortedData : topLegendItems;

  return (
    <div className="grid grid-cols-1 gap-y-4 mb-2 ml-12">
      {legendItems.map((item) => {
        const category = TRANSACTION_CATEGORIES[Number(item.categoryID)];
        const colorClass = category?.color || "bg-gray";
        return (
          <div
            key={item.categoryID}
            className="flex items-center justify-center w-full"
          >
            {/* Dots and Names */}
            <div className="flex w-1/2 justify-end items-center gap-2">
              {/* dot container */}
              <div className="w-4 flex justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
              </div>

              {/* name container */}
              <div className="w-32 text-left">
                <span className="text-sm font-medium">
                  {item.name || category?.name || "Other"}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="w-1/2 flex justify-start pl-8">
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          </div>
        );
      })}

      {/* See More Button */}
      {chartData.length > 3 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setShowAllLegend(!showAllLegend)}
            className="text-primary text-sm font-medium hover:underline"
          >
            {showAllLegend ? "Show Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
