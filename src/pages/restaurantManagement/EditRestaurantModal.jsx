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
  Spinner,
  TabsBody,
  TabPanel,
  DialogFooter,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  EyeIcon,
  EyeClosed,
  X,
  UserRoundCog,
  PaperclipIcon,
  Search,
  ArrowLeftRight,
  Medal,
} from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { Base, Header, Body, Footer, Sidebar } from "../../components/Modal";
import useDebounce from "../../components/UseDebounce";
import Pagination from "../../components/OrdersPage/Pagination";

const EditRestaurantModal = ({ open, handleOpen, storeId, fetchStores }) => {
  const [storesAttachments, setStoresAttachments] = useState({
    businessCertificate: null,
    certificateOfRegistration: null,
  });

  const [imagePreview, setImagePreview] = useState({
    businessCertificate: null,
    certificateOfRegistration: null,
  });

  const [activeTab, setActiveTab] = useState("Attachments");

  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm });
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

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const fetchRestaurantDetails = async () => {
    setLoading(true);

    try {
      const response = await axiosClient.get(`/admin/store/${storeId}`);

      if (response.status === 200) {
        console.log(response.data.data);
        if (response.data.data.resto_attachments) {
          const restoAttachments = {
            businessCertificate:
              response.data.data.resto_attachments.business_permit,
            certificateOfRegistration:
              response.data.data.resto_attachments.certificate_registration,
          };
          setStoresAttachments(restoAttachments);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && storeId) {
      fetchRestaurantDetails();
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

      setStoresAttachments({
        businessCertificate: null,

        certificateOfRegistration: null,
      });

      setImagePreview({
        businessCertificate: null,

        certificateOfRegistration: null,
      });
    }
    setActiveTab("Attachments");
  }, [open, storeId]);

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

  const tabs = [
    {
      value: "Attachments",
      label: "Attachments",
      icon: <PaperclipIcon></PaperclipIcon>,
      content: (
        <>
          <div className="grid grid-cols-1 gap-1 pb-10 md:grid-cols-2">
            {Object.entries(storesAttachments).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center gap-2">
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
                          onClick={(e) => checkimagePreview(e, key, value)}
                          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100"
                        >
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => document.getElementById(key).click()}
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

          <Dialog
            inert={openImage ? "true" : undefined}
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
  ];

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setStoresAttachments((prev) => ({
        ...prev,
        [type]: file,
      }));

      setImagePreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
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

      Object.entries(storesAttachments).forEach(([key, file]) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser();
  };

  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="flex flex-col"
        dismiss={{ outsidePress: false }}
      >
        <Tabs
          value={activeTab}
          className="flex w-full overflow-hidden rounded-lg"
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
              <DialogHeader className="px-4">
                <div className="flex w-full items-center justify-between border-b border-gray-300 py-2">
                  <Typography variant="h5" className="font-semibold">
                    {activeTab}
                  </Typography>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleOpen}
                  >
                    &times; {/* This is the "X" character */}
                  </button>
                </div>
              </DialogHeader>
              <DialogBody className="p-0">
                <TabsBody className="overflow-auto px-2">
                  {tabs.map((tab) =>
                    tab.value === activeTab ? (
                      <TabPanel
                        key={tab.value}
                        value={tab.value}
                        className="flex h-full flex-col gap-2 px-2"
                      >
                        {tab.content}
                      </TabPanel>
                    ) : null
                  )}
                </TabsBody>
              </DialogBody>
              <DialogFooter className="flex justify-end gap-2 bg-white p-2 border-t border-gray-300">
                <>
                  <Button color="gray" disabled={loading} onClick={handleOpen}>
                    Cancel
                  </Button>

                  <Button
                    className="bg-primary"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    <span className="m-0 p-0">
                      {saving ? "Saving..." : "Save"}
                    </span>
                  </Button>
                </>
              </DialogFooter>
            </div>
          </div>
        </Tabs>
      </Dialog>
    </>
  );
};

export default EditRestaurantModal;
