import React, { useState } from "react";
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";

function ExpenseModal({
  category: number,
  setCategory,
}: {
  category: number;
  setCategory: (n: number) => void;
}) {
  // Convert the object to an array for easier mapping
  const categoriesArray = Object.values(TRANSACTION_CATEGORIES);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [selectedColor, setSelectedColor] = useState("bg-red");
  return (
    <div>
      {/* Button to open modal */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`text-white  ${selectedColor} hover:bg-white  hover:text-black shadow-sm focus:ring-1 focus:outline-none focus:ring-gray rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray dark:bg-gray dark:border-gray dark:text-black dark:hover:bg-gray`}
      >
        {selectedCategory}
      </button>
      {/* Modal */}
      {isOpen && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-70 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative z-80 p-4 w-full max-w-md bg-white rounded-lg shadow-sm dark:bg-gray">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray border-gray">
              <h3 className="description-medium dark:text-white">
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
              {/* logic if type == expense show ........ */}
              {/* else income show ........ */}
              <div className="grid grid-cols-3 content-center">
                {categoriesArray
                  .filter((category) => category.id >= 0 && category.id <= 9)
                  .map((category) => (
                    <div
                      className=""
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedColor(category.color);
                        setSelectedValue(category.id);
                        setCategory(category.id);
                        setIsOpen(false); // Close modal after selection
                      }}
                    >
                      <div className="flex flex-col items-center justify-center py-3 text-gray">
                        <div
                          className={`${category.color} p-3 rounded-lg text-primary`}
                        >
                          {category.icon}
                        </div>
                        <span className="text-center text-sm text-gray">
                          {category.name}
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
function IncomeModal({
  category: number,
  setCategory,
}: {
  category: number;
  setCategory: (n: number) => void;
}) {
  // Convert the object to an array for easier mapping
  const categoriesArray = Object.values(TRANSACTION_CATEGORIES);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState("Salary");
  const [selectedColor, setSelectedColor] = useState("bg-brown");
  return (
    <div>
      {/* Button to open modal */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`text-white  ${selectedColor} hover:bg-white  hover:text-black shadow-sm focus:ring-1 focus:outline-none focus:ring-gray rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray dark:bg-gray dark:border-gray dark:text-black dark:hover:bg-gray`}
      >
        {selectedCategory}
      </button>
      {/* Modal */}
      {isOpen && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-70 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative z-80 p-4 w-full max-w-md bg-white rounded-lg shadow-sm dark:bg-gray">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray border-gray">
              <h3 className="description-medium dark:text-white">
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
              {/* logic if type == expense show ........ */}
              {/* else income show ........ */}
              <div className="grid grid-cols-3 content-center">
                {categoriesArray
                  .filter((category) => category.id >= 10 && category.id <= 12)
                  .map((category) => (
                    <div
                      className=""
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedColor(category.color);
                        setSelectedValue(category.id);
                        setCategory(category.id);
                        setIsOpen(false); // Close modal after selection
                      }}
                    >
                      <div className="flex flex-col items-center justify-center py-3 text-gray">
                        <div
                          className={`${category.color} p-3 rounded-lg text-primary`}
                        >
                          {category.icon}
                        </div>
                        <span className="text-center text-sm text-gray">
                          {category.name}
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
 

export default ExpenseModal;
export { IncomeModal };