import React, { Fragment, useEffect, useState } from "react";
import OrderCard from "../components/OrdersPage/OrderCard";
import Pagination from "../components/OrdersPage/Pagination";
import DatePicker from "../components/OrdersPage/DatePicker";
import { useSearchParams } from "react-router-dom";
import {
  Typography,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  Badge,
} from "@material-tailwind/react";
import ordersData from "../data/orders.json";
import Footer from "../components/Footer";
import { Search } from "lucide-react";

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "all");
    const ordersPerPage = 6;
    const [selectedDate, setSelectedDate] = useState(() => {
        const dateParam = searchParams.get('date');
        return dateParam ? new Date(dateParam) : null;
    })

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set ('search', searchQuery);
        if (currentPage > 1) params.set ('page', currentPage.toString());
        if (activeTab !== "all") params.set ('tab', activeTab);
        if (selectedDate) params.set ('date', selectedDate.toISOString());
        setSearchParams(params);
    },[searchQuery, currentPage, activeTab, selectedDate, setSearchParams]);

    // Filter orders based on search query, status tab, and date
    const filterOrders = () => {
        return ordersData.orders.filter((order) => {
        const matchesSearch = order.products.some (product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        ) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery);
        
        const matchesStatus = activeTab === "all" || order.status.toLowerCase() === activeTab;
        
        const matchesDate = !selectedDate || new Date(order.orderDate).toDateString() === selectedDate.toDateString();

        return matchesSearch && matchesStatus && matchesDate;
        });
    };

    const filteredOrders = filterOrders();

    const tabCount = (status) => {
        return ordersData.orders.filter(order => status === "all" ? true : order.status.toLowerCase() === status).length;
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


    const tabs = [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
    ];

  return (
    <Fragment>

        <div className="flex flex-col min-h-screen bg-gray-100">
            <main className="flex-1 px-3 md:px-8 py-4">

                {/* Header and Controls */}
                <div className="flex flex-col gap-4 mb-6">
                    <Typography variant="h4" className="text-gray-900">
                    Transaction
                    </Typography>

                    <div className=" relative flex flex-col md:flex-row items-center justify-between gap-4">
                            <Tabs value={activeTab} className="w-full md:w-fit border px-1 border-gray-400 py-0.5 bg-white rounded-lg relative overflow-x-auto xl:overflow-visible">
                                <div>
                                    <TabsHeader 
                                        className="bg-transparent gap-x-4"
                                        indicatorProps={{
                                            className: "bg-purple-200 shadow-none",
                                        }}>

                                        {tabs.map(({ label, value }) => (

                                            <Badge key={value} content={tabCount(value)} 
                                             className={`absolute top-1 z-50 text-[8px] min-w-[14px] min-h-[14px] px-[6px] py-[2px] 
                                                ${value === "cancelled" ? "bg-red-100 text-red-600" :
                                                value === "pending" ? "bg-yellow-200 text-yellow-900" :
                                                value === "delivered" ? "bg-green-100 text-green-600" :
                                                value === "processing" ? "bg-blue-100 text-blue-600" :
                                                value === "completed" ? "bg-purple-100 text-purple-600" :
                                                value === "all" ? "" :
                                                "bg-gray-100 text-gray-900"}`}
                                            >
                                                <Tab 
                                                    key={value}
                                                    value={value}
                                                    onClick={() => {
                                                        setActiveTab(value);
                                                        setCurrentPage(1);
                                                    }}
                                                    className="text-sm font-medium text-gray-800"
                                                    >
                                                    {label}                                                                                            
                                                </Tab>

                                            </Badge>

                                        ))}
                                    </TabsHeader>
                                </div>
                            </Tabs>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                            <div className="w-full sm:w-72">
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
                            </div>

                            <DatePicker
                                selected={selectedDate}
                                onChange={date => {
                                    setSelectedDate(date)
                                    setCurrentPage(1);
                                }}
                                placeholder="Filter by date"
                                isClearable
                            />

                        </div>

                    </div>
                </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentOrders.map((order) => (
                    <div key={order.id} className="w-full">
                        <OrderCard order={order} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                itemsPerPage={ordersPerPage}
                onPageChange={setCurrentPage}
            />
            
            </main>
        </div>

      <Footer />

    </Fragment>
  );
}