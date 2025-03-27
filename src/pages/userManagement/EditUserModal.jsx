import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Tabs,
  Avatar,
  Typography,
  DialogBody,
  Dialog,
  DialogHeader,
  IconButton,
  Chip,
  Tooltip,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { EyeIcon, X, UserRoundCog, PaperclipIcon } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { Base, Header, Body, Footer, Sidebar } from "../../components/Modal";
import EditStoreBranchesModal from "./EditStoreBranchesModal";

const EditUserModal = ({ open, handleOpen, userId, userType, fetchUsers }) => {
  const [storeBranch, setStoreBranch] = useState([]);
  const [storeBranchId, setStoreBranchId] = useState(0);
  const [storeBranchDialogOpen, setStoreBranchDialogOpen] = useState(false);
  const [storeUserType, setStoreUserType] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [openImage, setOpenImage] = useState(false);
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

  const handleImageOpen = () => {
    setOpenImage(!openImage);
  };
  const checkimagePreview = (e, key, value) => {
    e.preventDefault();
    setPreviewImage(
      imagePreview[key] ||
        `${import.meta.env.VITE_APP_IMAGE_PATH}/applicant/${value}`
    );
    setOpenImage(!openImage);
  };

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("User Details");

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

  const fetchStoreBranches = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/admin/users/store-branches/${userId}`
      );
      if (response.status === 200) {
        const userData = response.data.data;
        setStoreBranch(userData);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    setSaving(true);
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
      setSaving(false);
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

  const handleStoreBranchesModal = (userId, userType) => {
    setStoreBranchDialogOpen(!storeBranchDialogOpen);
    setStoreBranchId(userId);
    setStoreUserType(userType);
  };

  useEffect(() => {
    if (open && userId) {
      fetchStoreBranches();
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
      setActiveTab(tabs[0]?.value || "")
  }, [open, userId]);

  const tabs = [
    {
      value: "User Details",
      label: "Details",
      icon: <UserRoundCog />,
      content: (
        <div className="flex flex-col gap-5">
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

          {userType === "rider" || userType === "customer" ? (
            <Input
              label="Mobile Number"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              autoComplete="tel"
            />
          ) : userType === "operator" ? (
            <Input
              label="Local Support Number"
              type="text"
              value={localSupportNumber}
              autoComplete="tel"
              onChange={(e) => setLocalSupportNumber(e.target.value)}
            />
          ) : userType === "central" || userType === "restaurant" ? (
            <>
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
            </>
          ) : (
            <div></div>
          )}
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
              type={passwordVisibility.confirmPassword ? "text" : "password"}
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
        </div>
      ),
    },

    ...(userType === "rider"
      ? [
          {
            value: "Attachments",
            label: "Attachments",
            icon: <PaperclipIcon></PaperclipIcon>,
            content: (
              <>
                {activeTab !== "User Details" ? (
                  <div className="grid grid-cols-1 gap-1 pb-10 md:grid-cols-2">
                    {Object.entries(ridersAttachments).map(([key, value]) => (
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
                          <Typography className="text-nowrap text-sm font-semibold">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .toUpperCase()}{" "}
                          </Typography>
                        </label>

                        {imagePreview[key] || value ? (
                          <div className="flex">
                            <div className="group relative">
                              <Avatar
                                src={
                                  imagePreview[key] ||
                                  `${
                                    import.meta.env.VITE_APP_IMAGE_PATH
                                  }/applicant/${value}`
                                }
                                alt={`${key} Preview`}
                                className="h-48 w-48 border border-gray-300 object-cover shadow-md"
                                variant="rounded"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-4 rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Button
                                  onClick={(e) =>
                                    checkimagePreview(e, key, value)
                                  }
                                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100"
                                >
                                  <span>View</span>
                                </Button>
                                <Button
                                  onClick={() =>
                                    document.getElementById(key).click()
                                  }
                                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100"
                                >
                                  Upload
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 shadow-md">
                            <span className="text-center text-sm text-gray-500">
                              Upload {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}

                <Dialog
                  inert={openImage?"true":undefined}
                  open={openImage}
                  handler={handleImageOpen}
                  className="flex h-full w-full flex-col items-center justify-center bg-transparent"
                >
                  <div className="flex min-w-full items-end justify-end">
                    <DialogHeader className="flex flex-row">
                      <IconButton
                        className="flex justify-end"
                        variant="text"
                        onClick={handleImageOpen}
                      >
                        <X color="white" />
                      </IconButton>
                    </DialogHeader>
                  </div>
                  <DialogBody>
                    <img
                      src={previewImage}
                      alt="Full Preview"
                      className="min-w-[42rem] max-w-2xl"
                    />
                  </DialogBody>
                </Dialog>
              </>
            ),
          },
        ]
      : []),

    ...(userType === "central"
      ? [
          {
            value: "Store Branches",
            label: "Store Branches",
            icon: <PaperclipIcon></PaperclipIcon>,
            content: (
              <>
                {activeTab !== "User Details" ? (
                  <div className="overflow-scroll">
                    <table className="w-full min-w-max table-auto rounded-md text-left">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="rounded-bl-md rounded-tl-md bg-tableHeaderBg p-4">
                            <Typography
                              variant="small"
                              color="black"
                              className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                              User Information
                            </Typography>
                          </th>
                          <th className="rounded-bl-md rounded-tl-md bg-tableHeaderBg p-4">
                            <Typography
                              variant="small"
                              color="black"
                              className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                              Status
                            </Typography>
                          </th>
                          <th className="rounded-bl-md rounded-tl-md bg-tableHeaderBg p-4">
                            <Typography
                              variant="small"
                              color="black"
                              className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                              Action
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeBranch.map((store, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-300 hover:bg-gray-100"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {store?.users[0]?.first_name || ""}{" "}
                                    {store?.users[0]?.last_name || ""}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {store?.users[0]?.email || ""}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="w-max">
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={
                                    store?.users[0]?.is_active == 1
                                      ? "Active"
                                      : store?.users[0]?.is_active == 2
                                      ? "Suspended"
                                      : store?.users[0]?.is_active == 3
                                      ? "Deleted"
                                      : "Inactive"
                                  }
                                  color={
                                    store?.users[0]?.is_active == 1
                                      ? "green"
                                      : store?.users[0]?.is_active == 2
                                      ? "orange"
                                      : store?.users[0]?.is_active == 3
                                      ? "red"
                                      : "blue-gray"
                                  }
                                />
                              </div>
                            </td>
                            <td className="p-4">
                              <Tooltip className="z-[9999]" content="Edit User">
                                <IconButton
                                  variant="text"
                                  onClick={() =>
                                    handleStoreBranchesModal(
                                      store?.users[0]?.id,
                                      store?.users[0]?.user_type
                                    )
                                  }
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div></div>
                )}

                <Dialog
                  inert={openImage?"true":undefined}
                  open={openImage}
                  handler={handleImageOpen}
                  className="flex h-full w-full flex-col items-center justify-center bg-transparent"
                >
                  <div className="flex min-w-full items-end justify-end">
                    <DialogHeader className="flex flex-row">
                      <IconButton
                        className="flex justify-end"
                        variant="text"
                        onClick={handleImageOpen}
                      >
                        <X color="white" />
                      </IconButton>
                    </DialogHeader>
                  </div>
                  <DialogBody>
                    <img
                      src={previewImage}
                      alt="Full Preview"
                      className="min-w-[42rem] max-w-2xl"
                    />
                  </DialogBody>
                </Dialog>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Base open={open} handleOpen={handleOpen} size="lg">
          <Tabs
            value={activeTab}
            className="flex w-full rounded-lg"
            orientation="horizontal"
          >
            <div className="flex w-full flex-col sm:flex-row">
              <Sidebar
                className="py-5"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                sidebarTitle="PROFILE"
              />
              <div className="w-full">
                <Header title={activeTab} onClose={handleOpen} />
                <Body tabs={tabs} loading={loading} activeTab={activeTab} />
                <Footer
                  loading={loading}
                  saving={saving}
                  onCancel={handleOpen}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </Tabs>
        </Base>
      </form>

      <EditStoreBranchesModal
        open={storeBranchDialogOpen}
        handleOpen={handleStoreBranchesModal}
        userId={storeBranchId}
        userType={storeUserType}
        fetchStoreBranches={fetchStoreBranches}
      />
    </>
  );
};

export default EditUserModal;
