import React from "react";
import Tabbar from "@/layouts/Tabbar";
import Image from "next/image";
import ProfileImage from "@/public/images/plant.webp";
import {
  TextInput,
  PasswordInput,
  TransparentInput,
} from "@/components/customeInput";
import email from "next-auth/providers/email";
import { Button } from "@/components/ui/button";
function page() {
  const containerClasses =
    "min-h-screen flex flex-col items-center justify-center px-4 gap-2";
  return (
    <>
      <Tabbar text="Edit Profile" />
      <div className={containerClasses}>
        <div className="space-y-2 flex flex-col items-center px-1 pb-2">
          <Image
            className="w-20 h-20 p-1 rounded-full ring-2 ring-primary dark:ring-gray"
            src={ProfileImage}
            alt="Profile image"
          />

          <label className="flex bg-transparent hover:underline text-black text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]">
            {/* Upload
            <input type="file" id="uploadFile1" className="hidden" /> */}
             <input type="file" className="hidden" />
             Edit Picture
          </label>
        </div>

        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="sub-header leading-none text-gray-900 dark:text-white">
              Personal Informatioin
            </h5>
            {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            View all
        </a> */}
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="shrink-0">
                    {/* <Image className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/> */}
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Username
                    </p>
                    {/* <TextInput type="username" placeholder="sansetha" value="sansetha" disabled={true}  /> */}
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <TransparentInput
                      type="text"
                      value="sansetha"
                      className="text-right"
                    />
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="shrink-0">
                    {/* <Image className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image"/> */}
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      E-mail
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <TransparentInput
                      type="email"
                      value="san.setha@gmail.com"
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Button type="submit" className="green-button !text-white">
            Saves changes
          </Button>
        </div>
      </div>
    </>
  );
}

export default page;
