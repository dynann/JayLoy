import { Icon } from "@iconify/react";

export const Header = ({
  title,
  income,
  expense,
  date,
}: {
  title: string;
  income: number;
  expense: number;
  date: string;
}) => (
  <div className="bg-emerald-500 text-white p-4 w-full shadow-lg">
    <h1 className="sub-header-white text-center">{title}</h1>

    <div className="flex items-center justify-center mt-3 gap-x-10">
      <div className="space-y-1">
        <div className="description-big-medium">Expenses:</div>
        <div className="description-big-medium">
          ${Math.abs(expense).toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-x-6">
        <div className="space-y-1 text-center">
          <div className="description-big-medium">Income:</div>
          <div className="description-big-medium">
            ${income.toFixed(2)}
          </div>
        </div>

        <div className="w-[2px] h-10 bg-black/20"></div>

        <div className="text-right">
          <div className="description-big-medium">{date}</div>
          <div className="flex items-center gap-1 justify-center">
            <Icon icon="mdi:calendar" className="w-4 h-4" />
            <span className="text-sm">Today</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
