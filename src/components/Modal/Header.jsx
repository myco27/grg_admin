import React from "react";
import { DialogHeader, Typography } from "@material-tailwind/react";

const Header = ({ 
  children, 
  title, 
  className = "", bgColor ="",
  onClose,
  closeButton = true
}) => {
  return (
    <DialogHeader className={`${bgColor} px-4 ${className}`}>
        <div className="flex w-full items-center justify-between border-b border-gray-300 py-2">
            <Typography variant="h5" className='font-semibold'>{title}</Typography>
            {closeButton && (
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    &times; {/* This is the "X" character */}
                </button>
            )}
        </div>
    </DialogHeader>


  );
};

export default Header;
