import React, { Fragment, useState } from "react";
import OrderDetails from "../components/OrdersPage/OrderCard";
import Pagination from "../components/OrdersPage/Pagination";
import DatePicker from "../components/OrdersPage/DatePicker";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const ordersPerPage = 6;

  // Filter orders based on search query, status tab, and date
    const filterOrders = () => {
        return ordersData.orders.filter((order) => {
        const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        { label: "Shipped", value: "shipped" },
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
                                    className: "bg-blue-200 shadow-none",
                                }}>

                            {tabs.map(({ label, value }) => (
                                <Tab 
                                key={value}
                                value={value}
                                onClick={() => setActiveTab(value)}
                                className="text-sm font-medium text-gray-800"
                                >
                                {label}
                                </Tab>
                            ))}
                            </TabsHeader>
                        </Tabs>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            placeholder="Filter by date"
                            isClearable
                            />
                            <div className="w-full sm:w-72">
                            <Input
                                label="Search orders..."
                                icon={<Search className="h-5 w-5" />}
                                className="bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            </div>
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