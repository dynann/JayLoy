import NavBar from "@/layouts/NavBar";
import Tabbar from "@/layouts/Tabbar";
import React, { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const containerClasses =
  "wax-h-screen flex flex-col items-center justify-center px-4 gap-4";
return (
  <div className=" containClasses  bg-background">
    {/* <Tabbar text={"Profile Page"} /> */}
    <Tabbar text="Report"   />
    {children}
    <NavBar />
  </div>
);
}

export default Layout;
