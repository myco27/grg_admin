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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import { Search } from "lucide-react";
import useDebounce from "../../components/UseDebounce";
import Pagination from "../../components/OrdersPage/Pagination";
import AddUserModal from "../userManagement/AddUserModal";
import EditUserModal from "../userManagement/EditUserModal";
import useAuthUser from "../../contexts/userContext";

const adminManagement = () => {
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
    itemsPerPage: 0,
    isLoading: false,
  });

  const { user } = useAuthUser();
  const canAddAdmin = user?.all_permissions?.includes("create admin") || false;
  const canViewTable = user?.all_permissions?.includes("view table") || false;

  const fetchUsers = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/roles/users-with-roles", {
        params: {
          user_type: status,
          search: debounceSearch,
          page: pagination.page,
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
  }, [status, debounceSearch, pagination.page]);

  // EVENT LISTENERS START
  const handleClickStatus = (value) => {
    setStatus(value);
  };

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
      isLoading: true,
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
  // EVENT LISTENERS END

  const TABLE_HEAD = [
    "User ID",
    "Full Name",
    "Email",
    "Roles",
    "Permissions",
    "Date Created",
    "Action",
  ];

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Admin list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Admins
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add admin
              </Button>
            </div>
          </div>
          <div className="md:flex-row rounded-none">
            <div className="float-end w-full md:w-72">
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
                  // console.log(
                  //   "Permissions for user:",
                  //   user.id,
                  //   user.all_permissions
                  // );
                  return (
                    <tr key={user.id}>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.id}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.first_name} {user.last_name}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {user.email}
                        </Typography>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.roles
                            ? user.roles[0].name.toUpperCase()
                            : "N/A"}
                        </Typography>
                      </td>

                      {/* Permissions */}
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.all_permissions &&
                          user.all_permissions.length > 0
                            ? user.all_permissions.map((perm, index) => (
                                <span key={index}>
                                  {perm}
                                  {index !== user.all_permissions.length - 1 &&
                                    ", "}
                                </span>
                              ))
                            : "No Permissions"}
                        </Typography>
                      </td>

                      <td className="p-4">
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
            links={pagination.links}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddUserModal
        open={open}
        handleOpen={handleOpen}
        fetchUsers={fetchUsers}
      />
      <EditUserModal
        open={editOpen}
        handleOpen={handleEditOpen}
        userId={selectedUserId}
        userType={selectedUser}
      />
    </>
  );
};

export default adminManagement;
