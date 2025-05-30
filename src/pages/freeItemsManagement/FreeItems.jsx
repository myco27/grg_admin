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
import Loading from "../../components/layout/Loading";
import axiosClient from "../../axiosClient";
import Pagination from "../../components/OrdersPage/Pagination";
import { PencilIcon, Search, Plus } from "lucide-react";
import AddGlobalItemsModal from "./AddGlobalItemsModal";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useAlert } from "../../contexts/alertContext";
import EditGlobalItemsModal from "./EditGlobalItemsModal";

const FreeItems = () => {
  const globalItemsHeader = [
    "Name",
    "Description",
    "Status",
    "Date Created",
    "Action",
  ];
  const [globalItemsTableLList, setGlobalItemsTableList] = useState([]);
  const [openGlobalItems, setGlobalItemsOpen] = useState(false);
  const [globalItemsId, setGlobalItemsId] = useState(null);
  const [globalItemsStatus, setGlobalItemsStatus] = useState(null);

  const [openGlobalItemEdit, setOpenGlobalItemEdit] = useState(false);

  const [openGlobalItemConfirmation, setOpenGlobalItemConfirmation] =
    useState(false);
  const [globalItemConfirmationLoading, setGlobalItemConfirmationLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const { showAlert } = useAlert();

  const [globalItemsPagination, setGlobalItemsPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  // API CALLS
  const fetchGlobalItemsTable = async () => {
    try {
      setGlobalItemsPagination((prev) => ({ ...prev, isLoading: true }));
      const response = await axiosClient.get("/admin/global-free-items", {
        params: {
          page: globalItemsPagination.page,
          page_size: globalItemsPagination.itemsPerPage,
        },
      });

      const { data, current_page, last_page, total, links, per_page } =
        response.data;

      setGlobalItemsTableList(data);
      setGlobalItemsPagination((prev) => ({
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
      setGlobalItemsPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const confirmToggleGlobalItemStatus = async () => {
    setGlobalItemConfirmationLoading(true);
    try {
      const response = await axiosClient.put(
        `/admin/global-free-items/status/${globalItemsId}/update`,
        {
          status_id: globalItemsStatus,
        }
      );

      showAlert("Status updated successfully!", "success");
      fetchGlobalItemsTable();
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpenGlobalItemConfirmation(false);
      setGlobalItemConfirmationLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchGlobalItemsTable();
  }, [globalItemsPagination.page, globalItemsPagination.itemsPerPage]);

  // GLOBAL ITEMS TABLE EVENT LISTENERS
  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setGlobalItemsPagination({
      ...globalItemsPagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleOpenGlobalItems = () => {
    setGlobalItemsOpen((prev) => !prev);
  };

  const handleGlobalItemsPageChange = (newPage) => {
    setGlobalItemsPagination({
      ...globalItemsPagination,
      page: newPage,
    });
  };

  const handleGlobalItemsPageSizeChange = (value) => {
    setGlobalItemsPagination({
      ...globalItemsPagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const handleStatusChange = (globalItemId, statusId) => {
    setGlobalItemsId(globalItemId);
    setGlobalItemsStatus(statusId);
    setOpenGlobalItemConfirmation(true);
  };

  const handleEditOpen = (globalItemId) => {
    setGlobalItemsId(globalItemId);
    setOpenGlobalItemEdit((openGlobalItemEdit) => !openGlobalItemEdit);
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Global Items list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Global Items
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpenGlobalItems}
              >
                <Plus strokeWidth={2} className="h-4 w-4" />
                Add Global Item
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <Input
                label="Search User"
                icon={
                  globalItemsPagination.isLoading ? (
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
          {globalItemsPagination.isLoading ? (
            <Loading />
          ) : (
            <table className="rounded-md w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {globalItemsHeader.map((globalItems, index) => {
                    return (
                      <th
                        key={index}
                        className={`bg-tableHeaderBg p-4
                          ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""}
                          ${
                            index === globalItemsHeader.length - 1
                              ? "rounded-tr-md rounded-br-md"
                              : ""
                          }`}
                      >
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center gap-2 font-normal leading-none opacity-70"
                        >
                          {globalItems}
                        </Typography>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="">
                {globalItemsTableLList.map((data) => {
                  const readableDate = new Date(
                    data.created_at
                  ).toLocaleString();
                  return (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={data.global_items_id}
                    >
                      <td className="p-4">
                        {" "}
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.name}
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
                        <Switch
                          color="green"
                          value={data.status_id}
                          onChange={() =>
                            handleStatusChange(
                              data.global_items_id,
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
                          {readableDate}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Tooltip content="Edit">
                          <PencilIcon
                            onClick={() => handleEditOpen(data.global_items_id)}
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
            currentPage={globalItemsPagination.page}
            totalItems={globalItemsPagination.totalItems}
            itemsPerPage={globalItemsPagination.itemsPerPage}
            totalPages={globalItemsPagination.totalPages}
            onPageChange={(newPage) => handleGlobalItemsPageChange(newPage)}
            onPageSizeChange={handleGlobalItemsPageSizeChange}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddGlobalItemsModal
        openGlobalItems={openGlobalItems}
        handleOpenGlobalItems={handleOpenGlobalItems}
        fetchGlobalItemsTable={fetchGlobalItemsTable}
      />

      <EditGlobalItemsModal
        editOpen={openGlobalItemEdit}
        editHandleOpen={handleEditOpen}
        globalItemId={globalItemsId}
        fetchGlobalItemsTable={fetchGlobalItemsTable}
      />

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={openGlobalItemConfirmation}
        onClose={() => setOpenGlobalItemConfirmation(false)}
        onConfirm={confirmToggleGlobalItemStatus}
        isLoading={globalItemConfirmationLoading}
        message={
          globalItemsStatus == 1
            ? `Are you sure you want to deactivate this item?`
            : `Are you sure you want to activate this item?`
        }
      />
    </>
  );
};

export default FreeItems;
