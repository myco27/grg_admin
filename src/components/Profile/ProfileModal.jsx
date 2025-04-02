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

  const [passwordError, setPasswordError] = useState(false);
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
  const { user, fetchUsers } = useStateContext();

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
        if (typeof error.response.data.errors === "object") {
          Object.values(error.response.data.errors)
            .flat()
            .forEach((errorMessage) => showAlert(errorMessage, "error"));
        } else {
          showAlert(error.response.data.errors, "error");
        }
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axiosClient.get(`/admin/users/${userId}/roles`);

      if (response.status === 200) {
        setFirstName(response.data.user.first_name);
        setLastName(response.data.user.last_name);
        setEmail(response.data.user.email);
        setMobileNumber(response.data.user.mobile_number);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post(
        `/admin/users/update-profile/${userId}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          mobile_number: mobileNumber,
        }
      );

      if (response.status === 200) {
        showAlert(response.data.message, "success");
        handleOpen();
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
              <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center"></div>
              <div>
                <Typography
                  variant="small"
                  className="text-[10px] text-gray-500"
                >
                  JPG or PNG. Max size of 800K
                </Typography>
                <button className="text-[10px] text-white py-1 px-2 bg-primary rounded">
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
                  setPasswordError(false); // Reset error on change
                  setPasswordErrorMessage("");
                }}
                label="Current Password"
                type={passwordVisibility.password ? "text" : "password"}
                id="current-password"
                error={passwordError}
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
            {passwordError && (
              <Typography
                id="current-password-error"
                variant="small"
                className="text-xs text-red-500 font-semibold pb-2"
              >
                {passwordErrorMessage}
              </Typography>
            )}

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
