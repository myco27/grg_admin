import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Switch,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import useDebounce from "../../components/UseDebounce";
import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import {
  ArrowLeftRight,
  Handshake,
  HandshakeIcon,
  PencilIcon,
  Search,
} from "lucide-react";
import TextEditor from "../../components/Editor/TextEditor";
import Pagination from "../../components/OrdersPage/Pagination";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Loading from "../../components/layout/Loading";

function Configuration() {
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
  const [textArea, setTextAreaVal] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [isColumnReversed, setisColumnReversed] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmRow, setConfirmRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleConfirmModal = (row = null) => {
    setConfirmModal(!confirmModal);
    setConfirmRow(row);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(newSize),
    });
  };

  const handleConfirm = () => {
    if (confirmRow) {
      handleStatusToggle(confirmRow.id, confirmRow.status_id);
      console.log(confirmRow.status_id, confirmRow.id);
    }
    handleConfirmModal();
  };

  const handleEditModal = () => {
    setEditModal(!editModal);
  };
  const TABLE_HEAD = [
    "ID",
    "Content",
    "Status",
    "Date Created",
    "Date Updated",
    "Action",
  ];
  const handleSwitchChange = (e) => {
    setStatus(e.target.checked);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const reversedThead = isColumnReversed
    ? (() => {
        const reversedHead = [
          TABLE_HEAD[TABLE_HEAD.length - 1],
          ...TABLE_HEAD.slice(0, -1),
        ];
        return reversedHead;
      })()
    : TABLE_HEAD;

  const handleSaveContent = async (id) => {
    if (!id) {
      console.log("No ID passed to handleSaveContent");
      return;
    }
    const targetRow = tableData.find((item) => item.id === id);
    if (!targetRow) return;

    try {
      setSaving(true);
      setLoading(true);
      console.log("Saving content:", {
        id,
        content: textArea,
        status: targetRow.status_id,
      });

      await axiosClient.put(`admin/terms-and-conditions/${id}`, {
        content: textArea,
        status_id: targetRow.status_id,
      });

      await fetchTerms();
      handleEditModal();
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const handleEditRow = (id) => {
    const targetRow = tableData.find((item) => item.id === id);
    if (!targetRow) return;
    setTextAreaVal(targetRow.content);
    setSelectedRow(id);
    handleEditModal();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const targetRow = tableData.find((item) => item.id === id);
    if (!targetRow) return;

    const updatedStatus = currentStatus === 1 ? 2 : 1;

    const updatedTable = tableData.map((item) =>
      item.id === id ? { ...item, status_id: updatedStatus } : item
    );
    setTableData(updatedTable);

    try {
      setLoading(true);
      await axiosClient.put(`/admin/update/terms-and-conditions/status/${id}`, {
        status_id: updatedStatus,
      });
      fetchTerms();
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setPagination({ ...pagination, isLoading: true });
      const response = await axiosClient.get("/admin/terms-and-conditions", {
        params: {
          page: pagination.page,
          page_size: pagination.itemsPerPage,
          search: debounceSearch,
        },
      });

      if (response.status === 200) {
        const responseData = response.data.data.data;

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
        setTableData(responseData);
        setPagination(newPagination);
      }
    } catch (e) {
      console.error(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [debounceSearch, pagination.page, pagination.itemsPerPage]);

  const handleOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleSave = async () => {
    const data = {
      content: content,
      status_id: status ? 1 : 2,
    };
    try {
      setLoading(true);
      const response = await axiosClient.post(
        "admin/terms-and-conditions",
        data
      );
      console.log(response.data.data);
    } catch (e) {
      console.error(e.error);
    } finally {
      fetchTerms();
      handleOpen();
      setLoading(false);
    }
  };

  return (
    <Card className="h-full w-full rounded-none shadow-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex items-center justify-between gap-8">
          <div className="flex w-full flex-row justify-between">
            <div>
              <Typography variant="h4" color="blue-gray">
                Configuration
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Information about Terms and Conditions
              </Typography>
            </div>
            <div className="justify-end gap-2 rounded-md">
              <Button
                variant="filled"
                className="flex flex-row items-center gap-3"
                onClick={handleOpen}
              >
                <HandshakeIcon strokeWidth={2} className="w-5" />
                ADD T&C
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 md:flex-row">
          <div className="flex flex-row">
            <IconButton
              className="h-10 w-16"
              variant="text"
              onClick={() => setisColumnReversed(!isColumnReversed)}
            >
              <ArrowLeftRight></ArrowLeftRight>
            </IconButton>

            <Input
              label="Search Content"
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
      {loading ? (
        <Loading />
      ) : (
        <CardBody className="w-full overflow-x-auto">
          <table className="w-full min-w-max table-auto rounded-md">
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
              {tableData.map((data) => {
                const cells = [
                  <td key="id" className="p-4">
                    {data.id}
                  </td>,
                  <td key="content" className="p-4">
                    {data.content.length > 40
                      ? `${data.content.slice(0, 40)}...`
                      : data.content}
                  </td>,
                  <td key="status" className="p-4">
                    <Switch
                      color="green"
                      checked={data.status_id === 1}
                      onChange={() => handleConfirmModal(data)}
                    />
                  </td>,
                  <td key="created" className="p-4">
                    {new Date(data.created_at).toLocaleString()}
                  </td>,
                  <td key="updated" className="p-4">
                    {new Date(data.updated_at).toLocaleString()}
                  </td>,
                  <td key="action" className="p-4">
                    <IconButton
                      variant="text"
                      onClick={() => {
                        setSelectedRow(data.id);
                        handleEditRow(data.id);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </td>,
                ];
                const reorderedCells = isColumnReversed
                  ? [cells[5], ...cells.slice(0, 5)]
                  : cells;
                return (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-100"
                    key={data.id}
                  >
                    {reorderedCells}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      )}
      <CardFooter>
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

      {/*Modals*/}
      <Dialog open={modalOpen} handler={setModalOpen} size="xl">
        <DialogHeader>
          <Typography variant="h5">ADD TERMS AND CONDITIONS</Typography>
        </DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
          <TextEditor value={content} onChange={(val) => setContent(val)} />
          <Typography>Status?</Typography>
          <Switch checked={status} onChange={handleSwitchChange} />
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button className="bg-primary" onClick={handleSave}>
            Save
          </Button>
          <Button className="text-primary" variant="text" onClick={handleOpen}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={editModal} handler={setEditModal}  size="xl">
        <DialogHeader>Edit Content</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
          <TextEditor
            value={textArea}
            onChange={(val) => setTextAreaVal(val)}
          />
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button onClick={handleEditModal}>Cancel</Button>
          <Button
            className="bg-primary"
            onClick={() => handleSaveContent(selectedRow)}
            disabled={saving}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      <ConfirmationDialog
        open={confirmModal}
        onClose={handleConfirmModal}
        onConfirm={handleConfirm}
        isLoading={loading}
        title="Confirmation"
        message="Confirm change status?"
      />
    </Card>
  );
}

export default Configuration;
