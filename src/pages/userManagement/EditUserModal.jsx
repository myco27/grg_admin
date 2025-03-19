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
import DialogBoxLoading from "../../components/layout/DialogBoxLoading";

const EditUserModal = ({ open, handleOpen, userId, userType, fetchUsers }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [localSupportNumber, setLocalSupportNumber] = useState("");
  const [businessLandlineNumber, setBusinessLandlineNumber] = useState("");
  const [businessContactNumber, setBusinessContactNumber] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/users/${userId}`);
      if (response.status === 200) {
        setFirstName(response.data.data.first_name);
        setLastName(response.data.data.last_name);
        setEmail(response.data.data.email);
        setMobileNumber(response.data.data.mobile_number);
        setLocalSupportNumber(response.data.data.local_support_number);
        setBusinessLandlineNumber(response.data.data.mobile_number ?? "");
        setBusinessContactNumber(response.data.data.store?.phone ?? "");

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
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    setLoading(true);
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
    updateUser();
  };

  useEffect(() => {
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
  }, [open, userId]);

  return (
    <>
      <Dialog
        size={userType === "rider" ? "lg" : "md"}
        open={open}
        handler={handleOpen}
      >
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody>
          {loading ? (
            <DialogBoxLoading />
          ) : (
            <form
              className="flex flex-col justify-between gap-4 min-h-[50vh]"
            >
              {/* Operator Field */}
              {userType === "operator" && (
                <>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    type="email"
                    autoComplete="username"
                  />
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
                  <Input
                    label="Local Support Number"
                    type="text"
                    value={localSupportNumber}
                    autoComplete="tel"
                    onChange={(e) => setLocalSupportNumber(e.target.value)}
                  />
                  {/* Password Field */}
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      type={passwordVisibility.password ? "text" : "password"}
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

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Confirm Password"
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
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
                </>
              )}
              {/* Customer Field */}
              {userType === "customer" && (
                <>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    type="email"
                    autoComplete="username"
                  />
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
                  <Input
                    label="Mobile Number"
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    autoComplete="tel"
                  />

                  {/* Password Field */}
                  <div className="relative ">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      type={passwordVisibility.password ? "text" : "password"}
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
                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Confirm Password"
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
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
                </>
              )}
              {/* Rider Fields */}
              {userType === "rider" && (
                <>
                  <Tabs
                    value={activeTab}
                    className="w-full flex gap-4"
                    orientation="vertical"
                  >
                    <TabsHeader
                      className="bg-gray-100 text-nowrap my-4"
                      indicatorProps={{
                        className: "bg-purple-500",
                      }}
                    >
                      <Tab
                        value="info"
                        onClick={() => setActiveTab("info")}
                        className={`justify-start ${
                          activeTab === "info" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        User Information
                      </Tab>

                      {/* <Tab
                      value="rider_attachments"
                      onClick={() => setActiveTab("rider_attachments")}
                      className={`justify-start ${
                        activeTab === "rider_attachments"
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      Rider Attachments
                    </Tab> */}
                    </TabsHeader>

                    <TabsBody className="max-h-[50vh] overflow-y-auto px-2">
                      {/* User Information Tab */}
                      <TabPanel
                        className="flex flex-col gap-4 px-0"
                        value="info"
                      >
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          label="Email"
                          type="email"
                          autoComplete="username"
                        />
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
                        <Input
                          label="Mobile Number"
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          autoComplete="tel"
                        />

                        {/* Password Field */}
                        <div className="relative ">
                          <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
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

                      {/* Riders Attachments Tab */}
                      <TabPanel
                        className="flex flex-col gap-4 px-0"
                        value="rider_attachments"
                      >
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                          {Object.entries(ridersAttachments).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex flex-col items-center gap-2"
                              >
                                <input
                                  type="file"
                                  id={key}
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, key)}
                                  className="hidden"
                                />

                                <label htmlFor={key}>
                                  <Typography className="font-semibold text-sm text-nowrap">
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .trim()
                                      .toUpperCase()}{" "}
                                  </Typography>
                                </label>

                                <label htmlFor={key} className="cursor-pointer">
                                  {imagePreview[key] || value ? (
                                    <Avatar
                                      src={
                                        imagePreview[key] ||
                                        `${
                                          import.meta.env.VITE_APP_IMAGE_PATH
                                        }/applicant/${value}`
                                      }
                                      alt={`${key} Preview`}
                                      className="border border-gray-300 shadow-md w-48 h-48"
                                      variant="rounded"
                                    />
                                  ) : (
                                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300 shadow-md">
                                      <span className="text-gray-500 text-sm text-center">
                                        Upload{" "}
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </span>
                                    </div>
                                  )}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </TabPanel>
                    </TabsBody>
                  </Tabs>
                </>
              )}
              {(userType === "central" || userType === "restaurant") && (
                <>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    type="email"
                    autoComplete="username"
                  />
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
                  <Input
                    label="Business Landline Number"
                    type="text"
                    value={businessLandlineNumber}
                    onChange={(e) => setBusinessLandlineNumber(e.target.value)}
                    autoComplete="tel"
                  />
                  <Input
                    label="Business Contact Number"
                    type="text"
                    value={businessContactNumber}
                    onChange={(e) => setBusinessContactNumber(e.target.value)}
                    autoComplete="tel"
                  />

                  {/* Password Field */}
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      type={passwordVisibility.password ? "text" : "password"}
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

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Confirm Password"
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
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
                </>
              )}
            </form>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="gradient"
              color="gray"
              disabled={loading}
              onClick={handleOpen}
            >
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              variant="gradient"
              color="purple"
              disabled={loading}
              onClick={handleSubmit}
            >
              <span>{loading ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditUserModal;
