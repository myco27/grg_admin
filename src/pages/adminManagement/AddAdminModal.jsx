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
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeClosed } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import Loading from "../../components/layout/Loading";

const AddAdminModal = ({ open, handleOpen, fetchUsers }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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
      setSelectedFile(null);
      setSelectedImage(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.password_confirmation);
      formDataToSend.append('role', formData.role);
      if (selectedFile) {
        formDataToSend.append('profile_picture', selectedFile);
      }

      const response = await axios.post("/admin/users/add", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      setSubmitting(false);
    }
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add New Admin</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        {loading ? (
          <Loading />
        ) : submitting ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5 px-4">
                <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = '/rocky_go_logo.png';
                        e.target.onerror = null;
                      }}
                    />
                  )}
                </div>
                <div>
                  <Typography variant="small" className="text-xs font-semibold text-blue-gray-700">Profile Picture</Typography>
                  <Typography
                    variant="small"
                    className="text-[10px] text-gray-500"
                  >
                    JPG or PNG. Max size of 2048kb
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                    name="profile_picture"
                  />
                  <button 
                    className="text-[10px] text-white py-1 px-2 bg-primary rounded" 
                    onClick={() => document.getElementById('image-input').click()}
                    type="button"
                  >
                    Choose File
                  </button>
                </div>
              </div>
              
            </div>
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

            {/* <Input
              label="Profile Picture"
              name="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            /> */}
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
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </>
        )}
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-end gap-2">
          <Button
            variant="gradient"
            color="gray"
            onClick={handleOpen}
            disabled={submitting}
          >
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            className="bg-primary"
            disabled={submitting}
            onClick={handleSubmit}
          >
            <span>{submitting ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default AddAdminModal;
