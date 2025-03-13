import { useState, useEffect } from "react";
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
import { UserPlusIcon, ShieldCheckIcon, Search } from "lucide-react";
import RoleDialog from "./RoleDialog";
import PermissionDialog from "./PermissionDialog";
import Pagination from "../../components/OrdersPage/Pagination";
import Loading from "../../components/layout/Loading";
import UseDebounce from "../../components/UseDebounce";
import useAuthUser from "../../contexts/userContext";

const RolePermissionTable = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);

  const { showAlert } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = UseDebounce({ value: searchTerm });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 0,
    isLoading: false,
  });

  const { user } = useAuthUser();
  const canAddPermission =
    user?.all_permissions?.includes("can add permission") || false;
  const handleSwitch = (role, permission) => {
    setSelectedRole(role);
    setSelectedPermission(permission);

    const hasPermission = role.permissions.some((p) => p.name === permission);
    setIsAdding(!hasPermission);

    setOpen(true);
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
      isLoading: true,
    });
  };

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [pagination.page, debounceSearch]);

  const fetchRoles = async () => {
    try {
      setPagination({ ...pagination, isLoading: true });
      const response = await axios.get("/roles/with-permissions", {
        params: {
          page: pagination.page,
          search: debounceSearch,
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
      const response = await axios.get("/permissions");
      if (response.status === 200) {
        setPermissions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const confirmTogglePermission = async () => {
    if (!selectedRole || !selectedPermission) return;

    try {
      const response = await axios.post(
        `/roles/${selectedRole.id}/toggle-permission`,
        {
          permission: selectedPermission,
        }
      );

      if (response.status === 200) {
        console.log(response.data);

        showAlert(response.data.message, "success");
        fetchRoles();
      }
    } catch (error) {
      console.error("Error toggling permission:", error);
    } finally {
      setOpen(false);
      setSelectedRole(null);
      setSelectedPermission("");
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Roles & Permissions
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={handleOpenRoleDialog}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Role
              </Button>
              {canAddPermission && (
                <Button
                  className="flex items-center gap-3"
                  size="sm"
                  onClick={handleOpenPermissionDialog}
                >
                  <ShieldCheckIcon strokeWidth={2} className="h-4 w-4" /> Add
                  Permission
                </Button>
              )}
            </div>
          </div>
          <div className="float-end w-full md:w-72">
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
        </CardHeader>
        <CardBody className="p-4 overflow-scroll">
          {pagination.isLoading ? (
            <Loading />
          ) : (
            <table className="border w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Role
                  </th>
                  {permissions.map((perm) => (
                    <th
                      key={perm.id}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-center"
                    >
                      {perm.name.charAt(0).toUpperCase() + perm.name.slice(1)}
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
                      <tr key={role.id}>
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
                                  color="blue"
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
            isLoading={pagination.isLoading}
            links={pagination.links}
          />
        </CardFooter>
      </Card>

      {/* CONFIRMATION DIALOG BOX */}
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmTogglePermission}
        message={
          isAdding
            ? `Are you sure you want to grant the "${selectedPermission}" permission to the "${selectedRole?.name}" role?`
            : `Are you sure you want to revoke the "${selectedPermission}" permission from the "${selectedRole?.name}" role?`
        }
      />

      {/* FOR ADD ROLE AND PERMISSION */}
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
    </>
  );
};

export default RolePermissionTable;
