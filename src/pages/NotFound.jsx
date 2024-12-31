// src/pages/NotFound.jsx
import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col mx-auto items-center justify-center h-screen min-w-screen mt-[-12vh]">
      <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mb-4" />
      <Typography variant="h1" color="red" className="mb-4">
        Error 404
      </Typography>
      <Typography variant="h5" color="gray" className="mb-8">
        Oops! The page you're looking for could not be found.
      </Typography>

      <Button variant="filled" color="blue" onClick={goBack}>
        Go Back
      </Button>
    </div>
  );
}

export default NotFound;
