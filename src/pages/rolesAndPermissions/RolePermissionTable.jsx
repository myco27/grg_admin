import { useState, useEffect, useContext } from "react";
import axios from "../../axiosClient";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  Switch,
  Typography,
} from "@material-tailwind/react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useAlert } from "../../contexts/alertContext";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  Search,
  Circle,
  Edit2Icon,
} from "lucide-react";
import RoleDialog from "./RoleDialog";
import PermissionDialog from "./PermissionDialog";
import Pagination from "../../components/OrdersPage/Pagination";
import Loading from "../../components/layout/Loading";
import UseDebounce from "../../components/UseDebounce";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";

const RolePermissionTable = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = UseDebounce({ value: searchTerm });
  const [permissionSearch, setPermissionSeach] = useState("");
  const [userId, setUserId] = useState(0);
  const [permissionId, setPermissionId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const debounceSearchPermission = UseDebounce({ value: permissionSearch });
  const [selectedPermName, setSelectedPermName] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  useEffect(() => {
    fetchRoles();
  }, [pagination.page, debounceSearch, pagination.itemsPerPage]);

  useEffect(() => {
    fetchPermissions();
  }, [debounceSearchPermission, setSelectedPermission]);

  const { user, fetchUser } = useStateContext();

  const canAddPermission =
    user?.all_permissions?.includes("can add permission") || false;
  const handleSwitch = (role, permission) => {
    setSelectedRole(role);
    setSelectedPermission(permission);
    const hasPermission = role.permissions.some((p) => p.name === permission);
    setIsAdding(!hasPermission);

    setOpen(true);
  };

  const handleStatusChange = (permissionId, status, selectedPerm) => {
    setPermissionId(permissionId);
    setSelectedStatus(status ? 0 : 1);
    setSelectedPermName(selectedPerm);

    setOpenConfirm(true)
  };

  const changeStatus = async () => {
    try {
      setIsLoading(true)
      const payload = { permision_id: permissionId, status: selectedStatus};
      const response = await axiosClient.put(`admin/change/${permissionId}`, payload);
      if (response.status ==200){
        setPermissions((prev) =>
          prev.map((perm) =>
            perm.id === permissionId ? { ...perm, status: perm.status === 1 ? 0 : 1 } : perm
          )
        );
      }
    } catch (error) {
      console.error("Failed to change status:", error);
    }
    finally{
      setIsLoading(false)
      setOpenConfirm(false)
    }
  };

  const handleOpenRoleDialog = () => {
    setRoleDialogOpen(true);
  };

  const handleOpenPermissionDialog = () => {
    setPermissionDialogOpen(true);
  };

  //   FOR PAGINATION
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

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const fetchRoles = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });
      const response = await axios.get("/roles/with-permissions", {
        params: {
          page: pagination.page,
          search: debounceSearch,
          pageSize: pagination.itemsPerPage,
        },
      });
      if (response.status === 200) {
        const { current_page, last_page, total, links, per_page } =
          response.data;

        const newPagination = {
          page: current_page,
          totalPages: last_page,
          totalItems: total,
          links: links,
          itemsPerPage: per_page,
          isLoading: false,
        };
        setRoles(response.data.data || []);
        setPagination(newPagination);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });
      const response = await axios.get("/permissions", {
        params: {
          filterPermission: permissionSearch,
        },
      });
      if (response.status === 200) {
        setPermissions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setPagination({ ...pagination, isLoading: false });
    }
  };

  const confirmTogglePermission = async () => {
    if (!selectedRole || !selectedPermission) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/roles/${selectedRole.id}/toggle-permission`,
        {
          permission: selectedPermission,
        }
      );

      if (response.status === 200) {
        showAlert(response.data.message, "success");
        await fetchUser();
        fetchRoles();
      }
    } catch (error) {
      if (error.response.data.errors) {
        showAlert(error.response.data.errors, "error");
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
      setSelectedRole(null);
      setSelectedPermission("");
    }
  };

  const permissionHead = ["NAME", "STATUS", "UPDATE_AT", "ACTION"];
  return (
    <div className="flex flex-col gap-5">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Roles & Permissions
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about Roles and Permissions
              </Typography>
            </div>

            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpenRoleDialog}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Role
              </Button>
              {canAddPermission && (
                <Button
                  className="flex items-center gap-3 rounded-md"
                  size="sm"
                  onClick={handleOpenPermissionDialog}
                >
                  <ShieldCheckIcon strokeWidth={2} className="h-4 w-4" /> Add
                  Permission
                </Button>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="flex w-full flex-col gap-x-4 sm:w-auto sm:flex-row">
              <Input
                label="Search Role"
                icon={
                  pagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                size="md"
                className="bg-white md:w-72"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e)}
              />
              <Input
                label="Search Permissions"
                icon={
                  pagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                value={permissionSearch}
                onChange={(e) => setPermissionSeach(e.target.value)}
                size="md"
                className="bg-white md:w-72"
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
                  <th className="rounded-bl-md rounded-tl-md bg-tableHeaderBg p-4">
                    Role
                  </th>
                  {permissions.map((perm, index) => (
                    <th
                      key={perm.id}
                      className={`bg-tableHeaderBg p-4 ${
                        index === permissions.length - 1
                          ? "rounded-tr-md rounded-br-md"
                          : ""
                      }`}
                    >
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-center gap-2 text-center font-normal leading-none opacity-70"
                      >
                        {perm.name.charAt(0).toUpperCase() + perm.name.slice(1)}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(roles) && roles.length > 0 ? (
                  roles
                    .filter(
                      (role) =>
                        user?.roles?.[0]?.name === "developer" ||
                        role.name !== "developer"
                    )
                    .map((role) => (
                      <tr
                        className="border-b border-gray-300 hover:bg-gray-100"
                        key={role.id}
                      >
                        <td className="p-4">
                          {role.name.charAt(0).toUpperCase() +
                            role.name.slice(1)}
                        </td>
                        {Array.isArray(permissions) &&
                        permissions.length > 0 ? (
                          permissions.map((perm) => (
                            <td key={perm.id} className="p-4">
                              <div className="flex items-center justify-center">
                                <Switch
                                  onChange={() => handleSwitch(role, perm.name)}
                                  checked={role.permissions?.some(
                                    (p) => p.name === perm.name
                                  )}
                                  disabled={
                                    perm.status === 0 ||
                                    (role.name === "developer" &&
                                      perm.name ===
                                        "view roles and permissions module")
                                  }
                                  color={
                                    perm.status === 0 ? "#632B9B" : "green"
                                  }
                                  className={
                                    perm.status === 0
                                      ? " disabled:bg-primary"
                                      : "green"
                                  }
                                />
                              </div>
                            </td>
                          ))
                        ) : (
                          <td colSpan={permissions.length + 1}>
                            No Permissions
                          </td>
                        )}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="2">No roles available</td>
                  </tr>
                )}
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

      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false}>
          <Typography variant="h3">Permissions</Typography>
        </CardHeader>
        <CardBody>
          <table className="w-full min-w-max table-auto rounded-md">
            <thead className="h-16 bg-gray-200 text-left">
              <tr>
                {permissionHead.map((permissions) => {
                  return <th>{permissions}</th>;
                })}
              </tr>
            </thead>
            <tbody className="">
              {permissions.map((perm) => {
                const readableDate = new Date(perm.updated_at).toLocaleString();
                return (
                  <tr className="m-24 h-16 border-b" key={perm.id}>
                    <td className="max-w-48 px-4 py-2 text-left">
                      {perm.name}
                    </td>
                    <td>
                      <Switch
                        color="green"
                        onChange={() =>
                          handleStatusChange(perm.id, perm.status, perm.name)
                        }
                        checked={perm.status===1}
                
                      />
                    </td>
                    <td className="max-w-48 px-4 py-2 text-left">
                      {readableDate}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Edit2Icon />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmTogglePermission}
        isLoading={isLoading}
        message={
          isAdding
            ? `Are you sure you want to grant the "${selectedPermission}" permission to the "${selectedRole?.name}" role?`
            : `Are you sure you want to revoke the "${selectedPermission}" permission from the "${selectedRole?.name}" role?`
        }
      />
       <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(!openConfirm)}
        onConfirm={changeStatus}
        isLoading={isLoading}
        message={
          selectedStatus?`Would You Like to Enable ${selectedPermName}?`:`Would you Like to Disable? ${selectedPermName}`
        }
      />
      <RoleDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        fetchRoles={fetchRoles}
        fetchPermissions={fetchPermissions}
      />

      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        fetchRoles={fetchRoles}
        fetchPermissions={fetchPermissions}
      />
    </div>
  );
};

export default RolePermissionTable;
