// src/pages/Loading.jsx
import React from 'react';

function Loading() {
  return (
    <div
      className="flex justify-center items-center h-screen w-screen bg-gray-100"
    >
      <div
        className="border-8 border-gray-300 border-t-purple-500 rounded-full w-16 h-16 animate-spin mt-[-10vh]"
      />
    </div>
  );
}

export default Loading;