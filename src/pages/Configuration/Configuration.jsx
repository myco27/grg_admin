import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Switch,
  Textarea,
  Typography,
} from "@material-tailwind/react";

import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { ArrowLeftRight, PencilIcon } from "lucide-react";
import TextEditor from "../../components/Editor/TextEditor";

function Configuration() {
  const [textArea, setTextAreaVal] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [isColumnReversed, setisColumnReversed] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmRow, setConfirmRow] = useState(null);

  const handleConfirmModal = (row = null) => {
    setConfirmModal(!confirmModal);
    setConfirmRow(row);
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
    "CONTENT",
    "STATUS",
    "CREATED_AT",
    "UPDATED_AT",
    "ACTION",
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

  useEffect(() => {
    fetchTerms();
  }, [setTableData, status]);

  const handleSaveContent = async (id) => {
    if (!id) {
      console.log("No ID passed to handleSaveContent");
      return;
    }
    const targetRow = tableData.find((item) => item.id === id);
    if (!targetRow) return;

    try {
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
      await axiosClient.put(`/admin/update/terms-and-conditions/status/${id}`, {
        status_id: updatedStatus,
      });
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axiosClient.get("/admin/terms-and-conditions");
      console.log(response.data);
      setTableData(response.data.data);
    } catch (e) {
      console.error(e.response?.data || e.message);
    }
  };

  const handleOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleSave = async () => {
    const data = {
      content: content,
      status_id: status ? 1 : 2,
    };
    try {
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
    }
  };

  return (
    <Card className="h-full w-full rounded-none shadow-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-row justify-between">
          <div>
            <Typography variant="h4" color="blue-gray">
              Configuration
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all Cofigurations
            </Typography>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <IconButton
              variant="text"
              onClick={() => setisColumnReversed(!isColumnReversed)}
            >
              <ArrowLeftRight></ArrowLeftRight>
            </IconButton>
            <Button
              variant="filled"
              className="bg-primary"
              onClick={handleOpen}
            >
              ADD T&C
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
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
                  {data.content}
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
              return <tr key={data.id}>{reorderedCells}</tr>;
            })}
          </tbody>
        </table>
      </CardBody>

      {/*Modals*/}
      <Dialog open={modalOpen} handler={setModalOpen}>
        <DialogHeader>
          <Typography variant="h5">ADD TERMS AND CONDITIONS</Typography>
        </DialogHeader>
        <DialogBody className="flex min-w-fit flex-col gap-2 overflow-auto">
          <TextEditor onChange={(val) => setContent(val)} />
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

      <Dialog open={editModal} handler={setEditModal}>
        <DialogHeader>Edit Content</DialogHeader>
        <DialogBody>
          <TextEditor onChange={(val) => setTextAreaVal(val)} />
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            className="bg-primary"
            onClick={() => handleSaveContent(selectedRow)}
          >
            Save
          </Button>
          <Button
            className="text-primary"
            variant="text"
            onClick={handleEditModal}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={confirmModal} handler={handleConfirmModal}>
        <DialogHeader>
          <Typography variant="h3">Change Status?</Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6">Confirm change status?</Typography>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button className="bg-primary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button
            className="text-primary"
            variant="text"
            onClick={handleConfirmModal}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}

export default Configuration;
