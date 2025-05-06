import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Spinner,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Checkbox,
  Popover,
  PopoverHandler,
  PopoverContent,
  Collapse,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import {
  Bike,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  LandPlot,
  LayoutDashboard,
  Search,
  Store,
  UserRound,
} from "lucide-react";
import useDebounce from "../../components/UseDebounce";
import Pagination from "../../components/OrdersPage/Pagination";
import EditUserModal from "./EditUserModal";
import { useStateContext } from "../../contexts/contextProvider";
import { ArrowLeftRight } from "lucide-react";

const UserManagementPage = () => {
  const [prevDate, setPrevDate] = useState(null);
  const [currDate, setCurrDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [editOpen, setEditOpen] = useState(false);  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dateCur, setDateCur] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });
  const [statusFilter, setFilterStatus] = useState({
    active: false,
    inactive: false,
    suspended: false,
    deleted: false,
  });


  const [tableHeadOrder, setTableHeadOrder] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [isRotated, setIsRotated] = useState(false);
  const [openPrevCal, setOpenPrevCal] = useState(false);
  const [openCurrCal,setOpenCurrCal] = useState(false);
  const { user } = useStateContext();
  const canViewUserModule =
    user?.all_permissions?.includes("view user module") || false;

    
    const fetchUsers = async (customPagination = pagination, customSearch = searchTerm) => {
      try {
        setPagination(prev => ({ ...prev, isLoading: true }));
    
        const formattedStartDate = prevDate ? new Date(prevDate).toISOString().split("T")[0] : null;
        const formattedEndDate = currDate ? new Date(currDate).toISOString().split("T")[0] : null;
    
        const data = {
          user_type: status,
          search: debounceSearch,
          page: pagination.page || 1,
          page_size: pagination.itemsPerPage || 10,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          active: statusFilter.active,
          inactive: statusFilter.inactive,
          deleted: statusFilter.deleted,
          suspended: statusFilter.suspended
        };
        
    
        const response = await axiosClient.get("/admin/users", { params: data });
    
        if (response.status === 200) {
          const responseData = response.data.data;
          const { current_page, last_page, total, links, per_page } = responseData;
          console.log(responseData.data)
          console.log(data)
          setUsers(responseData.data);
          setPagination(prev => ({
            ...prev,
            page: current_page,
            totalPages: last_page,
            totalItems: total,
            links,
            itemsPerPage: per_page,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    
    
    

  useEffect(() => {
    fetchUsers();
  }, [status, debounceSearch, pagination.page, pagination.itemsPerPage]);


  const handleClickStatus = (value) => {
    setPagination({ ...pagination, page: 1, itemsPerPage: 10 });
    setStatus(value);
  };

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: 10,
    });
  };
const handlePageChange = (newPage) => {
  const newPagination = { ...pagination, page: newPage };
  setPagination(newPagination);


  fetchUsers({ ...newPagination, search: searchTerm, ...filter });
};

  
  
  



  const handleEditOpen = (userId, userType) => {
    setSelectedUserId(userId);
    setSelectedUser(userType);
    setEditOpen(!editOpen);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(newSize),
    });
  };

  const rotateColumns = () => {
    setTableHeadOrder((prevOrder) => {
      if (isRotated) {
        // If already rotated, revert to original order
        return [0, 1, 2, 3, 4, 5, 6];
      } else {
        // Rotate: move last to first, shift others right
        const newOrder = [
          prevOrder[prevOrder.length - 1],
          ...prevOrder.slice(0, -1),
        ];
        return newOrder;
      }
    });
    setIsRotated(!isRotated); // Toggle the rotation state
  };
  // EVENT LISTENERS END


  const TABS = [
    {
      label: "All",
      value: "",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Area Manager",
      value: "operator",
      icon: <LandPlot className="h-4 w-4" />,
    },
    {
      label: "Central",
      value: "central",
      icon: <Store className="h-4 w-4" />,
    },
    {
      label: "Rider",
      value: "rider",
      icon: <Bike className="h-4 w-4" />,
    },
    {
      label: "Customer",
      value: "customer",
      icon: <UserRound className="h-4 w-4" />,
    },
  ];

  const TABLE_HEAD = [
    "User ID",
    "User Information",
    "User Type",
    "Social Type",
    "Status",
    "Date Created",
    "Action",
  ];

  return (
    <>
      {canViewUserModule && (
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="black">
                  User list
                </Typography>
                <Typography className="font-normal">
                  See information about all Users
                </Typography>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs
                value=""
                className="relative w-full overflow-x-auto rounded-md md:w-fit xl:overflow-visible"
              >
                <TabsHeader className="gap-x-4 bg-headerBg">
                  {TABS.map(({ label, value, icon }) => (
                    <Tab
                      key={value}
                      className="rounded-md"
                      value={value}
                      onClick={() => handleClickStatus(value)}
                    >
                      <div className="flex items-center gap-2 text-nowrap px-4 text-sm font-medium text-gray-800">
                        {icon}
                        {label}
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="flex w-full flex-row items-center gap-2 rounded-md md:w-72">
                <Menu dismiss={{ itemPress: false }}>
                  <MenuHandler>
                    <IconButton variant="text">
                      <FilterIcon />
                    </IconButton>
                  </MenuHandler>
                  <MenuList className="space-y-2">
                    {/* Filter by Date */}
                    <MenuItem className="flex flex-col items-center justify-center gap-1">
                      <span className="mb-2 font-medium">Filter by Date</span>
                      <div>{!dateCur?(
                        <>
                        <Input
                          label="Select Starting Date"
                          value={prevDate ? format(prevDate, "PPP") : ""}
                          className="mb-2"
                          onClick={() => setOpenPrevCal(!openPrevCal)}
                        />
                        <Collapse open={openPrevCal}>
                          <DayPicker
                            mode="double"
                            selected={prevDate}
                            onSelect={setPrevDate}
                            showOutsideDays
                            className="border-0"
                            classNames={{
                              caption:
                                "flex justify-center py-2 mb-4 relative items-center",
                              caption_label:
                                "text-sm font-medium text-gray-900",
                              nav: "flex items-center",
                              nav_button:
                                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                              nav_button_previous: "absolute left-1.5",
                              nav_button_next: "absolute right-1.5",
                              table: "w-full border-collapse",
                              head_row: "flex font-medium text-gray-900",
                              head_cell: "m-0.5 w-9 font-normal text-sm",
                              row: "flex w-full mt-2",
                              cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal",
                              day_range_end: "day-range-end",
                              day_selected:
                                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                              day_today: "rounded-md bg-gray-200 text-gray-900",
                              day_outside:
                                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                              day_disabled: "text-gray-500 opacity-50",
                              day_hidden: "invisible",
                            }}
                            components={{
                              IconLeft: ({ ...props }) => (
                                <ChevronLeftIcon
                                  {...props}
                                  className="h-4 w-4 stroke-2"
                                />
                              ),
                              IconRight: ({ ...props }) => (
                                <ChevronRightIcon
                                  {...props}
                                  className="h-4 w-4 stroke-2"
                                />
                              ),
                            }}
                          />
                        </Collapse>
                        </>
                        )
                        :
                        (
                        <>
                        <Input
                          label="Select End Date"
                          onChange={() => null}
                          value={currDate ? format(currDate, "PPP") : ""}
                          className="mb-2"
                          onClick={() => setOpenCurrCal(!openCurrCal)}
                        />
                        <Collapse open={openCurrCal}>
                          <DayPicker
                            mode="single"
                            selected={currDate}
                            onSelect={setCurrDate}
                            onClick={setDateCur(!dateCur)}
                            showOutsideDays
                            className="border-0"
                            classNames={{
                              caption:
                                "flex justify-center py-2 mb-4 relative items-center",
                              caption_label:
                                "text-sm font-medium text-gray-900",
                              nav: "flex items-center",
                              nav_button:
                                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                              nav_button_previous: "absolute left-1.5",
                              nav_button_next: "absolute right-1.5",
                              table: "w-full border-collapse",
                              head_row: "flex font-medium text-gray-900",
                              head_cell: "m-0.5 w-9 font-normal text-sm",
                              row: "flex w-full mt-2",
                              cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal",
                              day_range_end: "day-range-end",
                              day_selected:
                                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                              day_today: "rounded-md bg-gray-200 text-gray-900",
                              day_outside:
                                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                              day_disabled: "text-gray-500 opacity-50",
                              day_hidden: "invisible",
                            }}
                            components={{
                              IconLeft: ({ ...props }) => (
                                <ChevronLeftIcon
                                  {...props}
                                  className="h-4 w-4 stroke-2"
                                />
                              ),
                              IconRight: ({ ...props }) => (
                                <ChevronRightIcon
                                  {...props}
                                  className="h-4 w-4 stroke-2"
                                />
                              ),
                            }}
                          />
                        </Collapse>
                        </>
                      )}
                      </div>

                    </MenuItem>
                    

                    <hr className="my-3" />

                    {/* Filter by Status */}
                    <MenuItem className="flex flex-col items-start">
                      <span className="mb-2 font-medium">Filter by Status</span>
                      {Object.entries(statusFilter).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex w-full flex-row items-center gap-2"
                        >
                          <Checkbox
                            containerProps={{ className: "p-1" }}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            checked={value}
                            onChange={() =>
                              setFilterStatus((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                          />
                        </div>
                      ))}
                      <Button className="mt-3 w-full" onClick={fetchUsers}>Filter</Button>
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Input
                  label="Search User"
                  icon={
                    pagination.isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )
                  }
                  size="md"
                  className="bg-white"
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e)}
                />
                <button
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                  onClick={rotateColumns}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-scroll p-4">
            {pagination.isLoading ? (
              <Loading />
            ) : (
              <table className="w-full min-w-max table-auto rounded-md text-left">
                <thead>
                  <tr>
                    {tableHeadOrder.map((colIndex, index) => (
                      <th
                        key={TABLE_HEAD[colIndex]}
                        className={`bg-tableHeaderBg p-4 ${
                          index === 0 ? "rounded-tl-md rounded-bl-md" : ""
                        } ${
                          index === TABLE_HEAD.length - 1
                            ? "rounded-tr-md rounded-br-md"
                            : ""
                        }`}
                      >
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {TABLE_HEAD[colIndex]}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={user.id}
                    >
                      {tableHeadOrder.map((colIndex) => {
                        // Return the appropriate cell based on column index
                        switch (colIndex) {
                          case 0: // User ID
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {user.id}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 1: // User Information
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {user.first_name} {user.last_name}
                                    </Typography>
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal opacity-70"
                                    >
                                      {user.email}
                                    </Typography>
                                  </div>
                                </div>
                              </td>
                            );
                          case 2: // User Type
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {user.user_type
                                      ? user.user_type.toUpperCase()
                                      : ""}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 3: // Social Type
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {user.social_type
                                      ? user.social_type.toUpperCase()
                                      : "ROCKYGO"}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 4: // Status
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="w-max">
                                  <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={
                                      user.is_active == 1
                                        ? "Active"
                                        : user.is_active == 2
                                        ? "Suspended"
                                        : user.is_active == 3
                                        ? "Deleted"
                                        : "Inactive"          
                                    }
                                    color={
                                      user.is_active == 1
                                        ? "green"
                                        : user.is_active == 2
                                        ? "orange"
                                        : user.is_active == 3
                                        ? "red"
                                        : "blue-gray"
                                    }
                                  />
                                </div>
                              </td>
                            );
                          case 5: // Date Created
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(user.created_at).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 6: // Action
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <Tooltip content="Edit User">
                                  <IconButton
                                    variant="text"
                                    onClick={() =>
                                      handleEditOpen(user.id, user.user_type)
                                    }
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            );
                          default:
                            return null;
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>

          <CardFooter className="">
            <Pagination
              currentPage={pagination.page}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => handlePageChange(newPage)}
              isLoading={pagination.isLoading}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardFooter>
        </Card>
      )}

      {/* MODALS */}
      <EditUserModal
        open={editOpen}
        handleOpen={handleEditOpen}
        userId={selectedUserId}
        userType={selectedUser}
        fetchUsers={fetchUsers}
      />
    </>
  );
};

export default UserManagementPage;
