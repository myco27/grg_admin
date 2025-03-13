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
import { Search } from "lucide-react";
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
    },
    {
      label: "Area Manager",
      value: "operator",
    },
    {
      label: "Restaurant",
      value: "restaurant",
    },
    {
      label: "Rider",
      value: "rider",
    },
    {
      label: "Customer",
      value: "customer",
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
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  User list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all Users
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button
         className="flex items-center gap-3"
         size="sm"
         onClick={handleOpen}
       >
         <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add admin
       </Button> */}
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row rounded-none">
              <Tabs
                value=""
                className="w-full md:w-fit border px-1 border-gray-400 py-0.5 bg-white rounded-lg relative overflow-x-auto xl:overflow-visible"
              >
                <TabsHeader
                  className="bg-transparent gap-x-4"
                  indicatorProps={{
                    className: "bg-purple-200 text-purple-900",
                  }}
                >
                  {TABS.map(({ label, value }) => (
                    <Tab
                      className="text-nowrap text-sm font-medium text-gray-800 w-max"
                      key={value}
                      value={value}
                      onClick={() => handleClickStatus(value)}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
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
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-4 overflow-scroll">
            {pagination.isLoading ? (
              <Loading />
            ) : (
              <table className="border w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={head}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {head}{" "}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    return (
                      <tr key={user.id}>
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
                                user.is_active == 1 ? "active" : "inactive"
                              }
                              color={
                                user.is_active == 1 ? "green" : "blue-gray"
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
