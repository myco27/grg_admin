import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { CircleUserRound, UserIcon } from "lucide-react";

const ViewAdminModal = ({ viewOpen, viewHandleOpen, adminId, fetchUsers }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    permissions: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get("/roles");
      if (response.status == 200) {
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/users/${adminId}/roles`);

      if (response.status === 200) {
        const responseData = response.data.user;
        setFormData({
          first_name: responseData.first_name,
          last_name: responseData.last_name,
          email: responseData.email,
          role: responseData.roles?.[0]?.name || "",
          permissions: responseData.all_permissions,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (viewOpen) {
      fetchAdminDetails();
    }
  }, [viewOpen, adminId]);

  return (
    <Dialog
      aria-modal="true"
      open={viewOpen}
      handler={viewHandleOpen}
      className="min-h-fit w-32 overflow-auto"
    >
      <DialogHeader>User Details</DialogHeader>
      <DialogBody className="items-center justify-center">
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="mt-[-10vh] h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col gap-5">
            <div className="flex flex-row gap-x-20">
              <div>
                <Typography variant="h5">First Name</Typography>
                <Typography>{formData.first_name}</Typography>
              </div>
              <div>
                <Typography variant="h5">Last Name</Typography>
                <Typography>{formData.last_name}</Typography>
              </div>
            </div>
            <div>
              <Typography variant="h5">Email</Typography>
              <Typography>{formData.email}</Typography>
            </div>
            <div className="flex flex-wrap">
              <Typography variant="h5">Roles:</Typography>
              <Chip
                className="m-1 max-w-fit bg-purple-50 text-purple-900"
                color="purple"
                value={formData.role}
              ></Chip>
            </div>
            <div className="flex flex-wrap overflow-auto">
              <Typography variant="h5">Permissions: </Typography>
              {Object.entries(formData.permissions).map(([index, value]) => (
                <div key={index}>
                  <Chip
                    color="purple"
                    className="m-1 max-w-fit bg-purple-50 text-purple-900"
                    value={value}
                  ></Chip>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" color="gray" onClick={viewHandleOpen}>
          <span>Cancel</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewAdminModal;
