import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Tabs,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useAlert } from "../../../contexts/alertContext";
import axios from "axios";
import axiosClient from "../../../axiosClient";
import DatePicker from "../../../components/OrdersPage/DatePicker";
import { useEffect, useState } from "react";
import Pagination from "../../../components/OrdersPage/Pagination";
import UseDebounce from "../../../components/UseDebounce";
import { Search } from "lucide-react";
import { Body, Base, Footer, Header, Sidebar } from "../../../components/Modal";

const AddPromoItems = ({
  openAddModal,
  handleOpenAddModal,
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  const [selectedStore, setSelectedStore] = useState([]);
  const [open, setOpen] = useState(false);
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
    if (openAddModal) {
      fetchAllCentralItems();
      fetchAllCentral();
      setFormData({
        promoCode: "",
        title: "",
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
      setStores([]);
      setSelectedStore([]);
      setSelectedCentralItems([]);
      setCentralItemSearchTerm("");
    }
  }, [openAddModal]);

  useEffect(() => {
    if (openAddModal) {
      fetchAllCentralItems();
    }
  }, [
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
      const response = await axiosClient.get(`/admin/get/central-items`, {
        params: {
          search: debounceCentralItemSearch,
          page: centralItemTablePagination.page,
          page_size: centralItemTablePagination.itemsPerPage,
        },
      });

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

      selectedStore.forEach((data) => {
        formDataInstance.append("centralIds[]", data);
      });
      selectedCentralItems.forEach((item) => {
        formDataInstance.append("selectedCentralItems[]", item.food_id);
      });

      if (formData.image) {
        formDataInstance.append("image", formData.image);
      }

      if (formData.lottie) {
        formDataInstance.append("lottie", formData.lottie);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_ROCKYGO_URL}/promo-free-items/add`,
        formDataInstance,
        {
          withCredentials: true,
        }
      );

      fetchFreeItemData();
      handleOpenAddModal();
      showAlert("Free Item created successfully!", "success");
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

  //   EVENT LISTENERS
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------PROMO ITEMS EVENT LISTENER---------------------------------------
  const handleToggle = (id) => {
    setSelectedStore((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleRemoveSelectedItem = (foodId) => {
    setSelectedCentralItems((prev) =>
      prev.filter((item) => item.food_id !== foodId)
    );
  };

  const handleSelectAllStores = () => {
    const allSelected = stores.every((store) =>
      selectedStore.includes(store.id)
    );

    const newSelection = allSelected ? [] : stores.map((store) => store.id);

    setSelectedStore(newSelection);
  };

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

  // const toggleSelectAllCentralItems = () => {
  //   const allSelected = allCentralItemsId.every((id) =>
  //     selectedCentralItems.includes(id)
  //   );
  //   if (allSelected) {
  //     setSelectedCentralItems([]);
  //   } else {
  //     setSelectedCentralItems(allCentralItemsId);
  //   }

  //   console.log(selectedCentralItems);
  // };

  const handleCheckboxChange = (e, foodId) => {
    const selectedItem = centralItems.find((item) => item.food_id === foodId);
    if (!selectedItem) return;

    if (e.target.checked) {
      setSelectedCentralItems((prev) => {
        const alreadyExists = prev.some((item) => item.food_id === foodId);
        return alreadyExists ? prev : [...prev, selectedItem];
      });
    } else {
      setSelectedCentralItems((prev) =>
        prev.filter((item) => item.food_id !== foodId)
      );
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const { name } = event.target;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const tabs = [
    {
      value: "Promo Free Items",
      label: "Promo Free Items",
      content: (
        <>
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

          <div className="mt-4 flex flex-col gap-4">
            <label className="text-lg font-medium text-blue-gray-700 mb-2 block">
              Upload Images
            </label>

            <div className="relative">
              <label className="text-sm font-medium text-blue-gray-700 mb-2 block">
                Free Item Image
              </label>
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-x-2">
                <label
                  htmlFor="imageUpload"
                  className="inline-block cursor-pointer rounded bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Choose File
                </label>
                {formData.image && (
                  <p className="mt-2 text-sm text-green-600">
                    {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-blue-gray-700 mb-2 block">
                Lottie Image
              </label>
              <input
                type="file"
                id="lottieUpload"
                name="lottie"
                accept="application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-x-2">
                <label
                  htmlFor="lottieUpload"
                  className="inline-block cursor-pointer rounded bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Choose File
                </label>
                {formData.lottie && (
                  <p className="mt-2 text-sm text-green-600">
                    {formData.lottie.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      value: "Assign Free Items",
      label: "Assign Free Items",
      content: (
        <>
          <div className="w-full flex flex-col md:flex-row md:justify-between gap-2">
            <div className="w-full md:w-1/3">
              <Popover open={open} handler={setOpen}>
                <PopoverHandler>
                  <Button>Select Central</Button>
                </PopoverHandler>
                <PopoverContent className="max-h-[50%] overflow-y-auto z-[9999]">
                  <div
                    className="flex items-center gap-2 py-1 px-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={handleSelectAllStores}
                  >
                    <input
                      type="checkbox"
                      checked={
                        stores.length > 0 &&
                        stores.every((store) =>
                          selectedStore.includes(store.id)
                        )
                      }
                      readOnly
                    />
                    <span>Select All</span>
                  </div>

                  {/* Store list */}
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleToggle(store.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStore.includes(store.id)}
                        readOnly
                      />
                      <span>
                        {store.store_name} {store.store_branch}
                      </span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
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
            {/* Selected Store Container */}
            {selectedStore.length > 0 && (
              <>
                <Card className="m-2">
                  <CardBody>
                    <Typography className="" variant="h6">
                      Selected Stores:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.map((id) => {
                        const store = stores.find((s) => s.id === id);
                        return (
                          <Chip
                            key={id}
                            value={`${store.store_name} ${store.store_branch}`}
                            onClose={() => handleToggle(id)}
                            variant="outlined"
                            className=""
                          />
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {selectedCentralItems.length > 0 && (
              <>
                <Card className="m-2">
                  <CardBody>
                    <Typography variant="h6">Selected Items:</Typography>
                    <div className="flex flex-wrap gap-2">
                      {selectedCentralItems.map((item) => (
                        <Chip
                          key={item.food_id}
                          value={item.name}
                          onClose={() => handleRemoveSelectedItem(item.food_id)}
                          variant="outlined"
                        />
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr>
                    {/* <th className="bg-tableHeaderBg flex rounded-tl-md rounded-bl-md p-4"> */}
                    {/* <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        All
                      </Typography> */}
                    {/* <Checkbox
                        id="selectAll"
                        onChange={toggleSelectAllCentralItems}
                        checked={allCentralItemsId.every((id) =>
                          selectedCentralItems.includes(id)
                        )}
                      />
                    </th> */}
                    <th className="bg-tableHeaderBg flex rounded-tl-md rounded-bl-md p-4">
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        Select
                      </Typography>
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
                          checked={selectedCentralItems.some(
                            (item) => item.food_id === data.food_id
                          )}
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
      <Base
        open={openAddModal}
        handleOpen={handleOpenAddModal}
        size="xl"
        className={"h-[85dvh]"}
      >
        <Tabs
          value={activeTab}
          className="flex rounded-lg h-full"
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
            <div className="w-full flex flex-col">
              <Header
                className=""
                title={activeTab}
                onClose={handleOpenAddModal}
              />
              <Body
                className="flex flex-1 "
                tabs={tabs}
                activeTab={activeTab}
                loading={loading}
              />
              <Footer
                className=""
                loading={loading}
                showSubmit={true}
                onCancel={handleOpenAddModal}
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

export default AddPromoItems;
