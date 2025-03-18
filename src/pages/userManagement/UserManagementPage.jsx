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
import { AuthContext } from "../../contexts/AuthContext";

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

  const { user } = useContext(AuthContext);
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

  const handleOpen = () => {
    setOpen(!open);
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
  // EVENT LISTENERS END

  const TABS = [
    {
      label: "All",
      value: "",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Area Manager",
      value: "operator",
      icon: <LandPlot className="w-4 h-4" />,
    },
    {
      label: "Central",
      value: "central",
      icon: <Store className="w-4 h-4" />,
    },
    {
      label: "Restaurant",
      value: "restaurant",
      icon: <Store className="w-4 h-4" />,
    },
    {
      label: "Rider",
      value: "rider",
      icon: <Bike className="w-4 h-4" />,
    },
    {
      label: "Customer",
      value: "customer",
      icon: <UserRound className="w-4 h-4" />,
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
                className="rounded-md w-full md:w-fit relative overflow-x-auto xl:overflow-visible"
              >
                <TabsHeader className="bg-headerBg gap-x-4">
                  {TABS.map(({ label, value, icon }) => (
                    <Tab
                      key={value}
                      className="rounded-md"
                      value={value}
                      onClick={() => handleClickStatus(value)}
                    >
                      <div className="flex items-center gap-2 text-nowrap text-sm font-medium text-gray-800 px-4">
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
                  className="rounded-md"
                  icon={
                    pagination.isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )
                  }
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e)}
                />
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-4 overflow-scroll">
            {pagination.isLoading ? (
              <Loading />
            ) : (
              <table className="rounded-md w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={head}
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
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    return (
                      <tr className="border-b border-gray-300 hover:bg-gray-100" key={user.id}>
                        <td className="p-4">
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
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
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

                        <td className="p-4">
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

                        <td className="p-4">
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

                        <td className="p-4">
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
                                  // hour: "2-digit",
                                  // minute: "2-digit",
                                  // second: "2-digit",
                                  // hour12: true,
                                }
                              )}
                            </Typography>
                          </div>
                        </td>

                        <td className="p-4">
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
                      </tr>
                    );
                  })}
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
