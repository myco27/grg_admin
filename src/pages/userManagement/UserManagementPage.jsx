import { PencilIcon } from "@heroicons/react/24/solid";
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
  Collapse,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { useContext, useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import "react-day-picker/style.css";
import {
  Bike,
  CalendarRangeIcon,
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [totalCount, setTotalCount] = useState({});
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

  const handleDateSelect = (range) => {
    if (range.from && range.to) {
      setStartDate(range.from);
      setEndDate(range.to);
    } else if (range.from) {
      setStartDate(range.from);
      setEndDate(null);
    }
  };
  const [tableHeadOrder, setTableHeadOrder] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [isRotated, setIsRotated] = useState(false);
  const [openPrevCal, setOpenPrevCal] = useState(false);
  const { user } = useStateContext();

  const handleClearFilter = async () => {
    setStartDate(null);
    setEndDate(null);
    setFilterStatus({
      active: false,
      inactive: false,
      suspended: false,
      deleted: false,
    });
    try {
      const response = await axiosClient.get("admin/users/get");
      const responseData = response.data.data;

      setUsers(responseData.data);

      const { current_page, last_page, total, links, per_page } = responseData;

      setPagination({
        page: current_page,
        totalPages: last_page,
        totalItems: total,
        links: links,
        itemsPerPage: per_page,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to clear filters:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setPagination((prev) => ({ ...prev, isLoading: true }));

      const formattedStartDate = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : null;
      const formattedEndDate = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : null;

      const filteredStatus = [];

      if (statusFilter.inactive) filteredStatus.push(0);
      if (statusFilter.active) filteredStatus.push(1);
      if (statusFilter.suspended) filteredStatus.push(2);
      if (statusFilter.deleted) filteredStatus.push(3);

      const data = {
        user_type: status,
        search: debounceSearch,
        page: pagination.page || 1,
        page_size: pagination.itemsPerPage || 10,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        status_filter: filteredStatus,
      };

      const response = await axiosClient.get("/admin/users", { params: data });

      const responseData = response.data.data;
      const { current_page, last_page, total, links, per_page } = responseData;

      setUsers(responseData.data);
      setTotalCount(response.data.totalCount || 0);
      setPagination((prev) => ({
        ...prev,
        page: current_page,
        totalPages: last_page,
        totalItems: total,
        links,
        itemsPerPage: per_page,
        isLoading: false,
      }));
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setOpenPrevCal(!openPrevCal);
      setPagination((prev) => ({ ...prev, isLoading: false }));
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
    const newPagination = {
      ...pagination,
      page: 1,
      itemsPerPage: Number(newSize),
    };
    setPagination(newPagination);
    fetchUsers({ ...newPagination, search: searchTerm, ...filter });
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
      color: "bg-purple-500",
      count: totalCount.all,
    },
    {
      label: "Area Manager",
      value: "operator",
      icon: <LandPlot className="h-4 w-4" />,
      color: "bg-green-500",
      count: totalCount.operator,
    },
    {
      label: "Central",
      value: "central",
      icon: <Store className="h-4 w-4" />,
      color: "bg-red-500",
      count: totalCount.central,
    },
    {
      label: "Restaurant",
      value: "restaurant",
      icon: <Store className="h-4 w-4" />,
      color: "bg-blue-500",
      count: totalCount.restaurant,
    },
    {
      label: "Rider",
      value: "rider",
      icon: <Bike className="h-4 w-4" />,
      color: "bg-orange-500",
      count: totalCount.rider,
    },
    {
      label: "Customer",
      value: "customer",
      icon: <UserRound className="h-4 w-4" />,
      color: "bg-pink-500",
      count: totalCount.customer,
    },
  ];

  console.log("tabs counts", TABS);

  const TABLE_HEAD = [
    "User ID",
    "User Information",
    "User Type",
    "Social Type",
    "Status",
    "Date Created",
    "Action",
  ];

  const defaultClassNames = getDefaultClassNames();

  return (
    <>
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
                {TABS.map(({ label, value, icon, color, count }) => (
                  <Tab
                    key={value}
                    className="rounded-md"
                    value={value}
                    onClick={() => handleClickStatus(value)}
                  >
                    <div className="flex items-center gap-2 text-nowrap px-4 text-sm font-medium text-gray-800">
                      {icon}
                      <span className="text-sm">{label}</span>
                    </div>
                    {typeof count === "number" && (
                      <span
                        className={`absolute -top-2 -right-2 z-20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}
                      >
                        {count}
                      </span>
                    )}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="flex w-full items-center gap-2 rounded-md md:w-72">
              <Menu
                dismiss={{ itemPress: false }}
                placement="bottom-start"
                className="hover:none"
              >
                <MenuHandler>
                  <IconButton variant="text">
                    <FilterIcon />
                  </IconButton>
                </MenuHandler>
                <MenuList className="max-h-max max-w-max space-y-2">
                  {/* Filter by Date */}
                  <MenuItem className="flex flex-col items-center justify-center gap-1">
                    <span className="mb-2 font-medium">Filter by Date</span>
                    <div>
                      <Input
                        readOnly={true}
                        className="flex items-center justify-center text-center"
                        icon={<CalendarRangeIcon />}
                        label="Select Date"
                        value={
                          startDate && endDate
                            ? `${format(startDate, "PPP")} → ${format(
                                endDate,
                                "PPP"
                              )}`
                            : startDate
                            ? `${format(startDate, "PPP")} → ...`
                            : ""
                        }
                        onClick={() => setOpenPrevCal(!openPrevCal)}
                      />
                      <Collapse
                        open={openPrevCal}
                        className="flex w-full justify-center"
                      >
                        <DayPicker
                          captionLayout="label"
                          mode="range"
                          selected={{ from: startDate, to: endDate }}
                          onSelect={handleDateSelect}
                          showOutsideDays
                          components={{
                            IconLeft: ({ ...props }) => (
                              <ChevronLeftIcon
                                {...props}
                                className="h-5 w-5 stroke-2"
                              />
                            ),
                            IconRight: ({ ...props }) => (
                              <ChevronRightIcon
                                {...props}
                                className="h-5 w-5 stroke-2"
                              />
                            ),
                          }}
                        />
                      </Collapse>
                    </div>
                  </MenuItem>
                  <hr className="my-3" />
                  {/* Filter by Status */}
                  <MenuItem className="flex w-full flex-col items-start">
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
                    <div className="flex w-full flex-col gap-1">
                      <Button
                        className="mt-3 w-full bg-primary"
                        onClick={fetchUsers}
                      >
                        Filter
                      </Button>
                      <Button className="w-full" onClick={handleClearFilter}>
                        Clear Filter
                      </Button>
                    </div>
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
                                    user.is_active == 0
                                      ? "Inactive"
                                      : user.is_active == 1
                                      ? "Active"
                                      : user.is_active == 2
                                      ? "Suspended"
                                      : user.is_active == 3
                                      ? "Deleted"
                                      : user.is_active == 4
                                      ? "Terminated"
                                      : ""
                                  }
                                  color={
                                    user.is_active == 0
                                      ? "blue-gray"
                                      : user.is_active == 1
                                      ? "green"
                                      : user.is_active == 2
                                      ? "orange"
                                      : user.is_active == 3
                                      ? "red"
                                      : user.is_active == 4
                                      ? "deep-orange"
                                      : ""
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
            onPageSizeChange={(newSize) => handlePageSizeChange(newSize)}
          />
        </CardFooter>
      </Card>

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
