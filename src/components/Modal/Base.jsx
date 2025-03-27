import React from "react";
import { Dialog } from "@material-tailwind/react";

const Base = ({ 
  open, 
  handleOpen, 
  size = "md", 
  children, 
  className
}) => {
  return (
    <Dialog
      size={size} 
      open={open} 
      handler={handleOpen}
      className={`flex flex-col ${className}`}
      dismiss={{ outsidePress: false }}
    >
      {children}
    </Dialog>
  );
};

export default Base;
