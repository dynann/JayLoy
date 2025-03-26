import { Icon } from "@iconify/react";
import { JSX } from "react";

export type TransactionCategory = {
  id: number;
  name: string;
  icon: JSX.Element;
  color: string;
};

export const TRANSACTION_CATEGORIES: { [key: number]: TransactionCategory } = {
  1: {
    id: 1,
    name: "Food",
    icon: <Icon icon="fluent:food-48-regular" width="3em" height="3em" className="text-white" />,
    color: "bg-red",
  },
  2: {
    id: 2,
    name: "Transport",
    icon: <Icon icon="solar:bus-bold" width="3em" height="3em" className="text-white" />,
    color: "bg-purple",
  },
  3: {
    id: 3,
    name: "Medicine",
    icon: <Icon icon="cuida:medicine-outline" width="3em" height="3em" className="text-white" />,
    color: "bg-green",
  },
  4: {
    id: 4,
    name: "Groceries",
    icon: <Icon icon="material-symbols:grocery" width="3em" className="text-white" />,
    color: "bg-orange",
  },
  5: {
    id: 5,
    name: "Clothing",
    icon: <Icon icon="ph:t-shirt" width="3em" className="text-white" />,
    color: "bg-cyan",
  },
  6: {
    id: 6,
    name: "Rent",
    icon: <Icon icon="mdi:house-clock-outline" width="3em" height="3em" className="text-white" />,
    color: "bg-dark_blue",
  },
  7: {
    id: 7,
    name: "Gifts",
    icon: <Icon icon="famicons:gift-outline" width="3em" height="3em" className="text-white" />,
    color: "bg-purple",
  },
  8: {
    id: 8,
    name: "Entertainment",
    icon: <Icon icon="ion:ticket-outline" width="3em" height="3em" className="text-white" />,
    color: "bg-pink",
  },
  9: {
    id: 9,
    name: "Internet",
    icon: <Icon icon="material-symbols:wifi-rounded" width="3em" height="3em" className="text-white" />,
    color: "bg-primary",
  },
  10:{
    id: 10, 
    name: "Transfer",
    icon: <Icon icon="ion:arrow-redo-sharp" width="3em" height="3em" className="text-white"  />,  
    color: "bg-red"
  },
  11: {
    id: 11,
    name: "Salary",
    icon: <Icon icon="si:wallet-detailed-duotone" width="3em" height="3em" className="text-white" />,
    color: "bg-brown",
  },
  12: {
    id: 12,
    name: "Freelance",
    icon: <Icon icon="tdesign:money" width="3em" height="3em" className="text-white" />,
    color: "bg-cyan",
  },
  13: {
    id: 13,
    name: "Invest",
    icon: <Icon icon="streamline:investment-selection" width="3em" height="3em" className="text-white" />,
    color: "bg-gray",
  },
  14: {
    id: 14,
    name: "Recieve",
    icon: <Icon icon="ion:arrow-undo" width="3em" height="3em" className="text-white" />,
    color: "bg-blue",
  },

};