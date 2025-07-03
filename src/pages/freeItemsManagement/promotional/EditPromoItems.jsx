import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Tabs,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useAlert } from "../../../contexts/alertContext";
import axiosClient from "../../../axiosClient";
import DatePicker from "../../../components/OrdersPage/DatePicker";
import { useEffect, useState } from "react";
import Pagination from "../../../components/OrdersPage/Pagination";
import UseDebounce from "../../../components/UseDebounce";
import { Search, X } from "lucide-react";
import { Body, Base, Footer, Header, Sidebar } from "../../../components/Modal";
import Lottie from "lottie-react";
import axios from "axios";

const EditPromoItems = ({
  editOpen,
  editHandleOpen,
  selectedId,
  fetchFreeItemData,
}) => {
  const [centralItems, setCentralItems] = useState([]);
  const [selectedCentralItems, setSelectedCentralItems] = useState([]);
  const [allCentralItemsId, setAllCentralItemsId] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    promoCode: "",
    startDate: "",
    untilDate: "",
    maxQtyDay: 1,
    usersMaxQtyDay: 1,
    limitUsage: 1,
    description: "",
    busyDescription: "",
    image: null,
    lottie: null,
  });
  const [openLottie, setOpenLottie] = useState(false);
  const [lottieJsonContent, setLottieJsonContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState("Promo Free Items");
  const [centralItemSearchTerm, setCentralItemSearchTerm] = useState("");
  const debounceCentralItemSearch = UseDebounce({
    value: centralItemSearchTerm,
  });
  const [centralItemTablePagination, setCentralItemTablePagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  useEffect(() => {
    setActiveTab("Promo Free Items");
    if (editOpen) {
      fetchItemDetails();
      fetchAllCentral();
      setFormData({
        title: "",
        promoCode: "",
        startDate: "",
        untilDate: "",
        maxQtyDay: 1,
        usersMaxQtyDay: 1,
        limitUsage: 1,
        description: "",
        busyDescription: "",
        image: null,
        lottie: null,
      });
      setImagePreview(null);
      setStores([]);
      setLottieJsonContent("");
      setSelectedStore("");
      setCentralItems([]);
      setSelectedCentralItems([]);
      setCentralItemSearchTerm("");
    }
  }, [editOpen]);

  useEffect(() => {
    if (editOpen && selectedStore && activeTab === "Assign Free Items") {
      fetchAllCentralItems();
    }
  }, [
    activeTab,
    selectedStore,
    debounceCentralItemSearch,
    centralItemTablePagination.page,
    centralItemTablePagination.itemsPerPage,
  ]);

  // API CALLS
  const fetchAllCentral = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/get/central/stores");
      const responseData = response.data.modelData;

      setStores(responseData);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCentralItems = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/admin/get/central-items/${selectedStore}`,
        {
          params: {
            search: debounceCentralItemSearch,
            page: centralItemTablePagination.page,
            page_size: centralItemTablePagination.itemsPerPage,
          },
        }
      );

      const responseData = response.data.modelData.data;

      const { data, current_page, last_page, total, links, per_page } =
        response.data.modelData;

      setCentralItems(responseData);
      setAllCentralItemsId(response.data.modelDataIds);
      setCentralItemTablePagination((prev) => ({
        ...prev,
        page: current_page,
        totalPages: last_page,
        totalItems: total,
        links: links,
        itemsPerPage: per_page,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSaving(true);
    try {
      const formDataInstance = new FormData();

      formDataInstance.append("token", import.meta.env.VITE_ROCKYGO_TOKEN);
      formDataInstance.append("title", formData.title);
      formDataInstance.append("promoCode", formData.promoCode);
      formDataInstance.append(
        "startDate",
        new Date(formData.startDate).toISOString()
      );
      formDataInstance.append(
        "untilDate",
        new Date(formData.untilDate).toISOString()
      );
      formDataInstance.append("maxQtyDay", formData.maxQtyDay);
      formDataInstance.append("usersMaxQtyDay", formData.usersMaxQtyDay);
      formDataInstance.append("limitUsage", formData.limitUsage);
      formDataInstance.append("description", formData.description);
      formDataInstance.append("busy_description", formData.busyDescription);
      formDataInstance.append("centralId", selectedStore);
      if (formData.image instanceof File) {
        formDataInstance.append("image", formData.image);
      }

      if (formData.lottie instanceof File) {
        formDataInstance.append("lottie", formData.lottie);
      }

      selectedCentralItems.forEach((item, index) => {
        formDataInstance.append(`selectedCentralItems[${index}]`, item);
      });

      const response = await axios.post(
        `${
          import.meta.env.VITE_ROCKYGO_URL
        }/promo-free-items/update/${selectedId}`,
        formDataInstance,
        {
          withCredentials: true,
        }
      );

      fetchFreeItemData();
      editHandleOpen();
      showAlert("Promo free Item Updated successfully!", "success");
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
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_ROCKYGO_URL
        }/get/promo-free-items/details/${selectedId}`,
        {
          withCredentials: true,
        }
      );

      const responseData = response.data;
      console.log("response", response);

      setSelectedStore(responseData.central_id);
      setSelectedCentralItems(responseData.items.map((data) => data.food_id));

      const imageUrl = `${import.meta.env.VITE_APP_FRONT_IMAGE_PATH}${
        responseData.free_item_image
      }`;
      if (responseData.lottie_link) {
        const lottieUrl = `${import.meta.env.VITE_ROCKYGO_URL}/lottie/${
          responseData.central_id
        }/${responseData.free_item_v2_id}/${responseData.lottie_link
          .split("/")
          .pop()}`;

        const res = await fetch(lottieUrl);
        const data = await res.json();
        setLottieJsonContent(JSON.stringify(data));
        setFormData((prev) => ({ ...prev, lottie: data }));
      }

      // ✅ Set form data
      setFormData((prev) => ({
        ...prev,
        title: responseData.title,
        promoCode: responseData.promo_code,
        startDate: new Date(responseData.start_date),
        untilDate: new Date(responseData.until_date),
        limitUsage: responseData.limit_usage,
        maxQtyDay: responseData.max_qty_day,
        usersMaxQtyDay: responseData.users_max_qty_day,
        description: responseData.description,
        busyDescription: responseData.busy_description,
        image: imageUrl,
      }));

      // setLottieJsonContent(JSON.stringify(lottieJson));
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  //   EVENT LISTENERS
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setSelectedStore(value);
  };

  // -----------------------------PROMO ITEMS EVENT LISTENER---------------------------------------

  const handleCentralItemSearchInput = (event) => {
    const { value } = event.target;
    setCentralItemSearchTerm(value);
    setCentralItemTablePagination({
      ...centralItemTablePagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleCentralItemPageChange = (newPage) => {
    setCentralItemTablePagination({
      ...centralItemTablePagination,
      page: newPage,
    });
  };

  const handleCentralItemPageSizeChange = (value) => {
    setCentralItemTablePagination({
      ...centralItemTablePagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const toggleSelectAllCentralItems = () => {
    const allSelected = allCentralItemsId.every((id) =>
      selectedCentralItems.includes(id)
    );
    if (allSelected) {
      setSelectedCentralItems([]);
    } else {
      setSelectedCentralItems(allCentralItemsId);
    }
  };

  const handleCheckboxChange = (e, foodId) => {
    if (e.target.checked) {
      setSelectedCentralItems((prev) => [...prev, foodId]);
    } else {
      setSelectedCentralItems((prev) => prev.filter((id) => id !== foodId));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name; // "image" or "lottie"

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "image" && file.type.startsWith("image/")) {
        setImagePreview(URL.createObjectURL(file));
      }

      if (name === "lottie" && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => setLottieJsonContent(e.target.result);
        reader.readAsText(file);
      }
    }
  };

  const checkimagePreview = (e, fileOrUrl) => {
    e.preventDefault();
    setPreviewImage(
      fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl
    );
    setOpenImage(true);
  };

  const handleImageOpen = () => setOpenImage(!openImage);
  const handleLottieOpen = () => setOpenLottie(!openLottie);

  const tabs = [
    {
      value: "Promo Free Items",
      label: "Promo Free Items",
      content: (
        <>
          <div className="flex flex-col items-center gap-12 py-4">
            <div className="flex flex-col sm:flex-row gap-6">
              {["image", "lottie"].map((type) => (
                <div key={type} className="flex flex-col items-center gap-2">
                  {/* Label on top */}
                  <label htmlFor={`${type}Upload`} className="cursor-pointer">
                    <Typography className="text-sm font-semibold text-blue-gray-700">
                      UPLOAD {type.toUpperCase()}{" "}
                      {type === "lottie" && "FILE (.json)"}
                    </Typography>
                  </label>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    id={`${type}Upload`}
                    name={type}
                    accept={type === "image" ? "image/*" : "application/json"}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Preview / Info */}
                  {formData[type] ? (
                    type === "image" ? (
                      <div className="group relative">
                        <Avatar
                          src={imagePreview || formData.image}
                          alt={`${type} Preview`}
                          className="h-48 w-48 rounded-lg border border-gray-300 object-cover shadow-md"
                          variant="rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-4 rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            onClick={(e) =>
                              checkimagePreview(e, formData.image)
                            }
                            className="rounded-full bg-white px-4 py-2 text-sm text-gray-800 shadow hover:bg-gray-100"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() =>
                              document.getElementById(`${type}Upload`).click()
                            }
                            className="rounded-full bg-white px-4 py-2 text-sm text-gray-800 shadow hover:bg-gray-100"
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        {lottieJsonContent ? (
                          <Lottie
                            animationData={JSON.parse(lottieJsonContent)}
                            loop
                            autoplay
                            className="h-48 w-48 rounded-lg border border-gray-300 bg-white shadow-md"
                          />
                        ) : (
                          <div
                            className="flex h-48 w-48 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-500"
                            onClick={() =>
                              document.getElementById(`${type}Upload`).click()
                            }
                          >
                            Upload Lottie JSON
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-4 rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            onClick={() => setOpenLottie(true)}
                            className="rounded-full bg-white px-4 py-2 text-sm text-gray-800 shadow hover:bg-gray-100"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() =>
                              document.getElementById(`${type}Upload`).click()
                            }
                            className="rounded-full bg-white px-4 py-2 text-sm text-gray-800 shadow hover:bg-gray-100"
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      onClick={() =>
                        document.getElementById(`${type}Upload`).click()
                      }
                      className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-500 hover:bg-gray-200 transition"
                    >
                      Upload {type === "lottie" ? "Lottie JSON" : "Image"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Preview Dialog */}
          <Dialog
            open={openImage}
            handler={handleImageOpen}
            size="lg"
            className="p-0 bg-transparent"
          >
            <div className="relative w-full max-w-[90vw] md:max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-900">
              <button
                className="absolute top-2 right-2 z-10 text-white hover:text-gray-300"
                onClick={handleImageOpen}
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={previewImage}
                alt="Full Preview"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </div>
          </Dialog>

          {/* Lottie File Preview Dialog */}
          <Dialog
            open={openLottie}
            handler={handleLottieOpen}
            size="lg"
            className="p-0 bg-transparent"
          >
            <div className="relative w-full max-w-[90vw] md:max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-900 text-white">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 z-10 text-white hover:text-gray-300"
                onClick={handleLottieOpen}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-6 flex justify-center items-center min-h-[60vh]">
                {lottieJsonContent ? (
                  <Lottie
                    animationData={JSON.parse(lottieJsonContent)}
                    loop
                    autoplay
                    className="w-full max-w-2xl"
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    No Lottie animation loaded.
                  </p>
                )}
              </div>
            </div>
          </Dialog>

          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Promo Code"
            name="promoCode"
            value={formData.promoCode}
            onChange={handleInputChange}
            required
          />
          <DatePicker
            selected={formData.startDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, startDate: date }))
            }
            placeholder="Start Date"
          />

          <DatePicker
            selected={formData.untilDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, untilDate: date }))
            }
            placeholder="Valid Until"
          />
          <Input
            label="Max Quantity Per Day"
            name="maxQtyDay"
            type="number"
            value={formData.maxQtyDay}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Users Max Quantity Per Day"
            name="usersMaxQtyDay"
            type="number"
            value={formData.usersMaxQtyDay}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Limit Usage"
            name="limitUsage"
            type="number"
            value={formData.limitUsage}
            onChange={handleInputChange}
            required
          />
          <Textarea
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <Textarea
            label="Busy Description"
            name="busyDescription"
            type="text"
            value={formData.busyDescription}
            onChange={handleInputChange}
            required
          />
        </>
      ),
    },
    {
      value: "Assign Free Items",
      label: "Assign Free Items",
      content: (
        <>
          <div className="w-full flex flex-col md:flex-row md:justify-end gap-2 p-2">
            <div className="w-full md:w-1/3">
              <Select
                label="Select Central"
                onChange={handleSelect}
                value={selectedStore}
              >
                {stores.map((store) => (
                  <Option key={store.id} value={store.id}>
                    {store.store_name} {store.store_branch}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <Input
                label="Search Item"
                icon={
                  centralItemTablePagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                size="md"
                className="bg-white"
                value={centralItemSearchTerm}
                onChange={(e) => handleCentralItemSearchInput(e)}
              />
            </div>
          </div>

          <div className="max-h-[65vh] overflow-auto w-full">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="bg-tableHeaderBg flex rounded-tl-md rounded-bl-md p-4">
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        All
                      </Typography>
                      <Checkbox
                        id="selectAll"
                        onChange={toggleSelectAllCentralItems}
                        checked={allCentralItemsId.every((id) =>
                          selectedCentralItems.includes(id)
                        )}
                      />
                    </th>
                    <th className="bg-tableHeaderBg p-4">
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        Name
                      </Typography>
                    </th>
                    <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        Description
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {centralItems.map((data) => (
                    <tr
                      key={data.food_id}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td width={10} className="px-4 py-2">
                        <Checkbox
                          id={`store-${data.food_id}`}
                          onChange={(e) =>
                            handleCheckboxChange(e, data.food_id)
                          }
                          checked={selectedCentralItems.includes(data.food_id)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.name}
                        </Typography>
                      </td>
                      <td className="px-4 py-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.description}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={centralItemTablePagination.page}
            totalItems={centralItemTablePagination.totalItems}
            itemsPerPage={centralItemTablePagination.itemsPerPage}
            totalPages={centralItemTablePagination.totalPages}
            onPageChange={(newPage) => handleCentralItemPageChange(newPage)}
            onPageSizeChange={handleCentralItemPageSizeChange}
          />
        </>
      ),
    },
  ];
  return (
    <>
      <Base open={editOpen} handleOpen={editHandleOpen} size="lg">
        <Tabs
          value={activeTab}
          className="flex  rounded-lg"
          orientation="horizontal"
        >
          <div className="flex w-full flex-col sm:flex-row">
            <Sidebar
              className="py-5"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              sidebarTitle=""
            />
            <div className="w-full">
              <Header title={activeTab} onClose={editHandleOpen} />
              <Body
                className="flex"
                tabs={tabs}
                activeTab={activeTab}
                loading={loading}
              />
              <Footer
                loading={loading}
                showSubmit={true}
                onCancel={editHandleOpen}
                saving={saving}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </Tabs>
      </Base>
    </>
  );
};

export default EditPromoItems;
