"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react"; 
import Image from "next/image";
import SVG from "react-inlinesvg";
import ProfileImage from "@/public/images/plant.webp";
import { Icon } from "@iconify/react";
import router, { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { useAuthFetch } from "@/hooks/useAuthFetch";

 function page() {
  const containerClasses ="min-h-screen flex flex-col items-center justify-center px-4 gap-2";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // const display = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const userID = localStorage.getItem("userID"); 
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userID}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
        
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       console.log({username, email})
  //       setUsername(data.username);
  //       setEmail(data.enail);
  //     }  else {
  //       setError("Failed to fetch user data");
  //     }
  //   } catch (err) {
  //     setError("Failed to fetch");
  //     console.error("Failed to fetch", err);
  //   }
  // };

 
  const LogoutComponent = () => {
    const router = useRouter(); // Call useRouter inside the component
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("logout") === "logout";
  
    const logout = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // 1️⃣ Get user ID & access token from localStorage
        const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  
        if (!userID) {
          console.error("No userID found");
          return;
        }
  
        // 2️⃣ Define API endpoint & method for logout
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`; // Ensure this endpoint matches backend route
        const method = "PATCH"; // Since your backend uses PATCH for logout
  
        // 3️⃣ Call API
        const res = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userID }), // Send userID in the body
        });
  
        if (!res.ok) {
          throw new Error("Failed to log out");
        }
  
        console.log("Logout successful");
  
        // 4️⃣ Clear storage & redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userID");
        router.push("/login");
      } catch (err) {
        console.error("Logout request failed:", err);
        alert("Failed to log out!");
      }
    };
};

  // const handleLogout = async () => {  //not done yet, call api and use instead
  //   await logout();
  //   // Clear localStorage 
  //   if (typeof window !== "undefined") {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //     localStorage.removeItem("tokenTimestamp");
  //   }
  //   router.push("/login");
  // };
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
              <li key={index} className="m-2 sm:pb-1 " >
                <div className="flex  items-center w-full space-x-4 rtl:space-x-reverse"
                 onClick= {item.title === "Log out"? logout : undefined} >
                  {/* icon  */}
                  <div className="flex flex-col items-center justify-center py-2 text-gray">
                     <div className={`bg-tertiary p-2 rounded-lg text-primary shadow-sm`}>{item.icon}</div>
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
