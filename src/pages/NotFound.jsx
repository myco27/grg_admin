// src/pages/NotFound.jsx
import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";


function NotFound() {
  return (
    <div className="flex flex-col mx-auto items-center justify-center h-screen bg-gray-50">
        <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mb-4" />
        <Typography variant="h1" color="red" className="mb-4">
          Error 404
        </Typography>
      <Typography variant="h5" color="gray" className="mb-8">
        Oops! The page you're looking for could not be found.
      </Typography>
      <Link to="/orders">
        <Button variant="filled" color="blue">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;