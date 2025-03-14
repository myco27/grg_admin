import { useContext, useState } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { Menu, UserRound, ShieldCheck, LockKeyhole, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const { user } = useContext(AuthContext);
  const canViewDashboardModule =
    user?.all_permissions?.includes("view dashboard module") || false;
  const canViewUserModule =
    user?.all_permissions?.includes("view user module") || false;
  const canViewAdminModule =
    user?.all_permissions?.includes("view admin module") || false;
  const canViewRolesAndPermissionsModule =
    user?.all_permissions?.includes("view roles and permissions module") ||
    false;

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        <Menu className="h-8 w-8 text-white mt-[-4px]" />
      </IconButton>
      <Drawer open={open} onClose={closeDrawer}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            Backoffice Menu
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

        {/* Hardcoded Menu Items */}
        <List>
          {/* Orders */}
          {/* <Link to="/orders">
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix>
                <Package className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Orders
              </Typography>
            </ListItem>
          </Link> */}
          {/* Riders */}
          {/* <Link to="/riders">
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix>
                <Bike className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Riders
              </Typography>
            </ListItem>
          </Link> */}

          {/* Dashboard */}
          {canViewDashboardModule && (
            <Link to="/dashboard">
              <ListItem onClick={closeDrawer}>
                <ListItemPrefix>
                  <LayoutDashboard className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </ListItem>
            </Link>
          )}

          {/* User Management */}
          {canViewUserModule && (
            <Link to="/user-management">
              <ListItem onClick={closeDrawer}>
                <ListItemPrefix>
                  <UserRound className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  User Management
                </Typography>
              </ListItem>
            </Link>
          )}

          {/* Admin Management */}
          {canViewAdminModule && (
            <Link to="/admin-management">
              <ListItem onClick={closeDrawer}>
                <ListItemPrefix>
                  <ShieldCheck className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Admin Management
                </Typography>
              </ListItem>
            </Link>
          )}

          {/* Roles and Permissions */}
          {canViewRolesAndPermissionsModule && (
            <Link to="/roles-and-permissions">
              <ListItem onClick={closeDrawer}>
                <ListItemPrefix>
                  <LockKeyhole className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Roles And Permissions
                </Typography>
              </ListItem>
            </Link>
          )}

          {/* Settings */}
          {/* <Link to="/settings">
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix>
                <Settings className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Settings
              </Typography>
            </ListItem>
          </Link> */}
          {/* Logout */}
          {/* <ListItem onClick={handleLogout}>
            <ListItemPrefix>
              <LogOut className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className="mr-auto font-normal text-red-500"
            >
              Log Out
            </Typography>
          </ListItem> */}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
