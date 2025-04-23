import React, { useEffect, useState } from "react";
import {
  Button,
  Tabs,
  Avatar,
  Typography,
  DialogBody,
  Dialog,
  DialogHeader,
  IconButton,
  TabsBody,
  TabPanel,
  DialogFooter,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";

import { X, PaperclipIcon } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import { Sidebar } from "../../components/Modal";

import axios from "axios";

const EditRestaurantModal = ({
  open,
  handleOpen,
  storeId,
  applicantId,
  fetchStores,
}) => {
  const [storesAttachments, setStoresAttachments] = useState({
    businessCertificate: null,
    certificateOfRegistration: null,
  });

  const [imagePreview, setImagePreview] = useState({
    businessCertificate: null,
    certificateOfRegistration: null,
  });

  const [activeTab, setActiveTab] = useState("Attachments");
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ROCKYGO_URL}/store/attachment`,
        {
          applicant_id: applicantId,
          store_id: storeId,
          token: import.meta.env.VITE_ROCKYGO_TOKEN,
        }
      );

      if (response.status === 200) {
        if (response.data.data) {
          const restoAttachments = {
            businessCertificate: response.data.data.business,
            certificateOfRegistration: response.data.data.certificate,
          };
          setStoresAttachments(restoAttachments);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
    }
  };

  const updateStore = async () => {
    setSaving(true);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("token", import.meta.env.VITE_ROCKYGO_TOKEN);
      formData.append("applicant_id", applicantId);
      formData.append("store_id", storeId);
      Object.entries(storesAttachments).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(key, file);
        } else {
          formData.append(key, "");
        }
      });

      const response = await axiosClient.post(
        `${import.meta.env.VITE_ROCKYGO_URL}/store/attachment_update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        showAlert("Store updated successfully!", "success");
        fetchStores();
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

  useEffect(() => {
    if (open && storeId) {
      fetchRestaurantDetails();
    } else {
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
    setPreviewImage(imagePreview[key] || value);
    setOpenImage(!openImage);
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    updateStore();
  };

  const tabs = [
    {
      value: "Attachments",
      label: "Attachments",
      icon: <PaperclipIcon></PaperclipIcon>,
      content: (
        <>
          <div className="grid grid-cols-1 gap-1 pb-10 md:grid-cols-2">
            {Object.entries(storesAttachments).map(([key, value]) => {
              return (
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
                          src={imagePreview[key] || value}
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
              );
            })}
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
