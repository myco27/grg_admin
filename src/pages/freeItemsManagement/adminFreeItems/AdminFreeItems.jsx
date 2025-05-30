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
import Loading from "../../../components/layout/Loading";
import axiosClient from "../../../axiosClient";
import Pagination from "../../../components/OrdersPage/Pagination";
import { PencilIcon, Plus, Search, Trash2, UserPlusIcon } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { useAlert } from "../../../contexts/alertContext";
import EditGlobalItemsModal from "../EditGlobalItemsModal";
import AddAdminFreeItemsModal from "./AddAdminFreeItems";
import UseDebounce from "../../../components/UseDebounce";
import EditAdminFreeItems from "./EditAdminFreeItems";

const AdminFreeItems = () => {
  const tableHeader = [
    "Title",
    "Promo Code",
    "Max Quantity Per Day",
    "Status",
    "Valid Until",
    "Date Created",
    "Date Created",
    "Action",
  ];
  const [tableData, setTableData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [freeItemsStatus, setFreeItemsStatus] = useState(null);
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

  // API CALLS
  const fetchFreeItemData = async () => {
    try {
      setTablePagination((prev) => ({ ...prev, isLoading: true }));
      const response = await axiosClient.get("/admin/admin-free-items", {
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

  const confirmToggleStatus = async () => {
    setConfirmationLoading(true);
    try {
      const response = await axiosClient.put(
        `/admin/admin-free-items/status/${selectedId}/update`,
        {
          status_id: freeItemsStatus,
        }
      );

      showAlert("Status updated successfully!", "success");
      fetchFreeItemData();
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpenConfirmation(false);
      setConfirmationLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchFreeItemData();
  }, [debounceSearch, tablePagination.page, tablePagination.itemsPerPage]);

  // GLOBAL ITEMS TABLE EVENT LISTENERS
  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleOpenAddModal = () => {
    setOpenAddModal((prev) => !prev);
  };

  const handleGlobalItemsPageChange = (newPage) => {
    setTablePagination({
      ...tablePagination,
      page: newPage,
    });
  };

  const handleGlobalItemsPageSizeChange = (value) => {
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const handleStatusChange = (globalItemId, statusId) => {
    setSelectedId(globalItemId);
    setFreeItemsStatus(statusId);
    setOpenConfirmation(true);
  };

  const handleEditOpen = (editId) => {
    setSelectedId(editId);
    setOpenEditModal((openEditModal) => !openEditModal);
  };
  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Admin Free Item list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Admin Free Item
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpenAddModal}
              >
                <Plus strokeWidth={2} className="h-4 w-4" /> Add Admin Free Item
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <Input
                label="Search User"
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
                  const date_created = new Date(
                    data.created_at
                  ).toLocaleString();

                  const date_updated = new Date(
                    data.updated_at
                  ).toLocaleString();

                  const valid_until = new Date(
                    data.valid_until
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={data.free_items_id}
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.title}
                        </Typography>{" "}
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.promo_code}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.max_qty_per_day}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Switch
                          color="green"
                          value={data.status_id}
                          onChange={() =>
                            handleStatusChange(
                              data.free_items_id,
                              data.status_id
                            )
                          }
                          checked={data.status_id === 1}
                        />
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {valid_until}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date_created}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date_updated}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Tooltip content="Edit">
                          <PencilIcon
                            onClick={() => handleEditOpen(data.free_items_id)}
                            className="h-5 w-5 cursor-pointer"
                          />
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
            currentPage={tablePagination.page}
            totalItems={tablePagination.totalItems}
            itemsPerPage={tablePagination.itemsPerPage}
            totalPages={tablePagination.totalPages}
            onPageChange={(newPage) => handleGlobalItemsPageChange(newPage)}
            onPageSizeChange={handleGlobalItemsPageSizeChange}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddAdminFreeItemsModal
        openAddModal={openAddModal}
        handleOpenAddModal={handleOpenAddModal}
        fetchFreeItemData={fetchFreeItemData}
      />

      <EditAdminFreeItems
        editOpen={openEditModal}
        editHandleOpen={handleEditOpen}
        selectedId={selectedId}
        fetchFreeItemData={fetchFreeItemData}
      />

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={confirmToggleStatus}
        isLoading={confirmationLoading}
        message={
          freeItemsStatus == 1
            ? `Are you sure you want to deactivate this item?`
            : `Are you sure you want to activate this item?`
        }
      />
    </>
  );
};

export default AdminFreeItems;
