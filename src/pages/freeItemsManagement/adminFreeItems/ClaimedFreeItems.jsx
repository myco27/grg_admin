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

const TABLE_HEAD = ["ID", "Customer Name", "Status", "Date Claimed", "Action"];

export default function ClaimedFreeItems() {
  const { promotionId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [tab, setTab] = useState("all");
  const [tabCounts, setTabCounts] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [promo, setPromo] = useState(null);
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

      setPromoImage(response.data.free_item_image);
      setData(response.data.customers || []);
      setPromo(response.data);
      setLastPage(response.data.last_page || 1);
      setTabCounts(response.data.counts || {});
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
                className="h-32 w-auto object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = "/rockygo_logo.png";
                  e.target.onerror = null;
                }}
              />
            </div>
            <Typography variant="h5" color="blue-gray">
              {promo?.promo_code || "Loading Promo Code..."}
            </Typography>
            <Typography color="gray" className="mt-1 font-sm">
              {promo?.title || "Loading..."}
            </Typography>
            <Typography color="gray" className="mt-1 font-sm">
              Start Date: {formatDate(promo?.start_date)} - End Date:{" "}
              {formatDate(promo?.until_date)}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => navigate("/promotions/free-items")}
            >
              View Free Items
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
              variant="outlined"
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
                  const {
                    user,
                    created_at,
                    status,
                    order_id,
                    free_item_v2_customer_id,
                  } = item;
                  const fullName = `${user?.first_name || "N/A"} ${
                    user?.last_name || ""
                  }`;
                  const displayStatus = status === 1 ? "claimed" : "unclaimed";
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {free_item_v2_customer_id}
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
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={displayStatus}
                          className="capitalize text-left font-normal"
                          color={
                            displayStatus === "claimed" ? "green" : "blue-gray"
                          }
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
                        <Button
                          onClick={() => handleViewOrder(order_id)}
                          variant="outlined"
                          size="sm"
                        >
                          View Order
                        </Button>
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
          Page {page} of {lastPage}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            disabled={page === lastPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
