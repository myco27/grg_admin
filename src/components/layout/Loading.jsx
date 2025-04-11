// src/pages/Loading.jsx
import React from 'react';

function Loading({height}) {
  return (
<div className={`${height? height:'h-[50vh]'} flex items-center justify-center`}>
        <div className="mt-[-10vh] h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
      </div>
  );
}

export default Loading;