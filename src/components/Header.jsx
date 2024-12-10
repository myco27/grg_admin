import React, { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-purple-500 border-b border-purple-600 shadow-sm px-2 sm:px-6 py-1 flex flex-row justify-between items-center">
      
      <div className="flex items-center">
        <Sidebar />
          <Link to="/orders">
            <img 
            src="/src/assets/rockygo_logo.png"
            alt="RockyGo"
            className="h-7"
            />
          </Link>
      </div>

      <div className="flex items-center">

        <Menu placement="bottom-end">
          <MenuHandler>
            <Button variant="text" className="flex items-center gap-2 p-2 normal-case">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">JM</span>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <Typography color="white" className="font-medium">
                  John Michael
                </Typography>
                <Typography className="text-gray-300 mt-[-6px]">
                  Admin
                </Typography>
              </div>
              <ChevronDown className="h-4 w-4 text-white" strokeWidth={3} />
            </Button>
          </MenuHandler>
          <MenuList>
            <MenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </MenuItem>
            <MenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </MenuItem>
            <MenuItem>
              <Input
                label="Search orders..."
                icon={<Search className="h-5 w-5" />}
                className="bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                containerProps={{
                  onClick: (e) => e.stopPropagation()
                }}
              />
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
