import React from "react";
import { DialogBody, TabsBody, TabPanel } from "@material-tailwind/react";

const Body = ({
  children,
  className = "", tabs = null, activeTab, maxHeight="h-[50vh]"
}) => {
  if (tabs && activeTab) {
    return (
      
      <DialogBody className={`p-0 ${className}`}>
        <TabsBody className={`${maxHeight} overflow-auto px-2`}>
          {tabs.map((tab) => (
            <TabPanel 
              key={tab.value} 
              value={tab.value} 
              className="flex h-full flex-col gap-2 px-2"
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