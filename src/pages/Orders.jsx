import React, { Fragment, useEffect, useState } from "react";
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
} from "@material-tailwind/react";
import ordersData from "../data/orders.json";
import { Search } from "lucide-react";
import axiosClient from "../axiosClient";

export default function Orders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [countOrders, setCountOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  // New variables for Pagination
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [links, setLinks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(0);  

  const [isLoading, setIsLoading] = useState(true);

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
      console.error(error);
    }
  };

  const fetchOrders = async ( page = 1) => {
    try {
      const response = await axiosClient.get("/admin/orders", {
        params: {
          status: status,
          page: page,
        },
      });
    
      // console.log(response);

      if (response.status === 200) {
        const {data, current_page, last_page, total, links, per_page} = response.data.data;
        setOrders(data);
        setPage(current_page);
        setTotalPages(last_page);
        setTotalItems(total);
        setLinks(links);
        setItemsPerPage(per_page);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountOrders();
    fetchOrders(page);
  }, [status, page]);

  // EVENT LISTENERS
  const handleClickStatus = (status) => {
    const updatedStatus = status === "all" ? "" : status;
    setStatus(updatedStatus);
    setPage(1);

    if (updatedStatus) {
      newSearchParams.set("status", updatedStatus);
    } else {
      newSearchParams.delete("status");
    }

    newSearchParams.set("page", 1); // Update links page=1 if tabs are changed
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    newSearchParams.set("page", newPage);
    navigate(`?${newSearchParams.toString()}`, {replace : true});
  };

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {isLoading ? (
          <Loading/>
        ) : (
          <main className="flex-1 px-3 md:px-8 py-4">
          {/* Header and Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <Typography variant="h4" className="text-gray-900">
              Transaction
            </Typography>

            <div className=" relative flex flex-col md:flex-row items-center justify-between gap-4">
              {/* ORDERS STATUS */}
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

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* SEARCH FILTER */}
                {/* <div className="w-full sm:w-72">
                  <Input
                    label="Search orders..."
                    icon={<Search className="h-5 w-5" />}
                    size="md"
                    className="bg-white"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div> */}

                {/* DATE FILTER */}
                {/* <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by date"
                  isClearable
                /> */}
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.order_id} className="w-full">
                  <OrderCard order={order} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            links={links}
          />
          </main>
        )};
       
      </div>
    </Fragment>
  );
}
