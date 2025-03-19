import React, { useEffect, useState } from "react";
import {
  Input,
  Tabs,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { UserRoundCog, LockKeyhole } from 'lucide-react';
import { Base, Header, Body, Footer, Sidebar } from "../Modal";
import { useStateContext } from "../../contexts/contextProvider";

const ProfileModal = ({ open, handleOpen, userId, userType, fetchUsers }) => {

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
  const { user } = useStateContext();

  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await axiosClient.get(`/admin/users/${userId}`);
  //     if (response.status === 200) {
  //       setFirstName(response.data.data.first_name);
  //       setLastName(response.data.data.last_name);
  //       setEmail(response.data.data.email);
  //       setMobileNumber(response.data.data.mobile_number);
  //       setLocalSupportNumber(response.data.data.local_support_number);
  //       setBusinessLandlineNumber(response.data.data.store?.phone ?? "");
  //       setBusinessContactNumber(response.data.data.store?.mobile ?? "");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  // const updateUser = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("first_name", firstName);
  //     formData.append("last_name", lastName);
  //     formData.append("email", email);
  //     formData.append("mobile_number", mobileNumber);
  //     formData.append("local_support_number", localSupportNumber);
  //     formData.append("business_landline_number", businessLandlineNumber);
  //     formData.append("business_contact_number", businessContactNumber);
  //     if (password) formData.append("password", password);
  //     if (confirmPassword) formData.append("password_confirmation", confirmPassword);

  //     const response = await axiosClient.post(
  //       `/admin/users/update/${userId}`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     if (response.status === 202) {
  //       showAlert("User updated successfully!", "success");
  //       fetchUsers();
  //       handleOpen();
  //     }
  //   } catch (error) {
  //     if (error.response?.data?.errors) {
  //       Object.values(error.response.data.errors)
  //         .flat()
  //         .forEach((errorMessage) => showAlert(errorMessage, "error"));
  //     } else {
  //       showAlert("An error occurred. Please try again.", "error");
  //     }
  //   }
  // };

  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    updateUser();
  };

  // useEffect(() => {
  //   setLoading(true);
  //   if (open && userId) {
  //     fetchUserDetails();
  //   } else {
  //     setFirstName("");
  //     setLastName("");
  //     setEmail("");
  //     setMobileNumber("");
  //     setLocalSupportNumber("");
  //     setBusinessLandlineNumber("");
  //     setBusinessContactNumber("");
  //     setPassword("");
  //     setConfirmPassword("");
  //     setPasswordVisibility({ 
  //       password: false, 
  //       newPassword: false,
  //       confirmPassword: false 
  //     });
  //   }
  //   setLoading(false);
  // }, [open, userId]);

  // Define tabs for the sidebar
  
  const tabs = [
    {
      value: "basic_setting",
      label: "Basic Setting",
      icon: <UserRoundCog />,
      content: (
        <>
          <div className="border-b border-gray-300 pb-2">
            <Typography variant="small" className="text-xs font-semibold">Photo</Typography>
            <div className="flex items-center py-4 gap-5">
              <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center"></div>
              <div>
                <Typography variant="small" className="text-[10px] text-gray-500">JPG or PNG. Max size of 800K</Typography>
                <button className="text-[10px] text-white py-1 px-2 bg-primary rounded">Choose File</button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              label="First Name"
              type="text"
              value={user.first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              type="text"
              value={user.last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              value={user.email}
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
              value=""
              onChange={(e) => setMobileNumber(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </>
      )
    },
    {
      value: "security",
      label: "Security",
      icon: <LockKeyhole />,
      content: (
        <>
          <div className="relative py-2">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Current Password"
              type={passwordVisibility.password ? "text" : "password"}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("password")}
            >
              {passwordVisibility.password ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="py-2">
            <div className="relative">
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                label="New Password"
                type={passwordVisibility.newPassword ? "text" : "password"}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => toggleVisibility("newPassword")}
              >
                {passwordVisibility.newPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <Typography variant="small" className="text-xs text-gray-500 pt-2">
              Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%).
            </Typography>
          </div>

          <div className="relative py-2">
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => toggleVisibility("confirmPassword")}
            >
              {passwordVisibility.confirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </>
      )
    }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Base open={open} handleOpen={handleOpen} size="lg">
        <Tabs value={activeTab} className="w-full flex rounded-lg" orientation="vertical">      
          <div className="flex w-full">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              tabs={tabs}
              sidebarTitle="PROFILE" 
            />
            <div className="w-full">
              <Header title={tabs.find(tab => tab.value === activeTab)?.label} onClose={handleOpen} />
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