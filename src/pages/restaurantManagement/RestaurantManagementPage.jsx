import { PencilIcon } from "@heroicons/react/24/solid";
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
import { ArrowLeftRight } from "lucide-react";
import EditRestaurantModal from "./EditRestaurantModal";
import axios from "axios";

const RestaurantManagementPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStore,setSelectedStore] = useState(null)
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
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

  const fetchStores = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });

      const response = await axiosClient.get("/admin/store/list", {
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
        setStores(responseData.data);
        setPagination(newPagination);
      }
    } catch (error) {
      // navigate("/notfound");
    }

    
  };

  useEffect(() => {
    fetchStores();
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

  const handleEditOpen = (storeId, applicantId) => {
    console.log(selectedStore)
    setSelectedStoreId(storeId);
    setSelectedApplicantId(applicantId);
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
    "Store ID",
    "Store Information",
    "Contact Information",
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
                Store list
              </Typography>
              <Typography className="font-normal">
                See information about all Stores
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 md:flex-row">
            <div className="flex w-full justify-end gap-2 rounded-md md:w-72">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={rotateColumns}
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>
              <Input
                label="Search Store"
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
                  {tableHeadOrder.map((colIndex, index) => {
                    const columnLabel = TABLE_HEAD[colIndex];

                    return (
                      <th
                        key={`${colIndex}-${index}`}
                        className={`bg-tableHeaderBg p-4 ${
                          index === 0 ? "rounded-tl-md rounded-bl-md" : ""
                        } ${
                          index === TABLE_HEAD.length - 1
                            ? "rounded-tr-md rounded-br-md"
                            : ""
                        }`}
                      >
                        {columnLabel && (
                          <Typography
                            variant="small"
                            color="black"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                          >
                            {columnLabel}
                          </Typography>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {stores.map((store) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-100"
                    key={store.id}
                  >
                    {tableHeadOrder.map((colIndex) => {
                      // Return the appropriate cell based on column index
                      switch (colIndex) {
                        case 0: // Store ID
                          return (
                            <td className="p-4" key={`col-${colIndex}`}>
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {store.store.id}
                                </Typography>
                              </div>
                            </td>
                          );
                        case 1: // Store Information
                          return (
                            <td className="p-4" key={`col-${colIndex}`}>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {store.store.store_name} {store.store.store_branch}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                          );
                        case 2: // Contact Information
                          return (
                            <td className="p-4" key={`col-${colIndex}`}>
                              <div className="space-y-2">
                              <div className="flex gap-2">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    Email:
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-normal"
                                  >
                                    {store.email}
                                  </Typography>
                                </div>
                                <div className="flex gap-2">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    Phone:
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-normal"
                                  >
                                    {store.store.phone}
                                  </Typography>
                                </div>

                                <div className="flex gap-2">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    Mobile:
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-normal"
                                  >
                                    {store.store.mobile}
                                  </Typography>
                                </div>
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
                                    store.store.is_active == 1
                                      ? "Active"
                                      : store.store.is_active == 2
                                      ? "Suspended"
                                      : store.store.is_active == 3
                                      ? "Deleted"
                                      : "Inactive"
                                  }
                                  color={
                                    store.store.is_active == 1
                                      ? "green"
                                      : store.store.is_active == 2
                                      ? "orange"
                                      : store.store.is_active == 3
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
                                  {new Date(store.store.date_created).toLocaleString(
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
                            <td className="p-4" key={`col-${colIndex}`}>
                              <Tooltip content="Edit Store">
                                <IconButton
                                  variant="text"
                                  onClick={() => {handleEditOpen(store.store.id, store.applicant_id); setSelectedStore(store);}}
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

      {/* MODALS */}
      <EditRestaurantModal
        open={editOpen}
        handleOpen={handleEditOpen}
        storeId={selectedStoreId}
        applicantId={selectedApplicantId}
        fetchStores={fetchStores}
        selectedStore={selectedStore}
      />
    </>
  );
};

export default RestaurantManagementPage;
