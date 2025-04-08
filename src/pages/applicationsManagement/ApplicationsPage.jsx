import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
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
import { ArrowLeftRight } from "lucide-react";
import ViewApplicantionModal from "./ViewApplicantionModal";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const ApplicationsPage = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
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

  const fetchUsers = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/admin/applicants", {
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
    setTableHeadOrder((prevOrder) => {
      if (isRotated) {
        // If already rotated, revert to original order
        return [0, 1, 2, 3, 4, 5];
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
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Area Manager",
      value: "operator",
      icon: <LandPlot className="w-4 h-4" />,
    },
    {
      label: "Central",
      value: "restaurant",
      icon: <Store className="w-4 h-4" />,
    },
    // {
    //   label: "Restaurant",
    //   value: "restaurant",
    //   icon: <Store className="w-4 h-4" />,
    // },
    {
      label: "Rider",
      value: "rider",
      icon: <Bike className="w-4 h-4" />,
    },
    // {
    //   label: "Customer",
    //   value: "customer",
    //   icon: <UserRound className="w-4 h-4" />,
    // },
  ];

  const TABLE_HEAD = [
    "Applicant ID",
    "Applicant Information",
    "Type",
    "Status",
    "Date Created",
    "Action",
  ];

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Applications list
              </Typography>
              <Typography className="font-normal">
                See information about all applications
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
              <button
                className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                onClick={rotateColumns}
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>
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
                    key={user.applicant_id}
                  >
                    {tableHeadOrder.map((colIndex) => {
                      // Return the appropriate cell based on column index
                      switch (colIndex) {
                        case 0: // User ID
                          return (
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <div className="flex flex-col ">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {user.applicant_id}
                                </Typography>
                              </div>
                            </td>
                          );
                        case 1: // User Information
                          return (
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {user.firstname} {user.lastname}
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
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {user.type
                                    ? user.type === "restaurant"
                                      ? "CENTRAL"
                                      : user.type.toUpperCase()
                                    : ""}
                                </Typography>
                              </div>
                            </td>
                          );
                        case 3: // Status
                          return (
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <div className="w-max">
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={
                                    user.status == "approved"
                                      ? "Approved"
                                      : user.status == "pending"
                                      ? "Pending"
                                      : user.status == "rejected"
                                      ? "Rejected"
                                      : "Deleted"
                                  }
                                  color={
                                    user.status == "approved"
                                      ? "green"
                                      : user.status == "pending"
                                      ? "orange"
                                      : user.status == "rejected"
                                      ? "red"
                                      : "blue-gray"
                                  }
                                />
                              </div>
                            </td>
                          );
                        case 4: // Date Created
                          return (
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {new Date(user.date_created).toLocaleString(
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
                        case 5: // Action
                          return (
                            // <td className="p-4" key={`col-${colIndex}`}>
                            //   <Tooltip content="Edit User">
                            //     <IconButton
                            //       variant="text"
                            //       onClick={() => handleEditOpen(user.applicant_id, user.type)}
                            //     >
                            //       <PencilIcon className="h-4 w-4" />
                            //     </IconButton>
                            //   </Tooltip>
                            // </td>
                            <td
                              className="p-4"
                              key={`${user.applicant_id}-col-${colIndex}`}
                            >
                              <Tooltip content="Actions">
                                <Menu>
                                  <MenuHandler>
                                    <IconButton variant="text">
                                      <EllipsisHorizontalIcon className="h-10 w-10" />
                                    </IconButton>
                                  </MenuHandler>
                                  <MenuList>
                                    <MenuItem
                                      onClick={() =>
                                        handleEditOpen(user.applicant_id)
                                      }
                                    >
                                      View
                                    </MenuItem>
                                    {user.status == "pending" && (
                                      <>
                                        <MenuItem>Accept</MenuItem>
                                        <MenuItem className="text-red-500">
                                          Reject
                                        </MenuItem>
                                      </>
                                    )}
                                  </MenuList>
                                </Menu>
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

      <ViewApplicantionModal
        open={editOpen}
        handleOpen={handleEditOpen}
        userId={selectedUserId}
        userType={selectedUser}
        fetchUsers={fetchUsers}
      />
    </>
  );
};

export default ApplicationsPage;
