import { Icon } from "@iconify/react";
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";

export const TransactionItem = ({ transaction }: { transaction: any }) => {
  const categoryInfo = TRANSACTION_CATEGORIES[transaction.categoryID] || {
    name: "Other",
    icon: <Icon icon="mdi:help-circle" className="text-white" />,
    color: "bg-gray",
  };

  const amount = parseFloat(transaction.amount);
  const isExpense = transaction.type === "EXPENSE";

  return (
    <div className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-8 pr-8 w-full">
      <div className="flex items-center space-x-5">
        <div className={`${categoryInfo.color} p-3 rounded-full`}>
          {categoryInfo.icon}
        </div>
        <span className="description-medium">{categoryInfo.name}</span>
      </div>
      <span className={`description-medium ${isExpense ? "!text-red" : "!text-primary"}`}>
        {isExpense ? "-" : "+"}${Math.abs(amount).toFixed(2)}
      </span>
    </div>
  );
};
