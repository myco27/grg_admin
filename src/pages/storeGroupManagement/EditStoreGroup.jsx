import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Input,
  select,
  Tabs,
  Typography,
} from "@material-tailwind/react";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import Pagination from "../../components/OrdersPage/Pagination";
import UseDebounce from "../../components/UseDebounce";
import { Search } from "lucide-react";
import { Body, Base, Footer, Header, Sidebar } from "../../components/Modal";
const EditStoreGroup = ({
  editOpen,
  editHandleOpen,
  fetchData,
  selectedId,
}) => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    legend: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState("Store Group");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = UseDebounce({
    value: searchTerm,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  useEffect(() => {
    setActiveTab("Store Group");
    if (editOpen) {
      fetchDetails();
      fetchAllStore();
      setFormData({
        name: "",
        legend: "",
      });
      setStores([]);
      setSearchTerm("");
    }
  }, [editOpen]);

  useEffect(() => {
    if (editOpen) {
      fetchAllStore();
    }
  }, [debounceSearch, pagination.page, pagination.itemsPerPage]);

  // API CALLS

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `admin/get/store-groups/${selectedId}`,
        {
          withCredentials: true,
        }
      );

      const responseData = response.data.data;

      setFormData((prev) => ({
        ...prev,
        name: responseData.name,
        legend: responseData.legend,
      }));

      const formattedStores = responseData.stores.map((store) => ({
        id: store.id,
        name: `${store.store_name} ${store.store_branch}`,
      }));

      setSelectedStores(formattedStores);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStore = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/get/store/list`, {
        params: {
          search: debounceSearch,
          page: pagination.page,
          page_size: pagination.itemsPerPage,
        },
      });

      const responseData = response.data.modelData.data;

      const { current_page, last_page, total, links, per_page } =
        response.data.modelData;

      setStores(responseData);

      setPagination((prev) => ({
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
      formDataInstance.append("name", formData.name);
      formDataInstance.append("legend", formData.legend);

      selectedStores.forEach((item) => {
        formDataInstance.append("selectedStores[]", item.id);
      });

      const response = await axiosClient.post(
        `/admin/store-group/update/${selectedId}`,
        formDataInstance
      );

      fetchData();
      editHandleOpen();
      showAlert("Store Group updated successfully!", "success");
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

  const handleRemoveSelectedItem = (id) => {
    setSelectedStores((prev) => prev.filter((item) => item.id !== id));
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

  const handleCentralItemPageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handleCentralItemPageSizeChange = (value) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(value),
    });
  };

  const handleCheckboxChange = (e, id, name) => {
    setSelectedStores((prev) => {
      const exists = prev.some((item) => item.id === id);

      if (e.target.checked) {
        return exists ? prev : [...prev, { id, name }];
      } else {
        return prev.filter((item) => item.id !== id);
      }
    });
  };

  const tabs = [
    {
      value: "Store Group",
      label: "Store Group",
      content: (
        <>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full flex items-center gap-2 md:max-w-[100px]">
              <label
                htmlFor="legend"
                className="text-sm font-medium text-blue-gray-700 w-16"
              >
                Legend
              </label>
              <div className="relative w-full h-10">
                <input
                  type="color"
                  id="legend"
                  name="legend"
                  value={formData.legend}
                  onChange={handleInputChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div
                  className="w-full h-full rounded-full border border-gray-300"
                  style={{ backgroundColor: formData.legend }}
                ></div>
              </div>
            </div>

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <Input
                  label="Search"
                  icon={
                    pagination.isLoading ? (
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

            <div className="w-full relative">
              {selectedStores.length > 0 && (
                <Card className="sticky top-0 z-10 my-2">
                  <CardBody>
                    <Typography variant="h6">Selected Stores:</Typography>
                    <div className="flex flex-wrap gap-2">
                      {selectedStores.map((data) => {
                        return (
                          <Chip
                            key={data.id}
                            value={data.name}
                            onClose={() => handleRemoveSelectedItem(data.id)}
                            variant="outlined"
                          />
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              )}

              <div className="w-full">
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
                          selectedStores.includes(id)
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
                      <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-center font-normal leading-none opacity-70"
                        >
                          Store ID
                        </Typography>
                      </th>
                      <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          Store Information
                        </Typography>
                      </th>
                      <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          Group
                        </Typography>
                      </th>
                      <th className="bg-tableHeaderBg rounded-tr-md rounded-br-md p-4">
                        <Typography
                          variant="small"
                          color="black"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          Contact
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((data) => {
                      const storeName = `${data.store_name} ${data.store_branch}`;
                      const storeGroupId = data.store_group?.store_group_id;

                      return (
                        <tr
                          key={data.id}
                          className={`border-b border-gray-300 ${
                            data.store_group !== null &&
                            storeGroupId !== selectedId
                              ? "bg-gray-100 text-gray-400 pointer-events-none opacity-60"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <td width={10} className="px-4 py-2">
                            {(data.store_group === null ||
                              storeGroupId == selectedId) && (
                              <Checkbox
                                id={`store-${data.id}`}
                                onChange={(e) =>
                                  handleCheckboxChange(e, data.id, storeName)
                                }
                                checked={selectedStores.some(
                                  (item) => item.id === data.id
                                )}
                              />
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-center"
                            >
                              {data.id}
                            </Typography>
                          </td>
                          <td className="px-4 py-2">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {data.store_name} {data.store_branch}
                            </Typography>
                          </td>
                          <td className="px-4 py-2">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {data.store_group?.name}
                            </Typography>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <div className="flex gap-2 items-center">
                                  <Typography
                                    variant=""
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    Phone:
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {data.phone}
                                  </Typography>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <Typography
                                    variant=""
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    Mobile:
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {data.mobile}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={pagination.page}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => handleCentralItemPageChange(newPage)}
              onPageSizeChange={handleCentralItemPageSizeChange}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Base
        open={editOpen}
        handleOpen={editHandleOpen}
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
              <Header className="" title={activeTab} onClose={editHandleOpen} />
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

export default EditStoreGroup;
