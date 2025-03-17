import {
  PencilIcon,
  UserPlusIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
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
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import { Search } from "lucide-react";
import useDebounce from "../../components/UseDebounce";
import Pagination from "../../components/OrdersPage/Pagination";
import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const fetchUsers = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/roles/users-with-roles", {
        params: {
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
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debounceSearch, pagination.page, pagination.itemsPerPage]);

  // EVENT LISTENERS START
  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleEditOpen = (userId) => {
    setSelectedUserId(userId);
    setEditOpen(!editOpen);
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(newSize),
    });
  };

  // EVENT LISTENERS END

  const TABLE_HEAD = [
    "User ID",
    "User Information",
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
            <div className="rounded-md flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="w-5" /> Add admin
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
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
                size="lg"
                className="bg-white"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e)}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll p-4">
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
                  // console.log(
                  //   "Permissions for user:",
                  //   user
                  // );
                  return (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={user.id}
                    >
                      <td className="flex p-4">
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
                      <td className="max-w-60">
                        <div className="flex flex-wrap font-normal">
                          {user.all_permissions &&
                          user.all_permissions.length > 0
                            ? user.all_permissions.map((perm, index) => (
                                <span key={index}>
                                  <Chip
                                    color="purple"
                                    variant="ghost"
                                    size="sm"
                                    className="m-1 max-w-fit bg-purple-50"
                                    value={perm}
                                  ></Chip>
                                  {index !== user.all_permissions.length - 1 &&
                                    " "}
                                </span>
                              ))
                            : "No Permissions"}
                        </div>
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
                          <Menu>
                            <MenuHandler>
                              <IconButton variant="text">
                                <EllipsisHorizontalIcon className="h-10 w-10" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem>Action 1</MenuItem>
                              <MenuItem>Action 2</MenuItem>
                              <MenuItem>Action 3</MenuItem>
                              <MenuItem>Action 4</MenuItem>
                            </MenuList>
                          </Menu>
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
            onPageSizeChange={(newSize) => handlePageSizeChange(newSize)}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddAdminModal
        open={open}
        handleOpen={handleOpen}
        fetchUsers={fetchUsers}
      />

      <EditAdminModal
        editOpen={editOpen}
        editHandleOpen={handleEditOpen}
        adminId={selectedUserId}
        fetchUsers={fetchUsers}
      />
    </>
  );
};

export default AdminManagement;
