import React from "react";
import { DialogBody, TabsBody, TabPanel } from "@material-tailwind/react";

const Body = ({
  children,
  className = "",
  tabs = null,
  activeTab = null,
  maxHeight = "h-[50vh]"
}) => {
  if (tabs && activeTab) {
    return (
      <DialogBody className={`p-0 ${className}`}>
        <TabsBody className={`${maxHeight} overflow-auto px-2`}>
          {tabs.map((tab) => (
            <TabPanel 
              key={tab.value} 
              value={tab.value} 
              className="flex flex-col gap-2 px-2 h-full"
            >
              {tab.content}
            </TabPanel>
          ))}
        </TabsBody>
      </DialogBody>
    );
  }

  return (
    <DialogBody className={`${maxHeight} overflow-auto ${className}`}>
      {children}
    </DialogBody>
  );
};

export default Body; 