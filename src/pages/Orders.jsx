import React, { Fragment, useEffect, useState } from "react";
import OrderDetails from "../components/OrdersPage/OrderCard";
import Pagination from "../components/OrdersPage/Pagination";
import DatePicker from "../components/OrdersPage/DatePicker";
import { useSearchParams } from "react-router-dom";
import {
  Typography,
  Input,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import ordersData from "../data/orders.json";
import Header from "../components/Header";
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

      <Header />

        <div className="flex flex-col min-h-screen bg-gray-100">
            <main className="flex-1 px-3 md:px-8 py-4">

                {/* Header and Controls */}
                <div className="flex flex-col gap-4 mb-6">
                    <Typography variant="h4" className="text-gray-900">
                    Transaction
                    </Typography>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <Tabs value={activeTab} className="w-full md:w-fit border border-gray-400 bg-white rounded-lg overflow-x-auto">
                            <TabsHeader 
                                className="bg-transparent"
                                indicatorProps={{
                                    className: "bg-purple-200 shadow-none",
                                }}>

                            {tabs.map(({ label, value }) => (
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
                            ))}
                            </TabsHeader>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentOrders.map((order) => (
                <div key={order.id} className="w-full">
                    <OrderDetails order={order} />
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