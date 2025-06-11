import { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Collapse,
} from "@material-tailwind/react";
import {
  UserRound,
  ShieldCheck,
  LockKeyhole,
  LayoutDashboard,
  Newspaper,
  Settings,
  Utensils,
  FileSliders,
  ChevronDown,
  ChevronRight,
  Cog,
  Info,
  Siren,
  Globe,
  Gift,
  Boxes,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";

const Sidebar = () => {
  const {
    user,
    sidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    fetchUser,
  } = useStateContext();
  const location = useLocation();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [freeItemConfigOpen, setfreeItemConfigOpen] = useState(false);

  const handleConfig = () => {
    setConfigOpen(!configOpen);
  };

  const handleFreeItemConfig = () => {
    setfreeItemConfigOpen((freeItemConfigOpen) => !freeItemConfigOpen);
  };

  const canViewDashboardModule = user?.all_permissions?.some(
    (p) => p.name === "view dashboard module" && p.status_id === 1
  );

  const canViewUserModule =
    user?.all_permissions?.some(
      (p) => p.name === "view user module" && p.status_id === 1
    ) || false;

  const canViewAdminModule =
    user?.all_permissions?.some(
      (p) => p.name === "view admin module" && p.status_id === 1
    ) || false;

  const canViewRolesAndPermissionsModule =
    user?.all_permissions?.some(
      (p) => p.name === "view roles and permissions module" && p.status_id === 1
    ) || false;

  const canViewApplicationsModule =
    user?.all_permissions?.some(
      (p) => p.name === "view application module" && p.status_id === 1
    ) || false;

  const canViewSettingsModule =
    user?.all_permissions?.some(
      (p) => p.name === "view settings module" && p.status_id === 1
    ) || false;

  const canViewRestaurantModule =
    user?.all_permissions?.some(
      (p) => p.name === "view restaurant module" && p.status_id === 1
    ) || false;

  const canViewConfigurationModule =
    user?.all_permissions?.some(
      (p) => p.name === "view configuration module" && p.status_id === 1
    ) || false;

  const canViewFreeItems =
    user?.all_permissions?.some(
      (p) => p.name === "view free items" && p.status_id === 1
    ) || false;

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`bg-[#612B9B] fixed top-0 left-0 h-full shadow-xl transition-all duration-300 ease-in-out z-30
          ${sidebarCollapsed ? "w-16" : "w-64"}
          ${sidebarHovered && sidebarCollapsed ? "w-64" : ""}
          overflow-hidden
          hidden md:block`}
        id="sidebar-container"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Background pattern as a fixed element */}
        <div className="pointer-events-none absolute inset-0 w-64">
          <img
            src="/sidebar_pattern.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content container with z-index to appear above the background */}
        <div className="relative z-10 h-full">
          {/* Header with logo */}
          <div
            className={`py-4 flex items-center border-b-2 border-white border-opacity-30 ${
              sidebarCollapsed ? "mx-3" : "mx-5"
            }`}
          >
            <div
              className={` ${
                sidebarCollapsed ? `${sidebarHovered ? "pl-5" : ""}` : ""
              }`}
            >
              <img
                src="/logo.png"
                alt="logo"
                className="h-10 w-10 min-w-[40px]"
              />
            </div>
            <div
              className={`${
                sidebarCollapsed && !sidebarHovered
                  ? "absolute left-[-9999px]"
                  : "ml-3"
              } transition-all duration-300`}
            >
              <Typography
                variant="h5"
                color="white"
                className="whitespace-nowrap"
              >
                Back Office
              </Typography>
            </div>
          </div>

          <div
            className={`${
              sidebarCollapsed ? "mx-3" : "mx-5"
            } border-b-2 border-white border-opacity-30 py-2`}
          >
            <List className="p-0">
              {/* Dashboard */}
              {canViewDashboardModule && (
                <Link to="/dashboard">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/dashboard" ? "!bg-[#3A1066]" : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LayoutDashboard
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/dashboard"
                            ? "text-purple-500"
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
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
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/user-management"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <UserRound
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/user-management"
                            ? "text-purple-500"
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        User Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Restaurant Management */}
              {canViewRestaurantModule && (
                <Link to="/restaurant-management">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/restaurant-management"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Utensils
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/restaurant-management"
                            ? ""
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Restaurant Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Admin Management */}
              {canViewAdminModule && (
                <Link to="/admin-management">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/admin-management"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <ShieldCheck
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/admin-management" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Admin Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Applications */}
              {canViewApplicationsModule && (
                <Link to="/applications">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/applications"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Newspaper
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/applications" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Applications
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Settings */}
              {canViewSettingsModule && (
                <Link to="/settings">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/settings" ? "!bg-[#3A1066]" : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Settings
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/settings" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Settings
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {canViewConfigurationModule && (
                <>
                  <ListItem
                    onClick={handleConfig}
                    className={`cursor-pointer hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname.startsWith("/configuration")
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <FileSliders className="h-5 w-5 text-white" />
                    </ListItemPrefix>
                    <div
                      className={`rounded-sm flex items-center justify-between w-full ${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Configuration
                      </Typography>
                      <span className="ml-auto pr-2">
                        {configOpen ? (
                          <ChevronDown className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                  </ListItem>

                  <Collapse open={configOpen} className="flex flex-col">
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/aboutus"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/aboutus"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Info className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            About Us
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/privacypolicy"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/privacypolicy"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Siren className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            Privacy Policy
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/termsandconditions"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/termsandconditions"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Cog className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            T&C
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                  </Collapse>
                </>
              )}

              {canViewFreeItems && (
                <>
                  <ListItem
                    onClick={handleFreeItemConfig}
                    className={`cursor-pointer hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname.startsWith("/free-items")
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Boxes className="h-5 w-5 text-white" />
                    </ListItemPrefix>
                    <div
                      className={`rounded-sm flex items-center justify-between w-full ${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Promotional
                      </Typography>
                      <span className="ml-auto pr-2">
                        {freeItemConfigOpen ? (
                          <ChevronDown className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                  </ListItem>

                  <Collapse
                    open={freeItemConfigOpen}
                    className="flex flex-col gap-1"
                  >
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      {/* <Link
                        to="/free-items"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith("/free-items")
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Globe className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            Global Items
                          </Typography>
                        </ListItem>
                      </Link> */}
                    </div>

                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/promotions/free-items"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith("/promotions/free-items")
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Gift className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            Free Items
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>

                    {/* <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/termsandconditions"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/termsandconditions"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Cog className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            T&C
                          </Typography>
                        </ListItem>
                      </Link>
                    </div> */}
                  </Collapse>
                </>
              )}

              {/* Roles and Permissions */}
              {canViewRolesAndPermissionsModule && (
                <Link to="/roles-and-permissions">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/roles-and-permissions"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LockKeyhole
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/roles-and-permissions"
                            ? ""
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
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
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Background pattern as a fixed element */}
        <div className="pointer-events-none absolute inset-0 w-64">
          <img
            src="/sidebar_pattern.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content container with z-index to appear above the background */}
        <div className="relative z-10 h-full">
          {/* Header with logo */}
          <div className="mx-5 flex items-center justify-between border-b-2 border-white border-opacity-30 p-5">
            <div className="flex items-center">
              <img src="/logo.png" alt="logo" className="h-10 w-10" />
              <Typography
                variant="h5"
                color="white"
                className="ml-3 whitespace-nowrap"
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
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/dashboard" ? "bg-[#3A1066]" : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LayoutDashboard
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/dashboard"
                            ? "text-purple-500"
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
                      Dashboard
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* User Management */}
              {canViewUserModule && (
                <Link
                  to="/user-management"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItem
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/user-management"
                        ? "bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <UserRound
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/user-management"
                            ? "text-purple-500"
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
                      User Management
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* Restaurant Management */}
              {canViewRestaurantModule && (
                <Link to="/restaurant-management">
                  <ListItem
                    className={`hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname === "/restaurant-management"
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Utensils
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/restaurant-management"
                            ? ""
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <div
                      className={`${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Restaurant Management
                      </Typography>
                    </div>
                  </ListItem>
                </Link>
              )}

              {/* Admin Management */}
              {canViewAdminModule && (
                <Link
                  to="/admin-management"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItem
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/admin-management"
                        ? "bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <ShieldCheck
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/admin-management" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
                      Admin Management
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* Applications */}
              {canViewApplicationsModule && (
                <Link
                  to="/applications"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItem
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/applications"
                        ? "bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Newspaper
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/applications" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
                      Applications
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {/* Settings */}
              {canViewSettingsModule && (
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <ListItem
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/settings" ? "bg-[#3A1066]" : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Settings
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/settings" ? "" : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
                      Settings
                    </Typography>
                  </ListItem>
                </Link>
              )}

              {canViewConfigurationModule && (
                <>
                  <ListItem
                    onClick={handleConfig}
                    className={`cursor-pointer hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname.startsWith("/configuration")
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <FileSliders className="h-5 w-5 text-white" />
                    </ListItemPrefix>
                    <div
                      className={`rounded-sm flex items-center justify-between w-full ${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Configuration
                      </Typography>
                      <span className="ml-auto pr-2">
                        {configOpen ? (
                          <ChevronDown className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                  </ListItem>

                  <Collapse open={configOpen} className="flex flex-col gap-1">
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/aboutus"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/aboutus"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Info className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            About Us
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/privacypolicy"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/privacypolicy"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Siren className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            Privacy Policy
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        configOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/termsandconditions"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/termsandconditions"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Cog className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            T&C
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                  </Collapse>
                </>
              )}

              {canViewFreeItems && (
                <>
                  <ListItem
                    onClick={handleFreeItemConfig}
                    className={`cursor-pointer hover:bg-[#3A1066] ${
                      sidebarCollapsed && !sidebarHovered
                        ? "w-[40px] px-2"
                        : "w-[220px]"
                    } ${
                      location.pathname.startsWith("/free-items")
                        ? "!bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <Boxes className="h-5 w-5 text-white" />
                    </ListItemPrefix>
                    <div
                      className={`rounded-sm flex items-center justify-between w-full ${
                        sidebarCollapsed && !sidebarHovered
                          ? "absolute left-[-9999px]"
                          : ""
                      } transition-all duration-300`}
                    >
                      <Typography
                        color="white"
                        className="whitespace-nowrap text-sm font-normal"
                      >
                        Promotional
                      </Typography>
                      <span className="ml-auto pr-2">
                        {freeItemConfigOpen ? (
                          <ChevronDown className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                  </ListItem>

                  <Collapse
                    open={freeItemConfigOpen}
                    className="flex flex-col gap-1"
                  >
                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      {/* <Link
                        to="/free-items"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith("/free-items")
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Globe className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            Global Items
                          </Typography>
                        </ListItem>
                      </Link> */}
                    </div>

                    <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/promotions/free-items"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith("/promotions/free-items")
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Gift className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                           Free Items
                          </Typography>
                        </ListItem>
                      </Link>
                    </div>
                    {/* <div
                      className={`transition-all rounded duration-300 overflow-hidden max-w-[180px] ml-4 ${
                        freeItemConfigOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <Link
                        to="/configuration/termsandconditions"
                        className="flex w-full items-center"
                      >
                        <ListItem
                          className={`text-white cursor-pointer hover:bg-[#3A1066] focus:text-white active:text-white${
                            sidebarCollapsed && !sidebarHovered
                              ? "w-[40px] px-2"
                              : "w-[220px]"
                          } ${
                            location.pathname.startsWith(
                              "/configuration/termsandconditions"
                            )
                              ? "!bg-[#3A1066] text-white !important"
                              : ""
                          }`}
                        >
                          <ListItemPrefix className="rounded">
                            <Cog className="h-4 w-4 text-white" />
                          </ListItemPrefix>
                          <Typography
                            color="white"
                            className="whitespace-nowrap text-sm font-normal"
                          >
                            T&C
                          </Typography>
                        </ListItem>
                      </Link>
                    </div> */}
                  </Collapse>
                </>
              )}

              {/* Roles and Permissions */}
              {canViewRolesAndPermissionsModule && (
                <Link
                  to="/roles-and-permissions"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItem
                    className={`hover:bg-[#3A1066] w-[220px] ${
                      location.pathname === "/roles-and-permissions"
                        ? "bg-[#3A1066]"
                        : ""
                    }`}
                  >
                    <ListItemPrefix className="min-w-[24px]">
                      <LockKeyhole
                        className={`h-5 w-5 text-white ${
                          location.pathname === "/roles-and-permissions"
                            ? ""
                            : ""
                        }`}
                      />
                    </ListItemPrefix>
                    <Typography color="white" className="text-sm font-normal">
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
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
