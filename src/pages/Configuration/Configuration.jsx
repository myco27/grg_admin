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

function Configuration() {
  const [textArea, setTextAreaVal] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [isColumnReversed, setisColumnReversed] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };
  const TABLE_HEAD = [
    "ID",
    "CONTENT",
    "STATUS_ID",
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
      console.warn("No ID passed to handleSaveContent");
      return;
    }

    const targetRow = tableData.find((item) => item.id === id);
    if (!targetRow) return;

    try {
      console.log("Saving content:", {
        id,
        content: textArea,
        status: targetRow.status,
      });

      await axiosClient.put(`admin/terms-and-conditions/${id}`, {
        content: textArea,
        status: targetRow.status,
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

    const updatedStatus = currentStatus ? 0 : 1;
    const updatedTable = tableData.map((item) =>
      item.id === id ? { ...item, status: updatedStatus } : item
    );
    setTableData(updatedTable);

    try {
      await axiosClient.put(`/admin/terms-and-conditions/${id}`, {
        content: targetRow.content,
        status: updatedStatus,
      });
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      fetchTerms();
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axiosClient.get("/admin/terms-and-conditions");
      console.log(response.data);
      setTableData(response.data);
    } catch (e) {
      console.error(e.response?.data || e.message); // More accurate error handling
    }
  };

  const handleOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleSave = async () => {
    const data = {
      content: content,
      status: status ? 1 : 0,
    };
    try {
      const response = await axiosClient.post(
        "admin/terms-and-conditions",
        data
      );
      console.log(response.data);
    } catch (e) {
      console.error(e.error);
    } finally {
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
                    checked={!!data.status}
                    onChange={() => handleStatusToggle(data.id, data.status)}
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
      <Dialog open={modalOpen} handler={setModalOpen}>
        <DialogHeader>
          <Typography>ADD TERMS AND CONDITIONS</Typography>
        </DialogHeader>
        <DialogBody className="flex min-w-fit flex-col gap-2 overflow-auto">
          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
          <Typography>Status?</Typography>
          <Switch checked={status} onChange={handleSwitchChange} />
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button className="bg-primary" onClick={handleOpen}>
            Cancel
          </Button>
          <Button className="text-primary" variant="text" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={editModal} handler={setEditModal}>
        <DialogHeader>Edit Content</DialogHeader>
        <DialogBody>
          <Textarea
            label="Content Area"
            value={textArea}
            onChange={(e) => {
              setTextAreaVal(e.target.value);
            }}
          ></Textarea>
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
    </Card>
  );
}

export default Configuration;
