import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import { EyeIcon, EyeOff } from "lucide-react";

const EditAdminModal = ({ editOpen, editHandleOpen, adminId, fetchUsers }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get("/roles");
      if (response.status == 200) {
        setRoles(response.data.roles);
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
          password: "",
          password_confirmation: "",
          role: responseData.roles?.[0]?.name || "",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (editOpen) {
      fetchAdminDetails();
    }
  }, [editOpen, adminId]);

  const toggleVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  /** Handle Form Submission */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosClient.put(
        `/admin/users/${adminId}/update`,
        formData
      );
      if (response.status === 200) {
        showAlert(response.data.message, "success");
        fetchUsers();
        editHandleOpen();
        setLoading(false);
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
        setLoading(false);
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={editOpen} handler={editHandleOpen}>
      <DialogHeader>Edit Admin</DialogHeader>
      <DialogBody>
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="mt-[-10vh] h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Selection */}
            <Select
              id="role"
              required
              label="Assign Role"
              value={formData.role}
              onChange={handleRoleChange}
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Input
              label="First Name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleInputChange}
            />
            <Input
              label="Last Name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleInputChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={formData.email}
              onChange={handleInputChange}
            />

            {/* Password Fields */}
            {["password", "password_confirmation"].map((field, index) => (
              <div className="relative" key={index}>
                <Input
                  label={field === "password" ? "Password" : "Confirm Password"}
                  name={field}
                  type={passwordVisibility[field] ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => toggleVisibility(field)}
                  disabled={true}
                >
                  {passwordVisibility[field] ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button
                variant="gradient"
                color="gray"
                disabled={saving}
                onClick={editHandleOpen}
              >
                <span className="m-0 p-0">Cancel</span>
              </Button>
              <Button className="bg-primary" type="submit" disabled={saving}>
                <span className="m-0 p-0">{saving ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </form>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default EditAdminModal;
