import React from "react";
import { Typography } from "@material-tailwind/react";

const Dashboard = () => {
  return (
    <div className="mx-auto flex h-[80dvh] flex-col items-center justify-center bg-gray-100 p-4 md:p-0">
      <Typography variant="h1" color="red" className="mb-4 text-center">
        Dashboard
      </Typography>
      <Typography color="gray" className="mb-8 text-center text-xl md:text-2xl">
        Incoming
      </Typography>
    </div>
  );
};

export default Dashboard;
