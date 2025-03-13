import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-[80dvh] flex-col items-center justify-center bg-gray-100 p-4 md:p-0">
      <NoSymbolIcon className="mb-4 h-20 w-20 text-red-500" />
      <Typography variant="h1" color="red" className="mb-4">
        Error 401
      </Typography>
      <Typography color="gray" className="mb-8 text-center text-xl md:text-2xl">
        You are not authorized to access this page.
      </Typography>

      <Button variant="filled" color="purple" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
}

export default UnauthorizedPage;
