import NavBar from "@/layouts/NavBar";
import Tabbar from "@/layouts/Tabbar";
import React, { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
