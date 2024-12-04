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
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "Products",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Shopping Bag",
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: "Map",
    },
    {
      icon: <CircleUserRound className="h-5 w-5" />,
      title: "Profile"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Settings"
    },
    {
      icon: <LogOut className="h-5 w-5" />,
      title: "Log Out"
    }
  ];

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        <Menu className="h-8 w-8" />
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
            <ListItem key={index}>
              <ListItemPrefix>
                {item.icon}
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                {item.title}
              </Typography>
              {item.suffix && <ListItemSuffix>{item.suffix}</ListItemSuffix>}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
