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
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";

const AddUserModal = ({ open, handleOpen, fetchUsers }) => {
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
  const [error, setError] = useState("");

  // Reset fields on modal open/close
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
      setError("");
      fetchRoles();
    }
  }, [open]);

  // Fetch available roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get("/roles");
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Toggle password visibility
  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/admin/users/create", formData);

      // fetchUsers();
      handleOpen();
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add New User</DialogHeader>
      <DialogBody>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="First Name"
            name="first_name"
            type="text"
            required
            value={formData.first_name}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            name="last_name"
            type="text"
            required
            value={formData.last_name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={passwordVisibility.password ? "text" : "password"}
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("password")}
            >
              {passwordVisibility.password ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              label="Confirm Password"
              name="password_confirmation"
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("confirmPassword")}
            >
              {passwordVisibility.confirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Role Selection */}
          <Select
            label="Assign Role (Optional)"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
          >
            {roles.map((role) => (
              <Option key={role.id} value={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>

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

export default AddUserModal;
