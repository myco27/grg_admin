import React, { useEffect, useState } from "react";

const UseDebounce = ({ value, delay = 500 }) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return debouncedValue;
};

export default UseDebounce;
