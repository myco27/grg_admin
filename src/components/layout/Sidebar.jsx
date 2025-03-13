import React from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import {
  LayoutDashboard,
  CircleUserRound,
  Package,
  Settings,
  Menu,
  ShoppingBag,
  Map,
  LogOut,
  Bike,
  BoxIcon,
  UserCog
  
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const { user, setUser, setToken } = useStateContext();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Orders",
      path: "/orders" // Add path for navigation
    },
    {
      icon: <Bike className="h-5 w-5" />,
      title: "Riders",
      path: "/riders" // Add path for navigation
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: "User Management",
      path: "/user-management" // Add path for navigation
    },
    {
      
      icon: <UserCog />,
      title: "Role Management",
      path: "/role-management" // Add path for navigation
    },
    // {
    //   icon: <CircleUserRound className="h-5 w-5" />,
    //   title: "Profile",
    //   path: "/profile" // Add path for navigation
    // },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Settings",
      path: "/settings" // Add path for navigation
    },
    {
      icon: <LogOut className="h-5 w-5 text-red-500" />,
      title: "Log Out",
      path: "handleLogout",
      isLogout: true,
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/admin/logout");
      if (response.status === 204) {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER"); 

        setUser(null);
        setToken(null);
        navigate("/admin/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        <Menu className="mt-[-4px] h-8 w-8 text-white"/>
      </IconButton>
      <Drawer open={open} onClose={closeDrawer}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            Dashboard Menu
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <List>
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <ListItem as={Link} to={item.path} 
                onClick={() => {
                  if (item.isLogout) {
                    handleLogout();
                  } else {
                    closeDrawer();
                  }
                }}
              > 
                <ListItemPrefix>
                  {item.icon}
                </ListItemPrefix>
                <Typography color="blue-gray" className={`mr-auto font-normal ${item.isLogout ? "text-red-500" : ""}`} >
                  {item.title}
                </Typography>
                {item.suffix && <ListItemSuffix>{item.suffix}</ListItemSuffix>}
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
