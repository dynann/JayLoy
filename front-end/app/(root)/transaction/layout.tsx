import { TabWithCancelButton } from "@/layouts/Tabbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className=" containClasses  bg-background">
      <TabWithCancelButton href= "/" text={"Add record "} />
      {children}
    </div>
  );
};

export default Layout;
