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
      aria-hidden='false'
      size={size} 
      open={open} 
      handler={handleOpen}
      className={`flex flex-col ${className}`}
    >
      {children}
    </Dialog>
  );
};

export default Base;
