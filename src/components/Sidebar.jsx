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
  BoxIcon
} from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

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
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Shopping Bag",
      path: "/shopping-bag" // Add path for navigation
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: "Map",
      path: "/map" // Add path for navigation
    },
    {
      icon: <CircleUserRound className="h-5 w-5" />,
      title: "Profile",
      path: "/profile" // Add path for navigation
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Settings",
      path: "/settings" // Add path for navigation
    },
    {
      icon: <LogOut className="h-5 w-5" />,
      title: "Log Out",
      path: "/logout" // Add path for navigation
    }
  ];

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        <Menu className="h-8 w-8 text-white mt-[-4px]"/>
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
              <ListItem as={Link} to={item.path} onClick={closeDrawer}> {/* Use Link component and close drawer on click */}
                <ListItemPrefix>
                  {item.icon}
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
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
