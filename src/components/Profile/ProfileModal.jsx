import React, { useEffect, useState } from "react";
import { Input, Tabs, Typography } from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { EyeIcon, EyeClosed } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { UserRoundCog, LockKeyhole } from "lucide-react";
import { Base, Header, Body, Footer, Sidebar } from "../Modal";
import { useStateContext } from "../../contexts/contextProvider";

const ProfileModal = ({ open, handleOpen, userId, userType }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [currentPasswordError, setCurrentPasswordStatus] = useState(false);
  const [newPasswordError, setNewPasswordStatus] = useState(false);
  const [confirmPasswordError, setConfirmPasswordStatus] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("basic_setting");
  const { user, setUser } = useStateContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const changePassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await axiosClient.post(
        `/admin/users/update-password/${userId}`,
        {
          old_password: password,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }
      );
      if (response.status === 200) {
        showAlert("Password updated successfully!", "success");
        handleOpen();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
    
        if (errors.new_password) {
          errors.new_password.forEach((msg) => showAlert(msg, "error"));
          setNewPasswordStatus(true);
          if (errors.new_password == 'The new password field confirmation does not match.') {
            setConfirmPasswordStatus(true);
            setNewPasswordStatus(false);
          }
        }
        
        if (errors.old_password) {
          errors.old_password.forEach((msg) => showAlert(msg, "error"));
          setCurrentPasswordStatus(true);
        }
    
        // Generic handling for any other errors
        Object.entries(errors).forEach(([key, messages]) => {
          if (key !== "new_password" && key !== "old_password") {
            messages.forEach((msg) => showAlert(msg, "error"));
          }
        });
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
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

  const fetchUserDetails = async () => {
    try {
      const response = await axiosClient.get(`/admin/users/${userId}/roles`);

      if (response.status === 200) {
        setFirstName(response.data.user.first_name);
        setLastName(response.data.user.last_name);
        setEmail(response.data.user.email);
        setMobileNumber(response.data.user.mobile_number);
        
        // If there's an existing profile picture, set it for preview
        if (response.data.user.profile_picture) {
          // Use the environment variable for the base URL
          setSelectedImage(`${import.meta.env.VITE_APP_IMAGE_PATH}/profileImage/${response.data.user.profile_picture}`);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Mobile number validation
    const trimmedMobile = mobileNumber.trim();
    if (trimmedMobile.length < 7 || trimmedMobile.length > 15 || !/^\d+$/.test(trimmedMobile)) {
      showAlert("Mobile number must be between 7 and 15 digits and contain only numbers.", "error");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('mobile_number', mobileNumber);
      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const response = await axiosClient.post(
        `/admin/users/update-profile/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        showAlert(response.data.message, "success");
        handleOpen();
        
        // Cleanup the object URL after successful upload
        if (selectedImage && selectedImage.startsWith('blob:')) {
          URL.revokeObjectURL(selectedImage);
        }
      
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => showAlert(errorMessage, "error"));
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (activeTab === "security") {
      changePassword(event);
    } else {
      updateUser(event);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserDetails();
    }
  }, [open, userId]);

  // Define tabs for the sidebar
  const tabs = [
    {
      value: "basic_setting",
      label: "Basic Setting",
      icon: <UserRoundCog />,
      content: (
        <>
          <div className="border-b border-gray-300 pb-2">
            <Typography variant="small" className="text-xs font-semibold">
              Photo
            </Typography>
            <div className="flex items-center py-4 gap-5">
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
              />
                <button className="text-[10px] text-white py-1 px-2 bg-primary rounded" onClick={() => document.getElementById('image-input').click()}>
                  Choose File
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              autoComplete="username"
            />
          </div>
          <div className="flex gap-2 py-4">
            <Input
              label="Mobile Number"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </>
      ),
    },
    {
      value: "security",
      label: "Security",
      icon: <LockKeyhole />,
      handleSubmit: changePassword,
      content: (
        <>
          <form>
            <div className="relative py-2">
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setCurrentPasswordStatus(false); // Reset error on change
                }}
                label="Current Password"
                type={passwordVisibility.password ? "text" : "password"}
                id="current-password"
                error={currentPasswordError}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                onClick={() => toggleVisibility("password")}
              >
                {passwordVisibility.password ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="py-2">
              <div className="relative">
                <Input
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordStatus(false);
                  }}
                  label="New Password"
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  error={newPasswordError}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => toggleVisibility("newPassword")}
                >
                  {passwordVisibility.newPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </button>
              </div>
              <Typography
                variant="small"
                className="text-xs text-gray-500 pt-2"
              >
                Your password must be at least 8 characters and should include a
                combination of numbers, letters and special characters (!$@%).
              </Typography>
            </div>

            <div className="relative py-2">
              <Input
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordStatus(false);
                }}
                label="Confirm Password"
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                error={confirmPasswordError}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                onClick={() => toggleVisibility("confirmPassword")}
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Base open={open} handleOpen={handleOpen} size="lg">
        <Tabs
          value={activeTab}
          className="w-full flex rounded-lg"
          orientation="vertical"
        >
          <div className="flex w-full">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              sidebarTitle="PROFILE"
            />
            <div className="w-full">
              <Header
                title={tabs.find((tab) => tab.value === activeTab)?.label}
                onClose={handleOpen}
              />
              <Body tabs={tabs} activeTab={activeTab} />
              <Footer
                loading={loading}
                onCancel={handleOpen}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </Tabs>
      </Base>
    </form>
  );
};

export default ProfileModal;
