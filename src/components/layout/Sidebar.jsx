import { useContext, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { UserRound, ShieldCheck, LockKeyhole, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useStateContext } from "../../contexts/contextProvider";


const Sidebar = () => {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useStateContext();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarHovered, setSidebarHovered] = useState(false);

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
      {/* Desktop Sidebar */}
      <div
        className={`bg-[#612B9B] fixed top-0 left-0 h-full shadow-xl transition-all duration-300 ease-in-out z-30
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          ${sidebarHovered && sidebarCollapsed ? 'w-64' : ''}
          overflow-hidden
          hidden md:block`}
        id="sidebar-container"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Background pattern as a fixed element */}
        <div className="absolute inset-0 w-64 pointer-events-none">
          <img src="/sidebar_pattern.png" alt="" className="h-full w-full object-cover" />
        </div>
        
        {/* Content container with z-index to appear above the background */}
        <div className="relative z-10 h-full">
          {/* Header with logo */}
          <div className={`py-4 flex items-center border-b-2 border-white border-opacity-30 ${sidebarCollapsed ? 'mx-3' : 'mx-5'}`}>
            <div className={` ${sidebarCollapsed ? `${sidebarHovered ? 'pl-5' : ''}` : ''}`}>
              <img src="/logo.png" alt="logo" className="w-10 h-10 min-w-[40px]" />
            </div>
            <div className={`${sidebarCollapsed && !sidebarHovered ? 'absolute left-[-9999px]' : 'ml-3'} transition-all duration-300`}>
              <Typography
                variant="h5"
                color="white"
                className="whitespace-nowrap"
              >
                Back Office
              </Typography>
            </div>
          </div>

          <div className={`${sidebarCollapsed ? 'mx-3' : 'mx-5'} border-b-2 border-white border-opacity-30 py-2`}>
            <List className="p-0">
              {/* Dashboard */}
              {canViewDashboardModule && (
                <Link to="/dashboard">
                  <ListItem 
                    className={`hover:bg-[#3A1066] ${sidebarCollapsed && !sidebarHovered ? 'w-[40px] px-2' : 'w-[220px]'} ${location.pathname === '/dashboard' ? '!bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LayoutDashboard className={`h-5 w-5 text-white ${location.pathname === '/dashboard' ? 'text-purple-500' : ''}`} />
                    </ListItemPrefix>
                    <div className={`${sidebarCollapsed && !sidebarHovered ? 'absolute left-[-9999px]' : ''} transition-all duration-300`}>
                      <Typography
                        color="white"
                        className="font-normal text-sm whitespace-nowrap"
                      >
                        Dashboard
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* User Management */}
              {canViewUserModule && (
                <Link to="/user-management">
                  <ListItem 
                    className={`hover:bg-[#3A1066] ${sidebarCollapsed && !sidebarHovered ? 'w-[40px] px-2' : 'w-[220px]'} ${location.pathname === '/user-management' ? '!bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <UserRound className={`h-5 w-5 text-white ${location.pathname === '/user-management' ? 'text-purple-500' : ''}`} />
                    </ListItemPrefix>
                    <div className={`${sidebarCollapsed && !sidebarHovered ? 'absolute left-[-9999px]' : ''} transition-all duration-300`}>
                      <Typography
                        color="white"
                        className="font-normal text-sm whitespace-nowrap"
                      >
                        User Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Admin Management */}
              {canViewAdminModule && (
                <Link to="/admin-management">
                  <ListItem 
                    className={`hover:bg-[#3A1066] ${sidebarCollapsed && !sidebarHovered ? 'w-[40px] px-2' : 'w-[220px]'} ${location.pathname === '/admin-management' ? '!bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <ShieldCheck className={`h-5 w-5 text-white ${location.pathname === '/admin-management' ? '' : ''}`} />
                    </ListItemPrefix>
                    <div className={`${sidebarCollapsed && !sidebarHovered ? 'absolute left-[-9999px]' : ''} transition-all duration-300`}>
                      <Typography
                        color="white"
                        className="font-normal text-sm whitespace-nowrap"
                      >
                        Admin Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Roles and Permissions */}
              {canViewRolesAndPermissionsModule && (
                <Link to="/roles-and-permissions">
                  <ListItem 
                    className={`hover:bg-[#3A1066] ${sidebarCollapsed && !sidebarHovered ? 'w-[40px] px-2' : 'w-[220px]'} ${location.pathname === '/roles-and-permissions' ? '!bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LockKeyhole className={`h-5 w-5 text-white ${location.pathname === '/roles-and-permissions' ? '' : ''}`} />
                    </ListItemPrefix>
                    <div className={`${sidebarCollapsed && !sidebarHovered ? 'absolute left-[-9999px]' : ''} transition-all duration-300`}>
                      <Typography
                        color="white"
                        className="font-normal text-sm whitespace-nowrap"
                      >
                        Roles And Permissions
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}
            </List>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`bg-[#612B9B] fixed top-0 left-0 h-full shadow-xl transition-all duration-300 ease-in-out z-40
          w-64 md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Background pattern as a fixed element */}
        <div className="absolute inset-0 w-64 pointer-events-none">
          <img src="/sidebar_pattern.png" alt="" className="h-full w-full object-cover" />
        </div>
        
        {/* Content container with z-index to appear above the background */}
        <div className="relative z-10 h-full">
          {/* Header with logo */}
          <div className="p-5 flex items-center justify-between border-b-2 border-white border-opacity-30 mx-5">
            <div className="flex items-center">
              <img src="/logo.png" alt="logo" className="w-10 h-10" />
              <Typography
                variant="h5"
                color="white"
                className="whitespace-nowrap ml-3"
              >
                Back Office
              </Typography>
            </div>
          </div>

          <div className="mx-5 border-b-2 border-white border-opacity-30 py-2">
            <List className="p-0">
              {/* Dashboard */}
              {canViewDashboardModule && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <ListItem 
                    className={`hover:bg-[#3A1066] w-[220px] ${location.pathname === '/dashboard' ? 'bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LayoutDashboard className={`h-5 w-5 text-white ${location.pathname === '/dashboard' ? 'text-purple-500' : ''}`} />
                    </ListItemPrefix>
                    <Typography
                      color="white"
                      className="font-normal text-sm"
                    >
                      Dashboard
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* User Management */}
              {canViewUserModule && (
                <Link to="/user-management" onClick={() => setMobileMenuOpen(false)}>
                  <ListItem 
                    className={`hover:bg-[#3A1066] w-[220px] ${location.pathname === '/user-management' ? 'bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <UserRound className={`h-5 w-5 text-white ${location.pathname === '/user-management' ? 'text-purple-500' : ''}`} />
                    </ListItemPrefix>
                    <Typography
                      color="white"
                      className="font-normal text-sm"
                    >
                      User Management
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* Admin Management */}
              {canViewAdminModule && (
                <Link to="/admin-management" onClick={() => setMobileMenuOpen(false)}>
                  <ListItem 
                    className={`hover:bg-[#3A1066] w-[220px] ${location.pathname === '/admin-management' ? 'bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <ShieldCheck className={`h-5 w-5 text-white ${location.pathname === '/admin-management' ? '' : ''}`} />
                    </ListItemPrefix>
                    <Typography
                      color="white"
                      className="font-normal text-sm"
                    >
                      Admin Management
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* Roles and Permissions */}
              {canViewRolesAndPermissionsModule && (
                <Link to="/roles-and-permissions" onClick={() => setMobileMenuOpen(false)}>
                  <ListItem 
                    className={`hover:bg-[#3A1066] w-[220px] ${location.pathname === '/roles-and-permissions' ? 'bg-[#3A1066]' : ''}`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LockKeyhole className={`h-5 w-5 text-white ${location.pathname === '/roles-and-permissions' ? '' : ''}`} />
                    </ListItemPrefix>
                    <Typography
                      color="white"
                      className="font-normal text-sm"
                    >
                      Roles And Permissions
                    </Typography>
                  </ListItem>
                </Link>
              )}
            </List>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 