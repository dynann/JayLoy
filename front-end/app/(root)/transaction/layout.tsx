import { TabWithCancelButton } from "@/layouts/Tabbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const containerClasses =
    "wax-h-screen flex flex-col items-center justify-center px-4 gap-4";
  return (
    <div className=" containClasses  bg-background">
      <TabWithCancelButton href= "/" text={"Transaction"} />
      {children}
    </div>
  );
};

export default Layout;
