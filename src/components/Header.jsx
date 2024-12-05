import React from "react";
import {
  Typography,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Search, ChevronDown, Settings, LogOut, User } from "lucide-react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-300 shadow-sm px-6 py-2 flex flex-col md:flex-row justify-between items-center">
      
      <div className="flex items-center">
        <Sidebar />
        <Typography variant="h3" className="text-gray-900">
          <Link to="/orders">
            Dashboard
          </Link>
        </Typography>
      </div>

      <div className="flex justify-center w-full max-w-xs">
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

      <div className="flex items-center">

        <Menu placement="bottom-end">
          <MenuHandler>
            <Button variant="text" className="flex items-center gap-3 p-2 normal-case">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-md">JM</span>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="h6" color="blue-gray">
                  John Michael
                </Typography>
                <Typography variant="paragraph" color="gray" className="font-semibold mt-[-6px]">
                  Admin
                </Typography>
              </div>
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </Button>
          </MenuHandler>
          <MenuList>
            <MenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </MenuItem>
            <MenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" />
            <MenuItem className="flex items-center gap-2 text-red-500">
              <LogOut className="h-4 w-4" /> Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

    </div>
  );
}
