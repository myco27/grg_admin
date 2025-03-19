import React from "react";
import { DialogHeader, Typography } from "@material-tailwind/react";

const Header = ({ 
  children, 
  title, 
  className = "", 
  bgColor = "",
  onClose,
  closeButton = true
}) => {
  return (
    <DialogHeader className={`${bgColor} px-4 ${className}`}>
        <div className="border-b border-gray-300 w-full py-2 flex justify-between items-center">
            <Typography variant="small" className='text-xs font-semibold'>{title}</Typography>
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
