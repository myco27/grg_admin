import React from "react";
import {
  Typography,
  Input,
} from "@material-tailwind/react";
import { Search } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Sidebar />
        <Typography variant="h2" className="text-gray-900">
          Dashboard
        </Typography>
      </div>

      <div className="w-full max-w-xs">
        <Input
          type="text"
          placeholder="Search"
          className="text-lg !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 placeholder:text-gray-500 focus:!border-gray-900"
          labelProps={{
            className: "hidden",
          }}
          containerProps={{ className: "min-w-[100px]" }}
          icon={<Search className="h-5 w-5 text-gray-500" />}
        />
      </div>
    </div>
  );
}
