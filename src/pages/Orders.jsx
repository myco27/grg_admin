import React, { Fragment, useEffect, useState, useCallback } from "react";
import OrderCard from "../components/OrdersPage/OrderCard";
import Pagination from "../components/OrdersPage/Pagination";
import Loading from "../components/layout/Loading";
import DatePicker from "../components/OrdersPage/DatePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Typography,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  Badge,
  Spinner,
} from "@material-tailwind/react";
import { Search } from "lucide-react";
import axiosClient from "../axiosClient";
import useDebounce from "../components/UseDebounce";

export default function Orders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  // State for orders and their counts
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [countOrders, setCountOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  // Cache for API responses
  const [cache, setCache] = useState({});

  // Pagination parameters
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 0,
    isLoading: false,
  });

  // Filters for search and date
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    date: searchParams.get("date") || null,
  });

  // Debouncing search input
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceSearch = useDebounce({ value: filters.search });

  // Fetch count of orders by status
  const fetchCountOrders = async () => {
    try {
      const response = await axiosClient.get("/admin/count/orders");

      if (response.status === 200) {
        const responseData = response.data.data;

        const ordersArray = Object.entries(responseData).map(
          ([status, count]) => ({
            status,
            count,
          })
        );
        setCountOrders(ordersArray);
      }
    } catch (error) {
      navigate("/notfound");
    }
  };

  // Fetch orders with filters and pagination
  const fetchOrders = useCallback(async () => {
    // Create cache key
    const cacheKey = `${status}-${pagination.page}-${debounceSearch}-${filters.date}`;

    // Check cache
    if (cache[cacheKey]) {
      setOrders(cache[cacheKey].data);
      setPagination(cache[cacheKey].pagination);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axiosClient.get("/admin/orders", {
        params: {
          status: status === "all" ? "" : status,
          page: pagination.page,
          search: debounceSearch,
          date: filters.date,
        },
      });

      if (response.status === 200) {
        const { data, current_page, last_page, total, links, per_page } =
          response.data.data;

        // Define newPagination
        const newPagination = {
          page: current_page,
          totalPages: last_page,
          totalItems: total,
          links: links,
          itemsPerPage: per_page,
          isLoading: false,
        };

        // Update state
        setOrders(data);
        setPagination(newPagination);
        setSearchLoading(false);

        // Cache the data
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: { data, pagination: newPagination },
        }));
      }
    } catch (error) {
      navigate("/notfound");
      setPagination({ ...pagination, isLoading: false });
    }
  }, [status, debounceSearch, filters.date, cache, pagination, navigate]);

  // Fetch count of orders on component mount
  useEffect(() => {
    fetchCountOrders();
  }, []);

  // Fetch orders when status, page, search, or date changes
  useEffect(() => {
    fetchOrders(pagination.page);
  }, [status, pagination.page, debounceSearch, filters.date]);

  // Set default values for URL parameters then validate
  useEffect(() => {
    const defaultParams = {
      status: "all",
      page: "1",
      search: "",
      date: "",
    };
  
    const newSearchParams = new URLSearchParams(searchParams);
  
    // Check for unexpected parameters
    const validParams = ["status", "page", "search", "date"];
    const hasInvalidParams = Array.from(searchParams.keys()).some(
      (key) => !validParams.includes(key)
    );
  
    if (hasInvalidParams) {
      navigate("/notfound");
      return;
    }
  
    // Set default values for missing parameters
    if (!searchParams.get("status")) newSearchParams.set("status", defaultParams.status);
    if (!searchParams.get("page")) newSearchParams.set("page", defaultParams.page);
    if (!searchParams.get("search")) newSearchParams.set("search", defaultParams.search);
    if (!searchParams.get("date")) newSearchParams.set("date", defaultParams.date);
  
    // Navigate with updated parameters if any defaults were set
    if (
      !searchParams.get("status") ||
      !searchParams.get("page") ||
      !searchParams.get("search") ||
      !searchParams.get("date")
    ) {
      navigate(`?${newSearchParams.toString()}`, { replace: true });
      return; // Exit early to avoid validation until the next render
    }
  
    // Validate page number
    const page = parseInt(newSearchParams.get("page"));
    if (isNaN(page) || page < 1) {
      navigate("/notfound");
      return;
    }
  
    // Validate status parameter
    const validStatuses = ["all", "pending", "processing", "intransit", "cancelled", "completed"];
    const statusParam = newSearchParams.get("status");
    if (!validStatuses.includes(statusParam)) {
      navigate("/notfound");
      return;
    }
  
    // Validate date parameter (optional, if needed)
    const dateParam = newSearchParams.get("date");
    if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      navigate("/notfound");
      return;
    }
  }, [searchParams, navigate]);

  // Handle status tab click
  const handleClickStatus = (status) => {
    const updatedStatus = status === "all" ? "" : status;
    setStatus(updatedStatus);
    setPagination({ ...pagination, page: 1, isLoading: true });

    if (updatedStatus) {
      newSearchParams.set("status", updatedStatus);
    } else {
      newSearchParams.delete("status");
    }

    newSearchParams.set("page", 1); // Update links page=1 if tabs are changed
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle pagination page change
  const handlePageChange = async (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
      isLoading: true,
    });

    newSearchParams.set("page", newPage);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle search input change
  const handleSearchInput = (event) => {
    const { value } = event.target;

    setFilters({ ...filters, search: value });
    newSearchParams.set("search", value);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle date filter change
  const handleDateChange = (date) => {
    if (date === null || date === undefined) {
      setFilters({ ...filters, date: "" });
      newSearchParams.delete("date");
      navigate(`?${newSearchParams.toString()}`, { replace: true });
      return;
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];

    setFilters({ ...filters, date: formattedDate });
    newSearchParams.set("date", formattedDate);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 px-3 md:px-8 py-4">
          {/* Header and Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <Typography variant="h4" className="text-gray-900">
              Transaction
            </Typography>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
              {/* ORDERS STATUS TABS */}
              <Tabs
                value={status || "all"}
                className="w-full md:w-fit border px-1 border-gray-400 py-0.5 bg-white rounded-lg relative overflow-x-auto xl:overflow-visible"
              >
                <div>
                  <TabsHeader
                    className="bg-transparent gap-x-4"
                    indicatorProps={{
                      className: `bg-purple-200 shadow-none ${
                        status === "pending"
                          ? "bg-yellow-200 text-yellow-900"
                          : status === "processing"
                          ? "bg-blue-200 text-blue-900"
                          : status === "intransit"
                          ? "bg-gray-200 text-gray-900"
                          : status === "cancelled"
                          ? "bg-red-200 text-red-900"
                          : status === "completed"
                          ? "bg-purple-200 text-purple-900"
                          : status === "all"
                          ? ""
                          : "bg-gray-200 text-gray-900"
                      }`,
                    }}
                  >
                    {countOrders.map(({ status, count }) => (
                      <Badge
                        key={status}
                        content={count}
                        className={`absolute top-1 z-50 text-[8px] min-w-[14px] min-h-[14px] px-[6px] py-[2px] 
                          ${
                            status === "cancelled"
                              ? "bg-red-200 text-red-900"
                              : status === "pending"
                              ? "bg-yellow-200 text-yellow-900"
                              : status === "delivered"
                              ? "bg-green-200 text-green-900"
                              : status === "processing"
                              ? "bg-blue-200 text-blue-900"
                              : status === "completed"
                              ? "bg-purple-200 text-purple-900"
                              : status === "all"
                              ? ""
                              : "bg-gray-200 text-gray-900"
                          }`}
                      >
                        <Tab
                          key={status}
                          value={status}
                          onClick={() => handleClickStatus(status)}
                          className="text-sm font-medium text-gray-800"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Tab>
                      </Badge>
                    ))}
                  </TabsHeader>
                </div>
              </Tabs>

              {/* SEARCH AND DATE FILTERS */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* SEARCH FILTER */}
                <div className="w-full sm:w-72">
                  <Input
                    label="Search orders..."
                    icon={
                      searchLoading ? (
                        <Spinner className="h-5 w-5" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )
                    }
                    size="md"
                    className="bg-white"
                    value={filters.search}
                    onChange={(e) => handleSearchInput(e)}
                  />
                </div>

                {/* DATE FILTER */}
                <DatePicker
                  selected={filters.date}
                  onChange={(e) => handleDateChange(e)}
                  placeholder="Filter by date"
                  isClearable
                />
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          {pagination.isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.order_id} className="w-full">
                    <OrderCard order={order} />
                  </div>
                ))
              ) : (
                <div className="w-full md:col-span-2 lg:col-span-3">
                  <Typography className="text-center text-gray-500">
                    No orders found
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => handlePageChange(newPage)}
            isLoading={pagination.isLoading}
            links={pagination.links}
          />
        </main>
      </div>
    </Fragment>
  );
}