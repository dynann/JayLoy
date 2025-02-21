import React from "react";

interface TabbarProps {
  text: string;
}

export default function Tabbar({ text }: TabbarProps) {
  return (
    <div className="fixed z-50 w-full bg-white h-12 shadow-sm flex items-center justify-center  px-4 ">
      <p className="  description-bold text-center  ">{text}</p>
    </div>
  );
}

// { image, title }: { image: any; title: any }
export function TabWithCancelButton({ text , href}: { text: any; href: any }) {
  return (
    <div className="fixed z-50 w-full bg-white h-12 shadow-sm flex items-center justify-between px-4">
  {/* Left side: Cancel button */}
  <a href={href} className="text-black">Cancel</a>

  {/* Center: Text */}
  <p className="absolute left-1/2 transform -translate-x-1/2 text-center description-bold ">
    {text}
  </p>
  
  {/* Right side: Empty div to balance the layout */}
  <div className="w-16"></div>
</div>

  );
}
