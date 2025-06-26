import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
  Switch,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Loading from "../../components/layout/Loading";
import axiosClient from "../../axiosClient";
import Pagination from "../../components/OrdersPage/Pagination";
import { PencilIcon, Search, Plus, Check } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import AddInvoiceDialogBox from "./AddInvoiceDialogBox";
import EditInvoiceDialogBox from "./EditInvoiceDialogBox";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useStateContext } from "../../contexts/contextProvider";
import ConfirmationDialogBox from "../../components/ConfirmationDialog";

const Invoices = () => {
  // ####################### Permissions #######################
  const { user } = useStateContext();
  const userRole = user?.roles[0]?.name;
  const accountantConfirm = user?.all_permissions?.some(
    (p) => p.name === "accountant confirm" && p.status_id === 1
  );

  const managerConfirm = user?.all_permissions?.some(
    (p) => p.name === "manager confirm" && p.status_id === 1
  );
  //  ############################################################

  const headerData = [
    "Company",
    "Category",
    "SST Number",
    "Petty Type",
    "Invoice Date",
    "Price",
    "Total (Incl. SST)",
    "Payment Status",
    "Ready for Payment",
    "Created At",
    "Action",
  ];

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const { showAlert } = useAlert();
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  // API CALLS
  const fetchData = async () => {
    try {
      setPagination((prev) => ({ ...prev, isLoading: true }));

      const response = await axiosClient.get("/admin/get/invoices", {
        params: {
          page: pagination.page,
          page_size: pagination.itemsPerPage,
        },
      });

      const { data, current_page, last_page, total, links, per_page } =
        response.data;

      setData(data);
      setPagination((prev) => ({
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
      setPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.itemsPerPage]);

  // EVENT LISTENERS
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

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handlePageSizeChange = (value) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const handleEditOpen = (id) => {
    setSelectedId(id);
    setOpenEdit((openEdit) => !openEdit);
  };

  const confirmToggleStatus = async () => {
    setConfirmationLoading(true);
    try {
      const response = await axiosClient.put(`/admin/status/${userId}/update`, {
        status_id: status,
      });

      if (response.status === 200) {
        showAlert(response.data.message, "success");
        fetchData();
      }
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpenConfirmation(false);
      setConfirmationLoading(false);
      setOpen(false);
    }
  };

  const handleAction = (type, id) => {
    switch (type) {
      case "edit":
        setSelectedId(id);
        setOpenEdit(true);
        break;
      case "accountantConfirm":
        break;
      case "managerConfirm":
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Invoices list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Invoices
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpen}
              >
                <Plus strokeWidth={2} className="h-4 w-4" />
                Add Invoice
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
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
        <CardBody className="overflow-scroll">
          {pagination.isLoading ? (
            <Loading />
          ) : (
            <table className="rounded-md w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {headerData.map((globalItems, index) => {
                    return (
                      <th
                        key={index}
                        className={`bg-tableHeaderBg p-4
                          ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""}
                          ${
                            index === headerData.length - 1
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
                {data.map((data) => {
                  const readableDate = new Date(
                    data.created_at
                  ).toLocaleString();

                  const invoiceDate = new Date(
                    data.invoice_date
                  ).toLocaleString();
                  return (
                    <tr
                      className="border-b border-gray-300 hover:bg-gray-100"
                      key={data.invoice_id}
                    >
                      <td className="p-4">
                        {" "}
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.company.name}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.invoice_category.name}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.sst_number}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.petty_type}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {invoiceDate}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.price}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.total_price_inclusive}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.payment_status}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal text-white rounded px-4 px-3 w-fit ${
                            data.ready_for_payment == 0
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {data.ready_for_payment == 0 ? "No" : "Yes"}
                        </Typography>
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
                        <Menu>
                          <MenuHandler>
                            <IconButton variant="text">
                              <EllipsisHorizontalIcon className="h-10 w-10" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                handleAction("edit", data.invoice_id)
                              }
                              className="flex items-center gap-2"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <Typography
                                color="blue-gray"
                                className="text-sm font-medium"
                              >
                                Edit
                              </Typography>
                            </MenuItem>

                            {accountantConfirm && (
                              <MenuItem
                                onClick={() =>
                                  handleAction(
                                    "accountantConfirm",
                                    data.invoice_id,
                                    data.ready_for_payment
                                  )
                                }
                                className="flex items-center gap-2"
                              >
                                <Check className="h-4 w-4" />
                                <Typography
                                  color="blue-gray"
                                  className="text-sm font-medium"
                                >
                                  {userRole === "developer" ? (
                                    <span>Accountant Confirm</span>
                                  ) : (
                                    <span>Confirm</span>
                                  )}
                                </Typography>
                              </MenuItem>
                            )}

                            {managerConfirm && (
                              <MenuItem
                                onClick={() =>
                                  handleAction(
                                    "managerConfirm",
                                    data.invoice_id,
                                    data.ready_for_payment
                                  )
                                }
                                className="flex items-center gap-2"
                              >
                                <Check className="h-4 w-4" />
                                <Typography
                                  color="blue-gray"
                                  className="text-sm font-medium"
                                >
                                  {userRole === "developer" ? (
                                    <span>Manager Confirm</span>
                                  ) : (
                                    <span>Confirm</span>
                                  )}
                                </Typography>
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
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
            onPageSizeChange={handlePageSizeChange}
          />
        </CardFooter>
      </Card>

      {/* MODALS */}
      <AddInvoiceDialogBox
        open={open}
        handleOpen={handleOpen}
        fetchData={fetchData}
      />

      <EditInvoiceDialogBox
        editOpen={openEdit}
        editHandleOpen={handleEditOpen}
        fetchData={fetchData}
        selectedId={selectedId}
      />

      <ConfirmationDialogBox
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={confirmToggleStatus}
        isLoading={confirmationLoading}
        message={
          selectedStatus == 1
            ? `Are you sure you want to deactivate this user admin?`
            : `Are you sure you want to activate this user admin?`
        }
      />
    </>
  );
};

export default Invoices;
