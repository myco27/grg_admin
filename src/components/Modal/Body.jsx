import React from "react";
import {
  DialogBody,
  TabsBody,
  TabPanel,
  Spinner,
} from "@material-tailwind/react";
const Body = ({
  children,
  className = "",
  tabs = null,
  activeTab,
  maxHeight = "h-[50vh]",
  loading,
}) => {
  if (tabs && activeTab) {
    return loading ? (
      <div className="flex h-full items-center justify-center">
        <div className="mt-[-10vh] h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
      </div>
    ) : (
      <DialogBody className={`p-0 overflow-auto ${className}`}>
        <TabsBody className={`${maxHeight} h-full overflow-auto px-2`}>
          {tabs.map((tab) =>
            tab.value === activeTab ? (
              <TabPanel
                key={tab.value}
                value={tab.value}
                className="flex h-full flex-col gap-2 px-2"
              >
                {tab.content}
              </TabPanel>
            ) : null
          )}
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
