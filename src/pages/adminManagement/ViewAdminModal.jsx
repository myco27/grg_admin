import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { CircleUserRound } from "lucide-react";

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
        console.log("success");
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
        console.log(responseData);
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
    <Dialog open={viewOpen} handler={viewHandleOpen} className="overflow-auto">
      <DialogHeader>User Details</DialogHeader>
      <DialogBody className="items-center justify-center">
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="mt-[-10vh] h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
          </div>
        ) : (
          <div className="flex max-w-full flex-col items-center justify-center gap-5 px-5">
            <div>
              <CircleUserRound className="h-32 w-32"></CircleUserRound>
            </div>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col">
                <Typography variant="h5">First Name</Typography>
                <Typography>{formData.first_name}</Typography>
              </div>
              <div className="flex flex-col">
                <Typography variant="h5">Last Name</Typography>
                <Typography>{formData.last_name}</Typography>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <Typography variant="h5">Email</Typography>
                <Typography>{formData.email}</Typography>
              </div>
              <div>
                <Typography variant="h5">Roles</Typography>
                <Typography>{formData.role}</Typography>
              </div>
              <div>
                <div className="overflow-scroll">
                  {Object.entries(formData.permissions).map(([key, value]) => (
                    <div key={key}>
                      <Typography>{value}</Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="gradient" color="gray" onClick={viewHandleOpen}>
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default ViewAdminModal;
