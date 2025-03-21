import React from "react";
import { TabsHeader, Tab, Typography, DialogHeader } from "@material-tailwind/react";

const Sidebar = ({
  activeTab,
  setActiveTab,
  tabs = [],
  className = "", bgColor ="bg-primary",
  indicatorColor = "bg-[#3A1066]",
  textColor = "text-white",
  sidebarTitle = ""
}) => {
  return (
    <div className={`${bgColor} px-4 ${className}`}>
    <DialogHeader className="ml-0 pb-1 pl-1 text-sm text-white">{sidebarTitle}</DialogHeader>
      <TabsHeader
        className="h-full w-full flex-row gap-2 text-nowrap bg-transparent sm:flex-col"
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
            <div className="flex items-center p-1 text-xs">
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
