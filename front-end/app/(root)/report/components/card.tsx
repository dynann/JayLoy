import React from "react";

interface cardProps {
  email: string;
  username: string;
  value: number | string;
}
const AccountCard: React.FC<cardProps> = ({ email, username, value }) => {
  return (
    <div>
      <div>
        <div className="w-full px-8 absolute top-8">
          <div className="flex justify-between">
            <div className="">
              <p className="font-bold text-xl text-textColor">{username}</p>
              <p className="font-medium tracking-widest  text-textColor">
                {email}
              </p>
            </div>
          </div>
          <div className="pt-1 pr-0">
            <div className="flex justify-between">
              <button className="px-4 py-1 bg-secondary opacity-0 rounded-3xl font-body text-white">
                view history
              </button>
              <div className="flex flex-col">
                <p className=" text-3xl  font-black  text-textColor">{value}</p>
                <p className="font-bold tracking-more-wider text-sm   text-textColor ">
                  Remained Balance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
