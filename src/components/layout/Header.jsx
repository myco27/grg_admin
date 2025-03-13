import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDown, Settings, LogOut, User } from "lucide-react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";

export default function Header() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user, setUser, setToken } = useStateContext();

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER");

      setUser(null);
      setToken(null);

      showAlert("Please log in again.", "info");
    }
  }, [user, setUser, setToken, showAlert, navigate]);

  const handleLogoClick = () => {
    navigate('/user-management');
  };

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/admin/logout");
      if (response.status === 204) {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER"); 

        setUser(null);
        setToken(null);

        showAlert("Logged out successfully!", "success");
      }
    } catch (error) {
      showAlert(
        "An error occurred while logging out. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="bg-purple-500 border-b border-purple-600 shadow-sm px-2 sm:px-6 py-1 flex flex-row justify-between items-center">
      <div className="flex items-center">
        <Sidebar />
        <Link to="/orders" onClick={handleLogoClick} >
          <img 
            src="/rockygo_logo.png" 
            alt="RockyGo" 
            className="h-7" 
          />
        </Link>
      </div>

      <div className="flex items-center">
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              className="flex items-center gap-2 p-2 normal-case"
            >
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">  {user?.first_name?.[0]}{user?.last_name?.[0]}</span>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <Typography color="white" className="font-medium">
                  {user?.first_name} {user?.last_name}
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
            <hr className="my-2 border-blue-gray-50" />
            <MenuItem
              className="flex items-center gap-2 text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}
