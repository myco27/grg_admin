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
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";

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

  const fetchUserDetails = async () => {
    try {
      const response = await axiosClient.get(`/admin/users/${userId}`);
      console.log(response.data.data.store);
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await axiosClient.put(`/admin/users/update/${userId}`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile_number: mobileNumber,
        local_support_number: localSupportNumber,
        business_landline_number: businessLandlineNumber,
        business_contact_number: businessContactNumber,
        password: password,
        password_confirmation: confirmPassword,
        address: address,
      });

      if (response.status === 202) {
        showAlert("User updated successfully!", "success");
        fetchUsers();
        handleOpen();
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
      setAddress({
        houseNumber: "",
        building: "",
        street: "",
        district: "",
        zipcode: "",
        city: "",
        state: "",
      });
      setPasswordVisibility({ password: false, confirmPassword: false });
    }
  }, [open, userId]);

  return (
    <>
      <Dialog size="md" open={open} handler={handleOpen}>
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody>
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="border-8 border-gray-300 border-t-purple-500 rounded-full w-16 h-16 animate-spin mt-[-10vh]" />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
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

              {/* Rider and Customer Fields */}
              {(userType === "rider" || userType === "customer") && (
                <>
                  {/* <Tabs
                    value={activeTab}
                    className="w-full flex gap-4"
                    orientation="vertical"
                  > */}
                  {/* Tab Headers */}
                  {/* <TabsHeader
                      className="bg-gray-100 text-nowrap my-4"
                      indicatorProps={{
                        className: "bg-purple-200 text-purple-900",
                      }}
                    >
                      <Tab
                        value="info"
                        onClick={() => setActiveTab("info")}
                        className={`justify-start ${
                          activeTab === "info"
                            ? "text-purple-600"
                            : "text-gray-700"
                        }`}
                      >
                        User Information
                      </Tab>

                      <Tab
                        value="address"
                        onClick={() => setActiveTab("address")}
                        className={`justify-start ${
                          activeTab === "address"
                            ? "text-purple-600"
                            : "text-gray-700"
                        }`}
                      >
                        User Address
                      </Tab>
                    </TabsHeader> */}

                  {/* <TabsBody className="max-h-[50vh]"> */}
                  {/* User Information Tab */}
                  {/* <TabPanel
                        className="flex flex-col gap-4 px-0"
                        value="info"
                      > */}
                  {/* {(userType === "rider" || userType === "customer") && ( */}
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
                  </>
                  {/* )} */}
                  {/* </TabPanel> */}

                  {/* User Address Tab */}
                  {/* <TabPanel
                        className="flex flex-col gap-4 px-0"
                        value="address"
                      >
                        <Input
                          label="House Number"
                          type="text"
                          value={address.houseNumber}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              houseNumber: e.target.value,
                            })
                          }
                          className=""
                        />
                        <Input
                          label="Building"
                          type="text"
                          value={address.building}
                          onChange={(e) =>
                            setAddress({ ...address, building: e.target.value })
                          }
                          className=""
                        />
                        <Input
                          label="Street"
                          type="text"
                          value={address.street}
                          onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                          }
                          className=""
                        />
                        <Input
                          label="District"
                          type="text"
                          value={address.district}
                          onChange={(e) =>
                            setAddress({ ...address, district: e.target.value })
                          }
                          className=""
                        />
                        <Input
                          label="ZIP Code"
                          type="text"
                          value={address.zipcode}
                          onChange={(e) =>
                            setAddress({ ...address, zipcode: e.target.value })
                          }
                          className=""
                        />
                        <Input
                          label="City"
                          type="text"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          className=""
                        />
                        <Input
                          label="State"
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                          }
                          className=""
                        />
                      </TabPanel> */}
                  {/* </TabsBody> */}
                  {/* </Tabs> */}
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

              <div className="flex justify-end gap-2">
                <Button variant="gradient" color="gray" onClick={handleOpen}>
                  <span>Cancel</span>
                </Button>
                <Button type="submit" variant="gradient" color="purple">
                  <span>Save</span>
                </Button>
              </div>
            </form>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default EditUserModal;
