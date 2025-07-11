import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Typography,
  Input,
  Button,
  Chip,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";
import Loading from "../../../components/layout/Loading";
import { EyeIcon } from "lucide-react";

const TABLE_HEAD = [
  "Order Number",
  "Customer Name",
  "Email",
  "Phone",
  "Status",
  "Date",
  "Order Status",
];

export default function ClaimedFreeItems() {
  const { promotionId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [tab, setTab] = useState("all");
  const [tabCounts, setTabCounts] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [lastPage, setLastPage] = useState(1);
  const [promo, setPromo] = useState(null);
  const [freeItemData, setFreeItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [promoImage, setPromoImage] = useState(null);

  useEffect(() => {
    let delayDebounce;
    if (promotionId) {
      if (search) {
        delayDebounce = setTimeout(() => {
          fetchData(promotionId);
        }, 300);
      } else {
        fetchData(promotionId);
      }
    }
    return () => clearTimeout(delayDebounce);
  }, [search, tab, page, promotionId, startDate, endDate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateWithTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const fetchData = async (promotionId) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(
        `admin/promo-free-items/claimed-users/${promotionId}`,
        {
          params: {
            status: tab !== "all" ? tab : undefined,
            search: search || undefined,
            page,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          },
        }
      );

      console.log("resssponwse", response.data);

      setPromoImage(response.data.free_item.free_item_image);
      console.log(`${import.meta.env.VITE_APP_FRONT_IMAGE_PATH}/${promoImage}`);

      setData(response.data.customers || []);
      setPromo(response.data);
      setFreeItemData(response.data.free_item);
      setTabCounts(response.data.counts || {});
      setPagination(response.data.pagination);

      console.log("image", promoImage);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchData(promotionId);
  };

  const handleViewOrder = (orderId) => {
    window.open(`/orders/${orderId}?tab=order`, "_blank");
  };

  const dynamicTabs = [
    {
      label: "All",
      value: "all",
      color: "bg-purple-500",
      count: tabCounts.all,
    },
    {
      label: "Claimed",
      value: "claimed",
      color: "bg-green-500",
      count: tabCounts.claimed,
    },
    {
      label: "Unclaimed",
      value: "unclaimed",
      color: "bg-blue-gray-500",
      count: tabCounts.unclaimed,
    },
    {
      label: "Cancelled",
      value: "cancelled",
      color: "bg-red-500",
      count: tabCounts.cancelled,
    },
  ];

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <div>
              <img
                src={`${
                  import.meta.env.VITE_APP_FRONT_IMAGE_PATH
                }/${promoImage}`}
                alt="Promo Image"
                className="h-32 w-40 object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = "/rockygo_logo.png";
                  e.target.onerror = null;
                }}
              />
            </div>
            <Typography variant="h5" color="blue-gray">
              {freeItemData?.promo_code || "Loading Promo Code..."}
            </Typography>
            <Typography color="gray" className="mt-1 font-sm">
              {freeItemData?.title || "Loading..."}
            </Typography>
            <Typography color="gray" className="mt-1 font-sm">
              Start Date: {formatDate(freeItemData?.start_date)} - End Date:{" "}
              {formatDate(freeItemData?.until_date)}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3 rounded-md"
              size="sm"
              onClick={() => navigate("/promotions/free-items")}
            >
              <EyeIcon strokeWidth={2} className="h-4 w-4" /> View Free Items
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
          {/* Tabs on the left */}
          <Tabs value={tab} className="w-full md:w-max py-4 pr-4">
            <TabsHeader>
              {dynamicTabs.map(({ label, value, count, color }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabChange(value)}
                  className="relative px-4 py-2"
                >
                  <span className="text-sm">{label}</span>
                  {typeof count === "number" && (
                    <span
                      className={`absolute -top-2 -right-2 z-20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}
                    >
                      {count}
                    </span>
                  )}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>

          {/* Search and date filters on the right */}
          <div className="w-full md:w-auto flex flex-wrap justify-end gap-3 items-center">
            <div className="w-56">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            {[
              { label: "Start", date: startDate, setDate: setStartDate },
              { label: "End", date: endDate, setDate: setEndDate },
            ].map((field, idx) => (
              <Popover placement="bottom" key={idx}>
                <PopoverHandler>
                  <div className="w-56 mx-auto">
                    <Input
                      label={`${field.label} Date`}
                      value={
                        field.date ? format(new Date(field.date), "PPP") : ""
                      }
                      icon={<CalendarDaysIcon className="h-5 w-5" />}
                      onChange={() => null}
                    />
                  </div>
                </PopoverHandler>
                <PopoverContent>
                  <DayPicker
                    mode="single"
                    selected={field.date ? new Date(field.date) : undefined}
                    onSelect={(date) => {
                      if (date) field.setDate(format(date, "yyyy-MM-dd"));
                    }}
                    showOutsideDays
                    classNames={{
                      caption:
                        "flex justify-center py-2 mb-4 relative items-center",
                      nav_button: "h-6 w-6 p-1 rounded-md hover:bg-gray-200",
                      day_selected: "bg-gray-900 text-white",
                      day_today: "bg-gray-200",
                    }}
                    components={{
                      IconLeft: (props) => (
                        <ChevronLeftIcon
                          {...props}
                          className="h-4 w-4 stroke-2"
                        />
                      ),
                      IconRight: (props) => (
                        <ChevronRightIcon
                          {...props}
                          className="h-4 w-4 stroke-2"
                        />
                      ),
                    }}
                  />
                </PopoverContent>
              </Popover>
            ))}

            {/* Clear Button */}
            <Button
              size="md"
              onClick={() => {
                setSearch("");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll">
        {isLoading ? (
          <Loading />
        ) : (
          <table className="w-full min-w-max table-auto text-left rounded-md">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className={`bg-tableHeaderBg p-4 ${
                      index === 0 ? "rounded-tl-md" : ""
                    } ${
                      index === TABLE_HEAD.length - 1 ? "rounded-tr-md" : ""
                    }`}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      No data available.
                    </Typography>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const { user, created_at, status, order_id, order } = item;
                  const fullName = `${user?.first_name || "N/A"} ${
                    user?.last_name || ""
                  }`;

                  // Status mapping based on Laravel logic
                  let displayStatus = "Unclaimed";
                  if (status === 1 && order?.order_status === "completed") {
                    displayStatus = "Claimed";
                  } else if (status === 0 && order_id != 0) {
                    displayStatus = "Cancelled";
                  }

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue"
                          className="font-medium cursor-pointer hover:underline hover:text-blue-700 transition-colors duration-200"
                          onClick={() => handleViewOrder(order_id)}
                        >
                          {order?.order_number || "N/A"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {fullName}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user?.email || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user?.mobile_number || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={displayStatus}
                          className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md
                            ${
                              displayStatus === "Claimed"
                                ? "bg-green-500/20 text-green-900"
                                : displayStatus === "Cancelled"
                                ? "bg-red-500/20 text-red-900"
                                : "bg-blue-gray-200 text-blue-gray-900"
                            }`}
                        />
                      </td>

                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {formatDateWithTime(created_at)}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {order?.order_status || "N/A"}
                        </Typography>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {pagination.current_page} of {pagination.last_page}
        </Typography>

        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={pagination.current_page === 1}
          >
            Previous
          </Button>

          {/* Page number buttons */}
          {Array.from({ length: pagination.last_page }, (_, index) => (
            <Button
              key={index + 1}
              variant={
                pagination.current_page === index + 1 ? "filled" : "outlined"
              }
              size="sm"
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outlined"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, pagination.last_page))
            }
            disabled={pagination.current_page === pagination.last_page}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
