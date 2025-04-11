import {
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
  Switch,
  Badge,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import { Search, ArrowLeftRight, ArrowDownUp } from "lucide-react";
import useDebounce from "../../components/UseDebounce";
import Pagination from "../../components/OrdersPage/Pagination";
import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";
import ViewAdminModal from "./ViewAdminModal";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useAlert } from "../../contexts/alertContext";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [isColumnReversed, setisColumnReversed] = useState(false);
  const { showAlert } = useAlert();
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const TABLE_HEAD = [
    "User ID",
    "User Information",
    "Roles",
    "Permissions",
    "Status",
    "Date Created",
    "Action",
  ];

  const reversedThead = isColumnReversed
    ? (() => {
        const reversedHead = [
          TABLE_HEAD[TABLE_HEAD.length - 1],
          ...TABLE_HEAD.slice(0, -1),
        ];
        return reversedHead;
      })()
    : TABLE_HEAD;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/roles/users-with-roles", {
        params: {
          search: debounceSearch,
          page: pagination.page,
          page_size: pagination.itemsPerPage,
        },
      });
      console.log(response.data.data, "response");
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
      setLoading(false);
    }
  };

  const confirmToggleStatus = async () => {
    setConfirmationLoading(true);
    try {
      const response = await axiosClient.put(`/admin/status/${userId}/update`, {
        status_id: status,
      });

      if (response.status === 200) {
        showAlert(response.data.message, "success");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpenConfirmation(false);
      setConfirmationLoading(false);
      setOpen(false);
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

  const handleOpenView = (userId) => {
    setSelectedUserId(userId);
    setOpenView((openView) => !openView);
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

  const handleSwitch = (userId, statusId) => {
    setUserId(userId);
    setStatus(statusId);
    setOpenConfirmation(true);
  };

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
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
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
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <button onClick={() => setisColumnReversed(!isColumnReversed)}>
                <ArrowLeftRight className="text-gray-500 hover:text-gray-700" />
              </button>
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

        <CardBody className="overflow-scroll p-4">
          {pagination.isLoading ? (
            <Loading />
          ) : (
            <table className="w-full min-w-max table-auto rounded-md text-left">
              <thead>
                <tr>
                  {reversedThead.map((head, index) => (
                    <th
                      key={head}
                      className={`bg-tableHeaderBg p-4 ${
                        index === 0 ? "rounded-tl-md rounded-bl-md" : ""
                      } ${
                        index === reversedThead.length - 1
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
                  const columns = [
                    {
                      key: "id",
                      value: (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.id}
                        </Typography>
                      ),
                      className: "flex p-4",
                    },
                    {
                      key: "name",
                      value: (
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center justify-center">
                            <img
                              src={user.profile_picture ? `${import.meta.env.VITE_APP_IMAGE_PATH}/profileImage/${user.profile_picture}` : ''}
                              alt="profile"
                              className="h-[50px] w-[50px] rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = '/rocky_go_logo.png';
                                e.target.onerror = null;
                              }}
                            />
                            <Badge
                              color={
                                user.personal_access_tokens?.length > 0
                                  ? "green"
                                  : "red"
                              }
                              className="absolute h-[15px] w-[15px] top-4 right-1.5 border-2 border-white"
                            />
                          </div>
                          <div>
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
                      ),
                      className: "p-4",
                    },
                    {
                      key: "role",
                      value: (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.roles?.[0]?.name?.toUpperCase() || "N/A"}
                        </Typography>
                      ),
                      className: "p-4",
                    },
                    {
                      // key: "permissions",
                      // value: (
                      //   <div
                      //     className="flex cursor-pointer flex-wrap rounded font-normal"
                      //     onClick={() => handleOpenView(user.id)}
                      //   >
                      //     {user.all_permissions?.length > 0 ? (
                      //       <>
                      //         {user.all_permissions
                      //           .slice(0, 3)
                      //           .map((perm, index) => (
                      //             <span key={index}>
                      //               <Chip
                      //                 color="purple"
                      //                 variant="text"
                      //                 size="sm"
                      //                 className="m-1 max-w-fit bg-purple-50 text-purple-900"
                      //                 value={perm}
                      //               />
                      //               {index !== 2 &&
                      //                 index !==
                      //                   user.all_permissions.length - 1 &&
                      //                 " "}
                      //             </span>
                      //           ))}
                      //         {user.all_permissions.length > 3 && (
                      //           <Tooltip
                      //             content="View more"
                      //             placement="right-end"
                      //           >
                      //             <Typography
                      //               variant="h4"
                      //               className="text-gray-400 hover:text-gray-600"
                      //             >
                      //               ...
                      //             </Typography>
                      //           </Tooltip>
                      //         )}
                      //       </>
                      //     ) : (
                      //       "No Permissions"
                      //     )}
                      //   </div>
                      // ),
                      // className: "max-w-60",
                      key: "permissions",
                      value: (
                        <div
                          className="flex cursor-pointer flex-col rounded font-normal"
                          onClick={() => handleOpenView(user.id)}
                        >
                          {user.all_permissions?.length > 0 ? (
                            <>
                              {user.all_permissions
                                .slice(0, 2)
                                .map((perm, index) => (
                                  <Chip
                                    key={index}
                                    color="purple"
                                    variant="text"
                                    size="sm"
                                    className="m-1 max-w-fit bg-purple-50 text-purple-900"
                                    value={perm}
                                  />
                                ))}

                              {/* Last chip + "..." in a row */}
                              <div className="flex items-center">
                                <Chip
                                  color="purple"
                                  variant="text"
                                  size="sm"
                                  className="m-1 max-w-fit bg-purple-50 text-purple-900"
                                  value={user.all_permissions[2]}
                                />
                                {user.all_permissions.length > 3 && (
                                  <Tooltip
                                    content="View more"
                                    placement="right-end"
                                  >
                                    <Typography
                                      variant="h4"
                                      className="ml-1 text-gray-400 hover:text-gray-600"
                                    >
                                      ...
                                    </Typography>
                                  </Tooltip>
                                )}
                              </div>
                            </>
                          ) : (
                            "No Permissions"
                          )}
                        </div>
                      ),
                      className: "w-auto max-w-full",
                    },
                    {
                      key: "status",
                      value: (
                        <div className="items-center p-4">
                          {user.status && typeof user.status === "object" && (
                            <Tooltip
                              className="text-xs"
                              content={user.status.name.toUpperCase()}
                            >
                              <Switch
                                onChange={() =>
                                  handleSwitch(user.id, user.status_id)
                                }
                                checked={user.status.name === "active"}
                                color="green"
                              />
                            </Tooltip>
                          )}
                        </div>
                      ),
                      className: "max-w-60",
                    },
                    {
                      key: "created_at",
                      value: (
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
                      ),
                      className: "p-4",
                    },
                    {
                      key: "actions",
                      value: (
                        <Tooltip content="Edit User">
                          <Menu>
                            <MenuHandler>
                              <IconButton variant="text">
                                <EllipsisHorizontalIcon className="h-10 w-10" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem onClick={() => handleOpenView(user.id)}>
                                View
                              </MenuItem>
                              <MenuItem onClick={() => handleEditOpen(user.id)}>
                                Edit
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Tooltip>
                      ),
                      className: "p-4",
                    },
                  ];

                  const displayColumns = isColumnReversed
                    ? (() => {
                        const reversedCol = [
                          columns[columns.length - 1],
                          ...columns.slice(0, -1),
                        ];
                        return reversedCol;
                      })()
                    : columns;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      {displayColumns.map((col) => (
                        <td key={col.key} className={col.className}>
                          {col.value}
                        </td>
                      ))}
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

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={confirmToggleStatus}
        isLoading={confirmationLoading}
        message={
          status == 1
            ? `Are you sure you want to deactivate this user admin?`
            : `Are you sure you want to activate this user admin?`
        }
      />

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

      <ViewAdminModal
        viewOpen={openView}
        viewHandleOpen={handleOpenView}
        adminId={selectedUserId}
        fetchUsers={fetchUsers}
        loading={loading}
      />
    </>
  );
};

export default AdminManagement;
