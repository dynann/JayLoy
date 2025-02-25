import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { JSX } from "react";

type Transaction = {
  category: string;
  amount: number;
  icon: JSX.Element;
  color: string;
  value: number;
};

function PopupModal({ category: number, setCategory }: { category: number; setCategory: (n: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const transactions: Transaction[] = [
    {
      category: "Food",
      amount: -45.0,
      icon: (
        <Icon
          icon="fluent:food-48-regular"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-red",
      value: 1,
    },
    {
      category: "Transport",
      amount: -25.0,
      icon: (
        <Icon
          icon="solar:bus-bold"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-purple",
      value: 2,
    },
    {
      category: "Medicine",
      amount: -31.0,
      icon: (
        <Icon
          icon="cuida:medicine-outline"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-green",
      value: 3,
    },
    {
      category: "Groceries",
      amount: -43.0,
      icon: (
        <Icon
          icon="material-symbols:grocery"
          width="3em"
          className="text-white"
        />
      ),
      color: "bg-orange",
      value: 4,
    },
    {
      category: "Savings",
      amount: 75.0,
      icon: (
        <Icon
          icon="hugeicons:money-saving-jar"
          width="3em"
          className="text-white"
        />
      ),
      color: "bg-cyan",
      value: 5,
    },
    {
      category: "Rent",
      amount: -50.0,
      icon: (
        <Icon
          icon="mdi:house-clock-outline"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-blue",
      value: 6,
    },
    {
      category: "Gifts",
      amount: -45.0,
      icon: (
        <Icon
          icon="famicons:gift-outline"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-purple",
      value: 7,
    },
    {
      category: "Entertainment",
      amount: -35.0,
      icon: (
        <Icon
          icon="ion:ticket-outline"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-pink",
      value: 8,
    },
    {
      category: "Internet",
      amount: -35.0,
      icon: (
        <Icon
          icon="material-symbols:wifi-rounded"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-primary",
      value: 9,
    },
    {
      category: "Salary",
      amount: -35.0,
      icon: (
        <Icon
          icon="si:wallet-detailed-duotone"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-brown",
      value: 10,
    },
    {
      category: "Freelance",
      amount: -35.0,
      icon: (
        <Icon
          icon="tdesign:money"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-cyan",
      value: 11,
    },
    {
      category: "Invest",
      amount: -35.0,
      icon: (
        <Icon
          icon="streamline:investment-selection"
          width="3em"
          height="3em"
          className="text-white"
        />
      ),
      color: "bg-gray",
      value: 12,
    },
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("Food");
  const [selectedValue, setSelectedValue] = useState<any>(1); 

  return (
    <div>
      {/* Button to open modal */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-gray bg-white hover:bg-gray border border-gray focus:ring-4 focus:outline-none focus:ring-gray font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray- dark:bg-gray dark:border-gray dark:text-white dark:hover:bg-gray"
      >

        {selectedCategory}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          tabIndex={-1} // Fixed: use a number, not a string
          aria-hidden="true"
          className="fixed inset-0 z-70 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative z-80 p-4 w-full max-w-md bg-white rounded-lg shadow-sm dark:bg-gray">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray border-gray">
              <h3 className="description-medium   dark:text-white">
                Choose a category
              </h3>
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray bg-transparent hover:bg-gray hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray- dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="smalltext font-normal text-gray dark:text-gray-400">
                Choose your wallet category, you'd like to spend
              </p>

              <div className="grid grid-cols-3  content-center">
                {transactions.map((transaction, index) => (
                  <div
                    className=" "
                    key={index}
                    onClick={() => {
                      setSelectedCategory(transaction.category);
                      setSelectedValue(transaction.value);
                      setCategory(transaction.value);
                      setIsOpen(false); // Close modal after selection
                    }}
                    //   onClick={() => setSelectedCategory(transaction.category)}
                  >
                    <div className="flex flex-col items-center justify-center py-3 text-gray">
                      <div
                        className={`${transaction.color} p-3 rounded-lg text-primary`}
                         
                      >
                        {transaction.icon}
                      </div>
                      <span className="text-center text-sm text-gray">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupModal;
