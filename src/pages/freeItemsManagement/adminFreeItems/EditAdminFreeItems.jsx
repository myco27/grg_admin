import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
  Tabs,
  Typography,
} from "@material-tailwind/react";
import Loading from "../../../components/layout/Loading";
import { useAlert } from "../../../contexts/alertContext";
import axiosClient from "../../../axiosClient";
import DatePicker from "../../../components/OrdersPage/DatePicker";
import { useEffect, useState } from "react";
import UseDebounce from "../../../components/UseDebounce";
import { Search } from "lucide-react";
import Pagination from "../../../components/OrdersPage/Pagination";
import { Base, Body, Footer, Header, Sidebar } from "../../../components/Modal";

const EditAdminFreeItems = ({
  editOpen,
  editHandleOpen,
  selectedId,
  fetchFreeItemData,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    promoCode: "",
    validUntil: "",
    userLimitUsage: 1,
    maxQuantityPerDay: 1,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  const [selectedStores, setSelectedStores] = useState([]);
  const [allStoreIds, setAllStoreIds] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState("Admin Free Items");

  const [searchTerm, setSearchTerm] = useState("");
  const [globalItemSearchTerm, setGlobalItemSearchTerm] = useState("");
  const debounceSearch = UseDebounce({ value: searchTerm });
  const debounceGlobalItemSearch = UseDebounce({ value: globalItemSearchTerm });
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const [selectedGlobalItem, setSelectedGlobalItem] = useState([]);
  const [globalItems, setGlobalItems] = useState([]);
  const [allGlobalItemIds, setAllGlobalItemIds] = useState([]);
  const [GlobalItemTablePagination, setGlobalItemTablePagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  // API CALLS
  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/admin/get/free-items/details/${selectedId}`
      );

      const responseData = response.data;

      setFormData({
        title: responseData.title,
        promoCode: responseData.promo_code,
        validUntil: new Date(responseData.valid_until),
        userLimitUsage: responseData.user_limit_usage,
        maxQuantityPerDay: responseData.max_qty_per_day,
      });

      setSelectedStores(
        responseData.assigned_stores.map((store) => store.store_id)
      );
      setSelectedGlobalItem(
        responseData.assigned_global_items.map((item) => item.global_item_id)
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStores = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/get/stores", {
        params: {
          search: debounceSearch,
          page: tablePagination.page,
          page_size: tablePagination.itemsPerPage,
        },
      });
      const responseData = response.data.freeItems.data;

      const { data, current_page, last_page, total, links, per_page } =
        response.data.freeItems;
      setStores(responseData);
      setAllStoreIds(response.data.freeItemsIds);
      setTablePagination((prev) => ({
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

  const fetchAllFreeItems = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/get/global-items", {
        params: {
          search: debounceGlobalItemSearch,
          page: GlobalItemTablePagination.page,
          page_size: GlobalItemTablePagination.itemsPerPage,
        },
      });
      const responseData = response.data.modelPaginatedData.data;

      const { data, current_page, last_page, total, links, per_page } =
        response.data.modelPaginatedData;
      setGlobalItems(responseData);
      setAllGlobalItemIds(response.data.modelData);
      setGlobalItemTablePagination((prev) => ({
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

  useEffect(() => {
    setActiveTab("Admin Free Items");
    
    if (editOpen) {
      fetchItemDetails();
      fetchAllStores();
      fetchAllFreeItems();

      setSelectedStores([]);
      setAllStoreIds([]);
      setStores([]);
      setSearchTerm("");

      setSelectedGlobalItem([]);
      setGlobalItems([]);
      setAllGlobalItemIds([]);
      setGlobalItemSearchTerm("");
    }
  }, [editOpen]);

  useEffect(() => {
    fetchAllStores();
  }, [debounceSearch, tablePagination.page, tablePagination.itemsPerPage]);

  useEffect(() => {
    fetchAllFreeItems();
  }, [
    debounceGlobalItemSearch,
    GlobalItemTablePagination.page,
    GlobalItemTablePagination.itemsPerPage,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSaving(true);
    try {
      const response = await axiosClient.put(
        `/admin/admin-free-items/update/${selectedId}`,
        {
          title: formData.title,
          promoCode: formData.promoCode,
          maxQuantityPerDay: formData.maxQuantityPerDay,
          userLimitUsage: formData.userLimitUsage,
          validUntil: formData.validUntil,
          selectedStores: selectedStores,
          selectedGlobalItems: selectedGlobalItem,
        }
      );

      showAlert("Admin Free Item Updated Successfully", "success");
      fetchFreeItemData();
      editHandleOpen();
    } catch (error) {
      console.error("Update Error:", error);
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            messages.forEach((message) => {
              showAlert(`${message}`, "error");
            });
          }
        );
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  // EVENT LISTENERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------STORES EVENT LISTENER---------------------------------------
  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleCheckboxChange = (e, storeId) => {
    if (e.target.checked) {
      setSelectedStores((prev) => [...prev, storeId]);
    } else {
      setSelectedStores((prev) => prev.filter((id) => id !== storeId));
    }
  };

  const handleStorePageChange = (newPage) => {
    setTablePagination({
      ...tablePagination,
      page: newPage,
    });
  };

  const handleStorePageSizeChange = (value) => {
    setTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const toggleSelectAllStores = () => {
    const allSelected = allStoreIds.every((id) => selectedStores.includes(id));
    if (allSelected) {
      setSelectedStores([]);
    } else {
      setSelectedStores(allStoreIds);
    }
  };

  // -----------------------------GLOBAL ITEMS EVENT LISTENER---------------------------------------

  const handleGlobalItemSearchInput = (event) => {
    const { value } = event.target;
    setGlobalItemSearchTerm(value);
    setGlobalItemTablePagination({
      ...tablePagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleCheckboxChangeGlobalItem = (e, global_items_id) => {
    if (e.target.checked) {
      setSelectedGlobalItem((prev) => [...prev, global_items_id]);
    } else {
      setSelectedGlobalItem((prev) =>
        prev.filter((id) => id !== global_items_id)
      );
    }
  };

  const handleGlobalItemPageChange = (newPage) => {
    setGlobalItemTablePagination({
      ...GlobalItemTablePagination,
      page: newPage,
    });
  };

  const handleGlobalItemPageSizeChange = (value) => {
    setGlobalItemTablePagination({
      ...GlobalItemTablePagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const toggleSelectAllGlobalItems = () => {
    const allSelected = allGlobalItemIds.every((id) =>
      selectedGlobalItem.includes(id)
    );
    if (allSelected) {
      setSelectedGlobalItem([]);
    } else {
      setSelectedGlobalItem(allGlobalItemIds);
    }
  };

  const tabs = [
    {
      value: "Admin Free Items",
      label: "Admin Free Items",
      // icon: <UserRoundCog />,
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
          <Input
            label="Max Quantity Per Day"
            name="maxQuantityPerDay"
            type="number"
            value={formData.maxQuantityPerDay}
            onChange={handleInputChange}
            required
          />
          <Input
            label="User Limit Usage"
            name="userLimitUsage"
            type="number"
            value={formData.userLimitUsage}
            onChange={handleInputChange}
            required
          />

          <DatePicker
            selected={formData.validUntil}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, validUntil: date }))
            }
            placeholder="Valid Until"
          />
        </>
      ),
    },
    {
      value: "Assign Store",
      label: "Assign Store",
      // icon: <LockKeyhole />,
      content: (
        <>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <Input
                label="Search Item"
                icon={
                  tablePagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                size="md"
                className="bg-white"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e)}
              />
            </div>
          </div>
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="rounded-md w-full min-w-max table-auto text-left">
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
                      onChange={toggleSelectAllStores}
                      checked={allStoreIds.every((id) =>
                        selectedStores.includes(id)
                      )}
                    />
                  </th>
                  <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                    <Typography
                      variant="small"
                      color="black"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      Store Name
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-b border-gray-300 hover:bg-gray-100"
                  >
                    <td width={10} className="px-4 py-2">
                      <Checkbox
                        id={`store-${store.id}`}
                        onChange={(e) => handleCheckboxChange(e, store.id)}
                        checked={selectedStores.includes(store.id)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {" "}
                        {store.store_name} {store.store_branch}{" "}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={tablePagination.page}
            totalItems={tablePagination.totalItems}
            itemsPerPage={tablePagination.itemsPerPage}
            totalPages={tablePagination.totalPages}
            onPageChange={(newPage) => handleStorePageChange(newPage)}
            onPageSizeChange={handleStorePageSizeChange}
          />
        </>
      ),
    },
    {
      value: "Assign Global Items",
      label: "Assign Global Items",
      // icon: <LockKeyhole />,
      content: (
        <>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <Input
                label="Search Item"
                icon={
                  tablePagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                size="md"
                className="bg-white"
                value={globalItemSearchTerm}
                onChange={(e) => handleGlobalItemSearchInput(e)}
              />
            </div>
          </div>
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="rounded-md w-full min-w-max table-auto text-left">
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
                      onChange={toggleSelectAllGlobalItems}
                      checked={allGlobalItemIds.every((id) =>
                        selectedGlobalItem.includes(id)
                      )}
                    />
                  </th>
                  <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
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
                {globalItems.map((data) => (
                  <tr
                    key={data.global_items_id}
                    className="border-b border-gray-300 hover:bg-gray-100"
                  >
                    <td width={10} className="px-4 py-2">
                      <Checkbox
                        id={`data-${data.global_items_id}`}
                        onChange={(e) =>
                          handleCheckboxChangeGlobalItem(
                            e,
                            data.global_items_id
                          )
                        }
                        checked={selectedGlobalItem.includes(
                          data.global_items_id
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
          <Pagination
            currentPage={GlobalItemTablePagination.page}
            totalItems={GlobalItemTablePagination.totalItems}
            itemsPerPage={GlobalItemTablePagination.itemsPerPage}
            totalPages={GlobalItemTablePagination.totalPages}
            onPageChange={(newPage) => handleGlobalItemPageChange(newPage)}
            onPageSizeChange={handleGlobalItemPageSizeChange}
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
          className="flex w-full rounded-lg"
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

export default EditAdminFreeItems;
