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
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import {
  Bike,
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
import {  ArrowLeftRight } from 'lucide-react';



const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });
  const [tableHeadOrder, setTableHeadOrder] = useState([0, 1, 2, 3, 4, 5]);
  const [isRotated, setIsRotated] = useState(false);

  const { user } = useStateContext();
  const canViewUserModule =
    user?.all_permissions?.includes("view user module") || false;

  const fetchUsers = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/admin/users/list", {
        params: {
          user_type: status,
          search: debounceSearch,
          page: pagination.page,
          page_size: pagination.itemsPerPage,
        },
      });

      if (response.status === 200) {
        const responseData = response.data.data;

        const { current_page, last_page, total, links, per_page } =
          response.data.data;

        const newPagination = {
          page: current_page,
          totalPages: last_page,
          totalItems: total,
          links: links,
          itemsPerPage: per_page,
          isLoading: false,
        };
        setUsers(responseData.data);
        setPagination(newPagination);
      }
    } catch (error) {
      // navigate("/notfound");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [status, debounceSearch, pagination.page, pagination.itemsPerPage]);

  // EVENT LISTENERS START
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
    setPagination({
      ...pagination,
      page: newPage,
    });
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
    setTableHeadOrder(prevOrder => {
      if (isRotated) {
        // If already rotated, revert to original order
        return [0, 1, 2, 3, 4, 5];
      } else {
        // Rotate: move last to first, shift others right
        const newOrder = [prevOrder[prevOrder.length - 1], ...prevOrder.slice(0, -1)];
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
              <div className="w-full rounded-md md:w-72">
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
                        switch(colIndex) {
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
                                    {user.user_type ? user.user_type.toUpperCase() : ""}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 3: // Status
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
                          case 4: // Date Created
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(user.created_at).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </div>
                              </td>
                            );
                          case 5: // Action
                            return (
                              <td className="p-4" key={`col-${colIndex}`}>
                                <Tooltip content="Edit User">
                                  <IconButton
                                    variant="text"
                                    onClick={() => handleEditOpen(user.id, user.user_type)}
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
