import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ChevronDown, LogOut, Menu as MenuIcon, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import ProfileModal from "../Profile/ProfileModal";
import ConfirmationDialog from "../ConfirmationDialog";
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const {
    user,
    setUser,
    setToken,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useStateContext();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleProfileOpen = (userId, userType) => {
    setSelectedUserId(userId);
    setSelectedUser(userType);
    setProfileOpen(!profileOpen);
  };

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
    navigate("/user-management");
  };

  const handleLogout = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const openProfileModal = () => {
    handleProfileOpen(user.id, user.user_type);
    setProfilePicture(user.profile_picture);
  };

  const toggleSidebar = () => {
    // On desktop, toggle the sidebar collapse state
    if (window.innerWidth >= 768) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
    // On mobile, toggle the mobile menu
    else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/user-management":
        return "User Management";
      case "/admin-management":
        return "Admin Management";
      case "/roles-and-permissions":
        return "Roles and Permissions";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-[#612B9B] border-b border-purple-600 shadow-sm py-1 flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <IconButton
          variant="text"
          size="lg"
          onClick={toggleSidebar}
          className="z-10"
        >
          <MenuIcon className="h-6 w-6 text-white" />
        </IconButton>
        <Typography color="white" className="font-medium text-nowrap">
          {getPageTitle()}
        </Typography>
      </div>

      <div className="flex justify-end items-end w-full">
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              className="flex items-center gap-2 p-2 normal-case"
            >
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src={user?.profile_picture ? `${import.meta.env.VITE_APP_IMAGE_PATH}/profileImage/${user?.profile_picture}` : ''}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* <span className="text-blue-600 font-bold text-lg">
                  {" "}
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </span> */}
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
            {/* <MenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </MenuItem>
            <MenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" /> */}
            <MenuItem
              className="flex items-center gap-2 text-gray-500"
              onClick={openProfileModal}
            >
              <User className="h-4 w-4" /> Profile
            </MenuItem>
            <MenuItem
              className="flex items-center gap-2 text-red-500"
              onClick={handleOpen}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <ProfileModal
        open={profileOpen}
        handleOpen={handleProfileOpen}
        userId={selectedUserId}
        userType={selectedUser}
      />

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        isLoading={loading}
        message={"Are you sure you want to log out?"}
      />
    </div>
  );
}
