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
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const [ordersLoading, setOrdersloading] = useState(true);

  // State for orders and their counts
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [countOrders, setCountOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  // Pagination parameters
  const [lastOrderPage, setLastOrderPage] = useState(null);
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
  const [isLastOrderPageLoading, setIsLastOrderPageLoading] = useState(true);

  // Helper function to get cache from localStorage
  const getCache = (key) => {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  // Helper function to set cache in localStorage
  const setCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Helper function to generate cache key
  const generateCacheKey = (status, page, search, date) => {
    return `orders-${status}-${page}-${search}-${date}`;
  };

  // Helper function to clean up expired cache entries
  const cleanUpExpiredCache = () => {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("orders-")) {
        const cachedData = getCache(key);
        if (cachedData && cachedData.expiry && cachedData.expiry < now) {
          localStorage.removeItem(key);
        }
      }
      if (key.startsWith("rider-orders")) {
        const cachedData = getCache(key);
        if (cachedData && cachedData.expiry && cachedData.expiry < now) {
          localStorage.removeItem(key);
        }
      }
      if (key.startsWith("countOrders")) {
        const cachedData = getCache(key);
        if (cachedData && cachedData.expiry && cachedData.expiry < now) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  // Call the cleanup function when the component mounts
  useEffect(() => {
    cleanUpExpiredCache();
  }, []);

  // Fetch count of orders by status
  const fetchCountOrders = async () => {
    // Create cache key
    const cacheKey = "countOrders";
  
    // Check cache based on cache key
    const cachedData = getCache(cacheKey);
    if (cachedData && Date.now() < cachedData.expiry) {
      setCountOrders(cachedData.data);
      return;
    }
  
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
  
        // Cache the data with an expiry time (e.g., 5 minutes)
        setCache(cacheKey, {
          data: ordersArray,
          expiry: Date.now() + 300000, // 5 minutes
        });
      }
    } catch (error) {
      navigate("/notfound");
    }
  };

  // Fetch orders with filters and pagination
  const fetchOrders = useCallback(async () => {
    // Create cache key
    const cacheKey = generateCacheKey(status, pagination.page, debounceSearch, filters.date);

    // Check cache based on cache key
    const cachedData = getCache(cacheKey);
    if (cachedData && Date.now() < cachedData.expiry) {
      setOrders(cachedData.data);
      setPagination(cachedData.pagination);
      setSearchLoading(false);
      setOrdersloading(false);
      return;
    }

    try {
      setSearchLoading(true);
      setIsLastOrderPageLoading(true); // Set loading state for lastOrderPage
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

        const newPagination = {
          page: current_page,
          totalPages: last_page,
          totalItems: total,
          links: links,
          itemsPerPage: per_page,
          isLoading: false,
        };
        setOrders(data);
        setPagination(newPagination);
        setSearchLoading(false);
        setLastOrderPage(last_page);
        setIsLastOrderPageLoading(false);
        setOrdersloading(false);

        // Cache the data with an expiry time (e.g., 5 minutes)
        setCache(cacheKey, {
          data,
          pagination: newPagination,
          expiry: Date.now() + 300000, // 5 minutes
        });
      }
    } catch (error) {
      navigate("/notfound");
      setPagination({ ...pagination, isLoading: false });
      setIsLastOrderPageLoading(false);
      setOrdersloading(false);
    }
  }, [status, debounceSearch, filters.date, pagination, navigate]);

  // Fetch count of orders on component mount
  useEffect(() => {
    fetchCountOrders();
  }, []);

  // Fetch orders when status, page, search, or date changes
  useEffect(() => {
    fetchOrders(pagination.page);
  }, [status, pagination.page, debounceSearch, filters.date]);

  // Set URL search params whenever state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentStatus = params.get("status") || "all";
    const currentPage = parseInt(params.get("page")) || 1;
    const currentSearch = params.get("search") || "";
    const currentDate = params.get("date") || null;

    setStatus(currentStatus);
    setFilters({
      search: currentSearch,
      date: currentDate,
    });
    setPagination(prev => ({
      ...prev,
      page: currentPage,
    }));
  }, [searchParams]);

  // Validate invalid URL parameters and pagination values
  useEffect(() => {
    const validParams = ["page", "status", "search", "date"];
    const hasInvalidParams = Array.from(searchParams.keys()).some(
      (key) => !validParams.includes(key)
    );

    // Only navigate to /notfound if there are truly invalid parameters
    if (hasInvalidParams) {
      navigate("/notfound");
      return; // Exit early to avoid further processing
    }

    if (isLastOrderPageLoading) return;

    const currentPage = searchParams.get("page");
    if (currentPage) {
      // Check if the page parameter contains only digits
      if (!/^\d+$/.test(currentPage)) {
        navigate("/notfound");
        return; // Exit early if the page parameter contains non-digit characters
      }

      const page = parseInt(currentPage);
      // Check if the page exceeds the total number of pages
      if (lastOrderPage > 0 && page > lastOrderPage) {
        navigate("/notfound");
        return;
      }
    }

  }, [searchParams, navigate, lastOrderPage, isLastOrderPageLoading]);

  // Validate and handle "status" parameter
  useEffect(() => {
    const validStatus = ["all", "pending", "processing", "intransit", "cancelled", "completed"];
    const currentStatus = searchParams.get("status");

    if (currentStatus && !validStatus.includes(currentStatus)) {
      navigate("/notfound");
    }
  }, [searchParams, navigate]);

  // Handle status tab click
  const handleClickStatus = (status) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    params.set("page", "1");
    setSearchParams(params, { replace: false });

    setStatus(status);
    setPagination({ ...pagination, page: 1 });
  };

  // Handle pagination page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params, { replace: false });

    setPagination({
      ...pagination,
      page: newPage,
      isLoading: true,
    });
  };

  // Handle search input change
  const handleSearchInput = (event) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    setSearchParams(params, { replace: false });

    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle date filter change
  const handleDateChange = (date) => {
    const params = new URLSearchParams(searchParams);

    if (date) {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const formattedDate = localDate.toISOString().split("T")[0];
      params.set("date", formattedDate);
    } else {
      params.delete("date");
    }

    params.set("page", "1");
    setSearchParams(params, { replace: false });

    setFilters({
      ...filters,
      date: date ? date.toISOString().split("T")[0] : ""
    });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-3 md:p-6">
          {/* Header and Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <Typography variant="h4" className="text-gray-900 -mb-2">
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
          {pagination.isLoading || ordersLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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