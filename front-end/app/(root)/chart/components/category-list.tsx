"use client";

import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";
import { Icon } from "@iconify/react";
import type { ChartData } from "./pie-chart";
import { formatCurrency } from "@/utils/formatCurrency";

interface CategoryListProps {
  chartData: ChartData[];
  activeView: "income" | "expense";
  onCategorySelect: (categoryId: number) => void;
}

export function CategoryList({
  chartData,
  activeView,
  onCategorySelect,
}: CategoryListProps) {
  return (
    <>
      <h2 className="font-bold text-xl px-1 mb-4 mt-6">
        {activeView === "income" ? "Income" : "Expense"} Lists:
        </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chartData.map((item) => {
          const category = TRANSACTION_CATEGORIES[Number(item.categoryID)];
          const colorClass = category?.color || "bg-gray";
          return (
            <div
              key={item.categoryID}
              className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-8 pr-8 w-full cursor-pointer hover:opacity-80 transition-all"
              onClick={() => onCategorySelect(Number(item.categoryID))}
            >
              <div className="flex items-center space-x-5">
                <div className={`${colorClass} p-3 rounded-full`}>
                  {category?.icon || <Icon icon="mdi:help-circle" className="w-[3em] h-[3em] text-white" />}
                </div>
                <span className="description-medium">{item.name || category?.name || "Other"}</span>
              </div>
              <span className={`description-medium ${activeView === "income" ? "!text-primary" : "!text-red"}`}>
                {activeView === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(item.amount), 2).replace("$", "")}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

