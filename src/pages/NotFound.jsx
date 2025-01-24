// src/pages/NotFound.jsx
import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function NotFound() {

  return (
    <div className="flex flex-col mx-auto items-center justify-center h-screen min-w-screen bg-gray-100 p-4 md:p-0">
      <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mb-4" />
      <Typography variant="h1" color="red" className="mb-4">
        Error 404
      </Typography>
      <Typography color="gray" className="mb-8 text-center text-xl md:text-2xl">
        Oops! The page you're looking for could not be found.
      </Typography>

      <Link to="/orders">
        <Button variant="filled" color="blue">
          Go HOME
        </Button>
      </Link>

    </div>
  );
}

export default NotFound;
