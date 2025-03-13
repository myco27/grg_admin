import React, { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Card,
  Input,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  MenuHandler,
  MenuList,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
  IconButton,
  Switch,
} from "@material-tailwind/react";
import { UserSearch, UserPen, CircleX } from "lucide-react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const TABLE_HEAD = ["NAME", "ROLE", "STATUS", "ACTIONS"];
const USER_ROLES = ["USER", "ADMIN"];

const TABLE_ROWS = [
  { name: "Gilbert Sicat", role: "User", status: "ACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Gilbert Sicat", role: "User", status: "ACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
  { name: "Mark Soriano", role: "Admin", status: "INACTIVE" },
];

export default function RoleManagementPage() {
  const [data, setData] = useState(TABLE_ROWS);
  const [searchUser, setSearchUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleRoleChange = (index, newRole) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedData = data.map((user, i) =>
      i === realIndex ? { ...user, role: newRole } : user
    );
    setData(updatedData);
    setCurrentPage(1);
  };

  const deleteUser = () => {
    if (deleteIndex === null) return;
    const updatedData = data.filter((_, i) => i !== deleteIndex);
    setData(updatedData);
    setDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleBulkDelete = () => {
    const updatedData = data.filter(
      (_, i) => !selectedRows.includes((currentPage - 1) * itemsPerPage + i)
    );
    setData(updatedData);
    setSelectedRows([]);
  };

  const handleCheckbox = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleStatusChange = (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedData = data.map((user, i) =>
      i === realIndex
        ? {
            ...user,
            status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          }
        : user
    );
    setData(updatedData);
    setCurrentPage(1);
  };

  const openModal = () => setOpen(!open);
  

  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const currentData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage]);

  return (
    <main className="item-center flex flex-col">
      <div className="flex justify-between p-5">
        <div>
          <Typography variant="h4" color="black">
            Role Management
          </Typography>
        </div>
        <div className="flex gap-5">
          <Button
            onClick={handleBulkDelete}
            disabled={selectedRows.length === 0}
            color="red"
            className="min-w-[100px]"
          >
            Delete
          </Button>
          <Button
            onClick={openModal}
            variant="outlined"
            color="purple"
            size="sm"
            className="min-h-[40px] min-w-[100px]"
          >
            Filter
          </Button>
          <Dialog open={open} handler={openModal}>
            <DialogHeader>Filter</DialogHeader>
            <DialogBody>
              <Input color="purple" label="Search Name" />
            </DialogBody>
            <DialogFooter>
              <Button color="red" onClick={openModal}>
                Close
              </Button>
            </DialogFooter>
          </Dialog>
          <Input
            color="purple"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            label="Search user"
            icon={<UserSearch />}
          />
        </div>
      </div>
      <div className="flex flex-initial items-center p-5">
        <IconButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="text"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </IconButton>
        <Typography color="black">
          <strong>
            Page {currentPage} of {totalPages}
          </strong>
        </Typography>
        <IconButton
          variant="text"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </IconButton>
      </div>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto rounded-sm text-left">
          <thead>
            <tr>
              <th className="border-b p-4">
                <Checkbox
                  color="purple"
                  checked={
                    selectedRows.length === currentData.length &&
                    currentData.length !== 0
                  }
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked
                        ? currentData.map(
                            (_, i) => (currentPage - 1) * itemsPerPage + i
                          )
                        : []
                    )
                  }
                />
              </th>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b p-4">
                  <Typography>
                    <strong>{head}</strong>
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              currentData.length === 0 ? (<tr>
                <td colSpan="5" className="py-10 text-center">
                  <Typography variant="h4" className="text-gray-500">
                    No Results Found
                  </Typography>
                </td>
              </tr>
              ):
            (
            currentData.map(({ name, role, status }, index) => (
              <tr key={index}>
                <td className="p-4">
                  <Checkbox
                    color="purple"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleCheckbox(index)}
                  />
                </td>
                <td className="p-4">{name}</td>
                <td className="p-4">
                  <Menu>
                    <MenuHandler>
                      <Button
                        variant="outlined"
                        color="purple"
                        className="min-w-[100px]"
                      >
                        {role}
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      {USER_ROLES.map((roles) => (
                        <MenuItem
                          onClick={() => handleRoleChange(index, roles)}
                        >
                          {roles}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </td>
                <td className="p-4">
                  <Switch
                    checked={status === "ACTIVE"}
                    color={status === "ACTIVE" ? "green" : "red"}
                    onChange={() => handleStatusChange(index)}
                    className={`${
                      status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <Typography
                    className="min-w-[100px]"
                    color={status === "ACTIVE" ? "green" : "red"}
                  >
                    {status}
                  </Typography>
                </td>

                <td>
                  <div className="flex gap-5">
                    <Dialog
                      open={openDeleteModal}
                      handler={() => setDeleteModal(false)}
                    >
                      <DialogHeader>
                        Are you sure you want to Delete Row?
                      </DialogHeader>
                      <DialogFooter className="flex gap-5">
                        <Button
                          variant="outlined"
                          color="green"
                          onClick={() => {
                            deleteUser();
                            setDeleteModal(false);
                          }}
                        >
                          Yes
                        </Button>

                        <Button
                          color="red"
                          onClick={() => setDeleteModal(false)}
                        >
                          No
                        </Button>
                      </DialogFooter>
                    </Dialog>

                    <Button
                      variant="text"
                      color="red"
                      onClick={() => {
                        setDeleteIndex(index);
                        setDeleteModal(true);
                      }}
                    >
                      <CircleX />
                    </Button>

                    <Button variant="text">
                      <UserPen></UserPen>
                    </Button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
