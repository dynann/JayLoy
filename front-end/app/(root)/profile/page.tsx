"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react"; 
import Image from "next/image";
import SVG from "react-inlinesvg";
import ProfileImage from "@/public/images/plant.webp";
import { Icon } from "@iconify/react";
import router, { useRouter } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { useAuthFetch } from "@/hooks/useAuthFetch";

 
 

 function page() {
  const containerClasses ="min-h-screen flex flex-col items-center justify-center px-4 gap-4";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const display = async (e: React.FormEvent) => {
    e.preventDefault();

    
    try {
      const userId = localStorage.getItem("userId"); 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        
      });

      if (res.ok) {
        const data = await res.json();
        console.log({username, email})
        setUsername(data.username);
        setEmail(data.enail);
      }  else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("Failed to fetch");
      console.error("Failed to fetch", err);
    }
  };

 


  const handleLogout = async () => {  //not done yet, call api and use instead
    await logout();
    // Clear localStorage 
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenTimestamp");
    }
    router.push("/login");
  };
  const lists = [
    { title: "Edit Profile", icon: <Icon icon="iconamoon:profile-fill" width="24" height="24" />},
    { title: "My Data", icon: <Icon icon="bxs:data" width="24" height="24" /> },
    { title: "Setting", icon: <Icon icon="lets-icons:setting-fill" width="24" height="24" /> },
    { title: "Terms and Conditions", icon: <Icon icon="famicons:document-text" width="24" height="24" />},
    { title: "Log out", icon: <Icon icon="famicons:document-text" width="24" height="24" /> },
  ];
  return (
    <div className={containerClasses}>
      {/* tabbar already applied in layout.tsx  */}
      <div className="space-y-2 flex flex-col items-center px-4">
        <Image
          className="w-24 h-24 p-1 rounded-full ring-2 ring-primary dark:ring-gray"
          src={ProfileImage}
          alt="Neil image"
        />
        <p className="description-regular text-center">{username || "Loading..."}</p>
        <p className="description-regular text-center">{email || "Loading..."}</p>

        {/* the setting list  */}
        <div>
          {lists.map((item, index) => (
            <ul className=" ">
              <li key={index} className="pb-3 sm:pb-1 " >
                <div className="flex  items-center w-full space-x-4 rtl:space-x-reverse"
                 onClick= {item.title === "Log out"? handleLogout : undefined} >
                  {/* icon  */}
                  <div className="flex flex-col items-center justify-center py-2 text-gray">
                     <div className={`bg-tertiary p-3 rounded-lg text-primary shadow-sm`}>{item.icon}</div>
                  </div>
                  <div className="flex-1  min-w-0">
                    <p className=" description-regular text-left text-black truncate dark:text-white"
                    // onClick= {item.title === "Log out"? handleLogout : undefined}
                    >
                      {item.title}{" "}
                    </p>
                  </div>
                  <div className="inline-flex items-end   text-gray dark:text-white">
                    <Icon icon="ion:chevron-forward" width="24" height="24" />
                  </div>
                </div>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
