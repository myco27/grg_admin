// src/pages/UnauthorizedPage.jsx
import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

function NotFound() {

  return (
    <div className="min-w-screen mx-auto flex h-screen flex-col items-center justify-center bg-gray-100 p-4 md:p-0">
      <NoSymbolIcon className="mb-4 h-20 w-20 text-red-500" />
      <Typography variant="h1" color="red" className="mb-4">
        Error 401
      </Typography>
      <Typography color="gray" className="mb-8 text-center text-xl md:text-2xl">
        NO AUTHORIZATION FOUND!
      </Typography>

      <Link to="/orders">
        <Button variant="filled" color="purple">
          Go HOME
        </Button>
      </Link>

    </div>
  );
}

export default NotFound;
