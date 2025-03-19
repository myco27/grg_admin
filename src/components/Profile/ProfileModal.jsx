import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Avatar,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { UserRoundCog, LockKeyhole } from 'lucide-react'

const ProfileModal = ({ open, handleOpen, userId, userType, fetchUsers }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [localSupportNumber, setLocalSupportNumber] = useState("");
  const [businessLandlineNumber, setBusinessLandlineNumber] = useState("");
  const [businessContactNumber, setBusinessContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    houseNumber: "",
    building: "",
    street: "",
    district: "",
    zipcode: "",
    city: "",
    state: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("info");

  const [ridersAttachments, setRidersAttachments] = useState({
    license: null,
    roadTax: null,
    certificateOfRegistration: null,
    vaccinationCard: null,
  });

  const [imagePreview, setImagePreview] = useState({
    license: null,
    roadTax: null,
    certificateOfRegistration: null,
    vaccinationCard: null,
  });

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setRidersAttachments((prev) => ({
        ...prev,
        [type]: file,
      }));

      setImagePreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axiosClient.get(`/admin/users/${userId}`);

      if (response.status === 200) {
        setFirstName(response.data.data.first_name);
        setLastName(response.data.data.last_name);
        setEmail(response.data.data.email);
        setMobileNumber(response.data.data.mobile_number);
        setLocalSupportNumber(response.data.data.local_support_number);
        setBusinessLandlineNumber(response.data.data.store?.phone ?? "");
        setBusinessContactNumber(response.data.data.store?.mobile ?? "");

        if (response.data.data.address) {
          setAddress({
            houseNumber: response.data.data.address.number,
            building: response.data.data.address.building,
            street: response.data.data.address.street,
            district: response.data.data.address.district,
            zipcode: response.data.data.address.zipcode,
            city: response.data.data.address.city,
            state: response.data.data.address.state,
          });
        }

        if (response.data.data.rider_attachments) {
          const attachments = {
            license: response.data.data.rider_attachments.license,
            roadTax: response.data.data.rider_attachments.official_receipt,
            certificateOfRegistration:
              response.data.data.rider_attachments.certificate_registration,
            vaccinationCard: response.data.data.rider_attachments.vaccine,
          };

          setRidersAttachments(attachments);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("mobile_number", mobileNumber);
      formData.append("local_support_number", localSupportNumber);
      formData.append("business_landline_number", businessLandlineNumber);
      formData.append("business_contact_number", businessContactNumber);
      if (password) formData.append("password", password);
      if (confirmPassword)
        formData.append("password_confirmation", confirmPassword);
      formData.append("address", address);

      Object.entries(ridersAttachments).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(key, file);
        } else {
          formData.append(key, "");
        }
      });

      const response = await axiosClient.post(
        `/admin/users/update/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 202) {
        showAlert("User updated successfully!", "success");
        fetchUsers();
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
    updateUser();
  };

  useEffect(() => {
    setLoading(true);

    if (open && userId) {
      fetchUserDetails();
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobileNumber("");
      setLocalSupportNumber("");
      setBusinessLandlineNumber("");
      setBusinessContactNumber("");
      setPassword("");
      setConfirmPassword("");
      setPasswordVisibility({ password: false, confirmPassword: false });

      setRidersAttachments({
        license: null,
        roadTax: null,
        certificateOfRegistration: null,
        vaccinationCard: null,
      });

      setImagePreview({
        license: null,
        roadTax: null,
        certificateOfRegistration: null,
        vaccinationCard: null,
      });
    }

    setLoading(false);
  }, [open, userId]);

  return (
    <>
      <Dialog size={userType === "rider" ? "lg" : "md"} open={open} handler={handleOpen}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between"
          >
              <>
                <Tabs
                  value={activeTab}
                  className="w-full flex rounded-lg"
                  orientation="vertical"
                >
                <div className=" bg-primary px-4">
                    <DialogHeader className="text-white text-sm ml-0 pl-1 pb-1">PROFILE</DialogHeader>
                    <TabsHeader
                    className="bg-transparent text-nowrap w-full h-full gap-2"
                    indicatorProps={{
                      className: "bg-[#3A1066]",
                    }}
                  >
                    <Tab
                      value="basic_setting"
                      onClick={() => setActiveTab("basic_setting")}
                      className={`justify-start ${
                        activeTab === "basic_setting" ? "text-white" : "text-white"
                      }`}
                    >
                        <div className="flex items-center text-xs p-1">
                            <UserRoundCog className="w-4 h-4 mr-2" />
                            Basic Setting
                        </div>
                        
                    </Tab>

                    <Tab
                      value="security"
                      onClick={() => setActiveTab("security")}
                      className={`justify-start ${
                        activeTab === "security"
                          ? "text-white"
                          : "text-white"
                      }`}
                    >
                        <div className="flex items-center text-xs p-1">
                            <LockKeyhole className="w-4 h-4 mr-2" />
                            Security
                        </div>
                    </Tab>
                  </TabsHeader>
                </div>                
                    <div className="w-full">
                        <TabsBody className="h-[50vh] overflow-auto px-2">
                            {/* Basic Setting Tab */}
                            <TabPanel className="flex flex-col gap-2 px-2 h-full" value="basic_setting">
                                <div className="border-b border-gray-300 pb-2">
                                    <Typography variant="small" className="text-xs font-semibold">Basic Setting</Typography>
                                </div>
                                <div className="border-b border-gray-300 pb-2 pt-4">
                                    <Typography variant="small" className="text-xs font-semibold">Photo</Typography>
                                    <div className="flex items-center py-4 gap-5">
                                        <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
                                        </div>
                                        <div>
                                            <Typography variant="small" className="text-[10px] text-gray-500">JPG or PNG. Max size of 800K</Typography>
                                            <Button className="text-[10px] text-white py-1 bg-primary">Choose File</Button>
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
                            </TabPanel>

                            {/* Security Tab */}
                            <TabPanel
                            className="flex flex-col gap-4 px-2 h-full"
                            value="security"
                            >
                                <div className="border-b border-gray-300 pb-2">
                                    <Typography variant="small" className="text-xs font-semibold">Security</Typography>
                                </div>

                                <div className="relative ">
                                <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Current Password"
                                type={
                                    passwordVisibility.password ? "text" : "password"
                                }
                                className="pr-10"
                                autoComplete="new-password"
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

                            {/* Password Field */}
                            <div>
                                <div className="relative ">
                                    <Input
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    label="New Password"
                                    type={
                                        passwordVisibility.newPassword ? "text" : "password"
                                    }
                                    className="pr-10"
                                    autoComplete="new-password"
                                    />
                                    <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    onClick={() => toggleVisibility("newPassword")}
                                    >
                                    {passwordVisibility.newPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                    </button>
                                </div>
                                <Typography variant="small" className="text-xs text-gray-500 pt-2">Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%).</Typography>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <Input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="Confirm Password"
                                type={
                                    passwordVisibility.confirmPassword
                                    ? "text"
                                    : "password"
                                }
                                className="pr-10"
                                autoComplete="new-password"
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
                            </TabPanel>
                        </TabsBody>
                        <div className="flex justify-end gap-2 bg-white p-2 border-t border-gray-300">
                            <Button
                                color="gray"
                                disabled={loading}
                                onClick={handleOpen}
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button
                                className="bg-primary"
                                type="submit"
                                disabled={loading}
                            >
                                <span className="m-0 p-0">{loading ? "Saving..." : "Save"}</span>
                            </Button>
                        </div>
                    </div>     
                </Tabs>    
              </>    
          </form>
      </Dialog>
    </>
  );
};

export default ProfileModal;
