import React from "react";
import { TabsHeader, Tab, Typography, DialogHeader } from "@material-tailwind/react";

const Sidebar = ({
  activeTab,
  setActiveTab,
  tabs = [],
  className = "",
  bgColor = "bg-primary",
  indicatorColor = "bg-[#3A1066]",
  textColor = "text-white",
  sidebarTitle = ""
}) => {
  return (
    <div className={`${bgColor} px-4 ${className}`}>
    <DialogHeader className="text-white text-sm ml-0 pl-1 pb-1">{sidebarTitle}</DialogHeader>
      <TabsHeader
        className="bg-transparent text-nowrap w-full h-full gap-2"
        indicatorProps={{
          className: indicatorColor,
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`justify-start ${textColor}`}
          >
            <div className="flex items-center text-xs p-1">
              {tab.icon && React.cloneElement(tab.icon, { className: "w-4 h-4 mr-2" })}
              {tab.label}
            </div>
          </Tab>
        ))}
      </TabsHeader>
    </div>
  );
};

export default Sidebar;
