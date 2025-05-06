import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeClosed } from "lucide-react";
import Loading from "../../components/layout/Loading";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
          profile_picture: responseData.profile_picture || "",
        });
        if (responseData.profile_picture) {
          setSelectedImage(`${import.meta.env.VITE_APP_IMAGE_PATH}/profileImage/${responseData.profile_picture}`);
        } else {
          setSelectedImage('/rocky_go_logo.png');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (editOpen) {
      // Reset all states when modal opens
      setSelectedFile(null);
      setSelectedImage(null);
      fetchAdminDetails();
    } else {
      // Cleanup when modal closes
      setSelectedFile(null);
      setSelectedImage(null);
    }
  }, [editOpen, adminId]);

  const toggleVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set maximum dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        const compressedFile = canvas.toDataURL('image/jpeg', 0.7);
        
        // Convert base64 to blob
        fetch(compressedFile)
          .then(res => res.blob())
          .then(blob => {
            const compressedImageFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            setSelectedFile(compressedImageFile);
          });
      };
      
      img.src = previewUrl;
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

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      // Add required fields - ensure we're sending the actual values
   
        formDataToSend.append('first_name', formData.first_name.trim());
        formDataToSend.append('last_name', formData.last_name.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('role', formData.role);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('password_confirmation', formData.password_confirmation);

      // Add profile picture if selected
      if (selectedFile) {
        formDataToSend.append('profile_picture', selectedFile);
      }
  
  
      const response = await axiosClient.post(
        `/admin/users/${adminId}/update`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 200) {
        showAlert(response.data.message, "success");
        fetchUsers();
        editHandleOpen();
      }
    } catch (error) {
      console.error('Update Error:', error);
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            showAlert(`${field}: ${message}`, "error");
          });
        });
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open={editOpen} handler={editHandleOpen}>
        <DialogHeader>Edit Admin</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          {loading ? (
            <Loading />
          ) : saving ? (
            <Loading />
          ) : (
            <>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5 px-4">
                  <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
                    <img
                      src={selectedImage || '/rocky_go_logo.png'}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = '/rocky_go_logo.png';
                        e.target.onerror = null;
                      }}
                    />
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
                    label={
                      field === "password" ? "Password" : "Confirm Password"
                    }
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
              disabled={saving}
              onClick={editHandleOpen}
            >
              <span className="m-0 p-0">Cancel</span>
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary"
              type="submit"
              disabled={saving}
            >
              <span className="m-0 p-0">{saving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </form>
  );
};

export default EditAdminModal;
