import React from "react";

interface TabbarProps {
  text: string;
}

export default function  Tabbar({ text }: TabbarProps) {
  return (
    <div className="fixed z-50 w-full bg-white h-12 shadow-sm  ">
      <p className="  description-bold text-center p-4">{text}</p>
    </div>
  );
};
 

export  function Tabbb() {
  return (<div> not yet done </div>);
}

 
