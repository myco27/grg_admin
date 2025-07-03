import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  Switch,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { EyeIcon, PencilIcon, Plus, Search } from "lucide-react";
import UseDebounce from "../../../components/UseDebounce";
import Loading from "../../../components/layout/Loading";
import axiosClient from "../../../axiosClient";
import Pagination from "../../../components/OrdersPage/Pagination";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { useAlert } from "../../../contexts/alertContext";
import AddPromoItems from "./AddPromoItems";
import EditPromoItems from "./EditPromoItems";
import { useNavigate } from "react-router-dom";

const PromoItems = () => {
  const navigate = useNavigate();

  const tableHeader = [
    "Promo Code",
    "Start Date",
    "Until Date",
    "Is Busy",
    "Status",
    "Promo Used",
    "Max Quantity Per Day",
    "Users Max Quantity Per Day",
    "Limit Usage",
    "Description",
    "Busy Description",
    "Action",
  ];
  const [tableData, setTableData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [freeItemsStatus, setFreeItemsStatus] = useState(null);
  const [freeItemIsBusy, setFreeItemIsBusy] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = UseDebounce({ value: searchTerm });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const { showAlert } = useAlert();
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  useEffect(() => {
    fetchFreeItemData();
  }, [debounceSearch, tablePagination.page, tablePagination.itemsPerPage]);

  // API CALLS
  const fetchFreeItemData = async () => {
    try {
      setTablePagination((prev) => ({ ...prev, isLoading: true }));
      const response = await axiosClient.get("/admin/promo-free-items", {
        params: {
          search: debounceSearch,
          page: tablePagination.page,
          page_size: tablePagination.itemsPerPage,
        },
      });

      const { data, current_page, last_page, total, links, per_page } =
        response.data;

      setTableData(data);
      setTablePagination((prev) => ({
        ...prev,
        page: current_page,
        totalPages: last_page,
        totalItems: total,
        links: links,
        itemsPerPage: per_page,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTablePagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const confirmToggle = async () => {
    setConfirmationLoading(true);
    try {
      const response = await axiosClient.put(
        `/admin/promo-free-items/status/${selectedId}/update`,
        {
          is_busy: freeItemIsBusy,
          status: freeItemsStatus,
        }
      );

      showAlert("Status updated successfully!", "success");
      fetchFreeItemData();
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpenConfirmation(false);
      setConfirmationLoading(false);
    }
  };

  // GLOBAL ITEMS TABLE EVENT LISTENERS

  const handleOpenAddModal = () => {
    setOpenAddModal((prev) => !prev);
  };

  const handleEditOpen = (editId) => {
    setSelectedId(editId);
    setOpenEditModal((openEditModal) => !openEditModal);
  };

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleItemsPageChange = (newPage) => {
    setTablePagination({
      ...tablePagination,
      page: newPage,
    });
  };

  const handleItemsPageSizeChange = (value) => {
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const handleStatusChange = (promoId, statusId) => {
    setSelectedId(promoId);
    setFreeItemsStatus(statusId);
    setOpenConfirmation(true);
  };

  const handleIsBusyChange = (promoId, isBusy) => {
    setSelectedId(promoId);
    setFreeItemIsBusy(isBusy);
    setOpenConfirmation(true);
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Promo Free Item list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Promo Free Item
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpenAddModal}
              >
                <Plus strokeWidth={2} className="h-4 w-4" /> Add Promo Free Item
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <Input
                label="Search Item"
                icon={
                  tablePagination.isLoading ? (
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
        <CardBody className="overflow-scroll">
          {tablePagination.isLoading ? (
            <Loading />
          ) : (
            <table className="rounded-md w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {tableHeader.map((tableData, index) => {
                    return (
                      <th
                        key={index}
                        className={`bg-tableHeaderBg p-4
                          ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""}
                          ${
                            index === tableHeader.length - 1
                              ? "rounded-tr-md rounded-br-md"
                              : ""
                          }`}
                      >
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {tableData}
                        </Typography>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="">
                {tableData.map((data) => {
                  //   const start_date = data.start_date
                  //     ? new Date(data.start_date).toLocaleDateString(undefined, {
                  //         year: "numeric",
                  //         month: "long",
                  //         day: "numeric",
                  //       })
                  //     : "";

                  //   const date_created = new Date(
                  //     data.created_at
                  //   ).toLocaleString();

                  return (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={data.free_item_v2_id}
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.promo_code}
                        </Typography>{" "}
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.start_date}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.until_date}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Switch
                          color="green"
                          value={data.is_busy}
                          onChange={() =>
                            handleIsBusyChange(
                              data.free_item_v2_id,
                              data.is_busy
                            )
                          }
                          checked={data.is_busy === 1}
                        />
                      </td>

                      <td className="p-4">
                        <Switch
                          color="green"
                          value={data.is_active}
                          onChange={() =>
                            handleStatusChange(
                              data.free_item_v2_id,
                              data.is_active
                            )
                          }
                          checked={data.is_active === 1}
                        />
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.customer_count}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.max_qty_day}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.users_max_qty_day}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.limit_usage}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.description}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.busy_description}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <Tooltip content="Edit">
                            <PencilIcon
                              onClick={() =>
                                handleEditOpen(data.free_item_v2_id)
                              }
                              className="h-5 w-5 cursor-pointer"
                            />
                          </Tooltip>

                          <Tooltip content="View Details">
                            <EyeIcon
                              onClick={() =>
                                navigate(
                                  `/promotions/free-items/${data.free_item_v2_id}`
                                )
                              }
                              className="h-5 w-5 cursor-pointer"
                            />
                          </Tooltip>
                        </div>
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
            currentPage={tablePagination.page}
            totalItems={tablePagination.totalItems}
            itemsPerPage={tablePagination.itemsPerPage}
            totalPages={tablePagination.totalPages}
            onPageChange={(newPage) => handleItemsPageChange(newPage)}
            onPageSizeChange={handleItemsPageSizeChange}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddPromoItems
        openAddModal={openAddModal}
        handleOpenAddModal={handleOpenAddModal}
        fetchFreeItemData={fetchFreeItemData}
      />

      <EditPromoItems
        editOpen={openEditModal}
        editHandleOpen={handleEditOpen}
        selectedId={selectedId}
        fetchFreeItemData={fetchFreeItemData}
      />

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={confirmToggle}
        isLoading={confirmationLoading}
        message={`Are you sure?`}
      />
    </>
  );
};

export default PromoItems;
