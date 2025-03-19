import React, { useEffect, useState } from "react";
import axios from "../../axiosClient";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { EyeIcon, EyeOff } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";

const AddAdminModal = ({ open, handleOpen, fetchUsers }) => {
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

  useEffect(() => {
    if (open) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      });
      setPasswordVisibility({ password: false, confirmPassword: false });
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/roles");
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/admin/users/add", formData);

      if (response.status === 201) {
        fetchUsers();
        handleOpen();
        showAlert("Admin created successfully!", "success");
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add New Admin</DialogHeader>
      <DialogBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Role Selection */}
          <Select
            required
            label="Assign Role"
            // value={formData.role}
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

          {/* Password Field */}
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
            <Button variant="gradient" color="gray" onClick={handleOpen}>
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              variant="gradient"
              color="purple"
              disabled={loading}
            >
              <span>{loading ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddAdminModal;
