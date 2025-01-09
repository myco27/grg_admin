import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { format, isValid } from "date-fns";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function DatePicker({
  selected,
  onChange,
  placeholder = "Select date",
}) {
  const inputRef = useRef(null);
  const fpRef = useRef(null);
  const navigate = useNavigate(); // Use the navigate function

  // Validate the selected date
  const isValidDate = selected && isValid(new Date(selected));

  useEffect(() => {
    // If the selected date is invalid, navigate to /notfound
    if (selected && !isValidDate) {
      navigate("/notfound");
      return; // Exit early to prevent further execution
    }

    if (inputRef.current) {
      fpRef.current = flatpickr(inputRef.current, {
        defaultDate: isValidDate ? new Date(selected) : null, // Only set valid dates
        onChange: ([date]) => {
          onChange(date);
        },
      });
    }

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
      }
    };
  }, [onChange, selected, isValidDate, navigate]); // Add navigate to dependencies

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    if (fpRef.current) {
      fpRef.current.clear();
    }
  };

  return (
    <div className="relative h-10 min-w-[200px] bg-white">
      <div className="relative">
        <input
          ref={inputRef}
          className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          placeholder=" "
          value={isValidDate ? format(new Date(selected), "PPP") : ""} // Only format valid dates
          readOnly
        />
        {isValidDate && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-gray-50 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-gray-500" />
          </button>
        )}
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
          {placeholder}
        </label>
      </div>
    </div>
  );
}