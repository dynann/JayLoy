import React, { useState } from "react";
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";

function PopupModal({ category: number, setCategory }: { category: number; setCategory: (n: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [selectedValue, setSelectedValue] = useState<number>(1);

  // Convert the object to an array for easier mapping
  const categoriesArray = Object.values(TRANSACTION_CATEGORIES);

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

              <div className="grid grid-cols-3 content-center">
                {categoriesArray.map((category) => (
                  <div
                    className=""
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setSelectedValue(category.id);
                      setCategory(category.id);
                      setIsOpen(false); // Close modal after selection
                    }}
                  >
                    <div className="flex flex-col items-center justify-center py-3 text-gray">
                      <div className={`${category.color} p-3 rounded-lg text-primary`}>
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

export default PopupModal;