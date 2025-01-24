import { React, useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Tooltip,
  Button,
  Chip
} from '@material-tailwind/react';

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useSearchParams, useNavigate } from 'react-router-dom';

export default function TabsCard({ order }) {
  if (!order) return null;

  const [showAllProducts, setShowAllProducts] = useState(false);
  const displayedProducts = showAllProducts ? order.list : [order.list[0]]; 
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "order");
  const navigate = useNavigate();

  const hasMapData = order.setup.latitude && order.setup.longitude;
  const mapUrl = `https://maps.google.com/maps?q=${order.setup.latitude},${order.setup.longitude}&z=15&output=embed`;

  const tabs =[
    {label: "Order", value: "order"},
    {label: "Rider", value: "rider"},
    {label: "Customer", value: "customer"},
    {label: "Delivery", value: "delivery"},
  ];

  const validTabs = tabs.map((tab) => tab.value);

  // Navigate to /notfound if the tab is invalid
  useEffect(() => {
    if (!validTabs.includes(activeTab)) {
      navigate('/notfound');
    }
  }, [activeTab, navigate, validTabs]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeTab);
    setSearchParams(newParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  // Sync activeTab with URL params when they change (e.g., back/forward navigation)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className='pb-4'>
      <Card>
        <Tabs value={activeTab}>

          <TabsHeader
            className="rounded-none border-b border-gray-200 bg-transparent p-0 overflow-x-auto"
            indicatorProps={{
              className: "bg-transparent border-b-2 border-purple-500 shadow-none rounded-none",
            }}
          >
            {tabs.map(({ label, value }) => (
              <Tab
              key = {value}
              value= {value}
              onClick={() => setActiveTab(value)}
              className='text-gray-900'
              >
                {label}
              </Tab>
            ))}

          </TabsHeader>

          <TabsBody>
            <TabPanel value="order">
              <div className="px-4 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center">

                    <div className="flex items-center gap-2">
                      <Typography className="text-gray-900 font-semibold text-md">
                        {order.order_number}
                      </Typography>
                      <Typography className="text-gray-600 font-medium">
                        {order.type?.[0].toUpperCase() + order.type.slice(1)}
                      </Typography>
                    </div>
                  </div>
                  <Chip
                    value={order.order_status}
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.order_status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.order_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.order_status === "delivered"
                        ? "bg-green-100 text-green-600"
                        : order.order_status === "processing"
                        ? "bg-blue-100 text-blue-600"
                        : order.order_status === "completed"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </div>
      
                {/* Product Section */}
                <div className="flex-1 flex flex-col gap-4 py-4">
                  <Typography className="text-black text-sm">Store Name:</Typography>
                  {displayedProducts.map((product, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-lg bg-gray-100 p-2 flex-shrink-0">
                        <img
                          src={product.image || "/rockygo_logo.png"}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.src = "/rockygo_logo.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                              <Typography className="text-gray-900 text-sm font-bold truncate">
                                {product.food_name}
                              </Typography>
                              <div className="flex gap-x-1">
                                <Tooltip content="Quantity">
                                  <Typography className="text-xs text-gray-600 font-medium">
                                    {product.quantity}
                                  </Typography>
                                </Tooltip>
                                <Typography className="text-xs text-gray-600 font-medium">X</Typography>
                                <Tooltip content="Price">
                                  <Typography className="text-xs text-gray-600 font-medium">
                                    {product.amount}
                                  </Typography>
                                </Tooltip>
                              </div>
                          </div>
        
                          <div>
                            <Typography
                              variant="h6"
                              className="text-gray-900 text-sm text-right"
                            >
                              RM&nbsp;
                              {(product.quantity * parseFloat(product.amount)).toFixed(
                                2
                              )}
                            </Typography>
                            <Typography
                              variant="paragraph"
                              className="text-right text-xs font-medium"
                            >
                              {order.funding}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
        
                  {order.list.length > 1 && (
                    <div className="w-full flex justify-center mt-[-1rem] border-b border-gray-200">
                      <Button
                        variant="text"
                        className="show-more-btn text-xs flex flex-row gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllProducts(!showAllProducts);
                        }}
                      >
                        {showAllProducts ? (
                          <>
                            Show Less <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show More <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>

            <TabPanel value="rider">
              <div className="px-4 py-2 flex flex-col items-center md:items-start gap-8">

                <div className='w-full'>

                  <div className="pb-4 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-300">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img
                          src={'/rockygo_logo.png'}
                          className="h-full w-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = '/rockygo_logo.png';
                            e.target.onerror = null;
                          }}
                        />
                    </div>

                    <div className="flex-1 space-y-6 w-full">
                      <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="w-full md:w-auto">
                            <Typography color="gray" className="font-medium text-sm">
                              Delivery Rider
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              {order.user_details.first_name} {order.user_details.last_name}
                            </Typography>
                          </div>
                          <div className="w-full md:w-auto md:text-right">
                            <Typography color="gray" className="font-medium text-sm">
                              Plate # 
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              {order.rider_license_number || "N/A"}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full pt-4 border-t border-gray-200">
                        <div>
                          <Typography color="gray" className="font-medium text-sm">
                            Email
                          </Typography>
                          <div className="flex items-center gap-2">
                            <Typography color="black" className="font-semibold text-sm">
                            {order.user_details.email}
                            </Typography>
                          </div>
                        </div>
                        <div className="w-auto text-right">
                          <Typography color="gray" className="font-medium text-sm">
                            Cellphone #
                          </Typography>
                          <div className="flex justify-end">
                            <Typography color="black" className="font-semibold text-sm">
                              {order.rider_mobile_number}
                            </Typography>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </TabPanel>

            <TabPanel value="customer">
              <div className="px-4 py-2">
                <div className='w-full'>
                  <div className="pb-4 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-300">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img
                          src={'/rockygo_logo.png'}
                          className="h-full w-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = '/rockygo_logo.png';
                            e.target.onerror = null;
                          }}
                        />
                    </div>

                    <div className="flex-1 space-y-6 w-full">
                      <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="w-full md:w-auto">
                            <Typography color="gray" className="font-medium text-sm">
                              Customer Name:
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              N/A
                            </Typography>
                          </div>
                          <div className="w-full md:w-auto md:text-right">
                            <Typography color="gray" className="font-medium text-sm">
                              Home Address:
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              {/* {order.customerData[0].address} */} N/A
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full pt-4 border-t border-gray-200">
                        <div>
                          <Typography color="gray" className="font-medium text-sm">
                            Email:
                          </Typography>
                          <div className="flex items-center gap-2">
                            <Typography color="black" className="font-semibold text-sm">
                              {/* {order.customerData[0].email} */} N/A
                            </Typography>
                          </div>
                        </div>
                        <div className="w-auto text-right">
                          <Typography color="gray" className="font-medium text-sm">
                            Cellphone #
                          </Typography>
                          <div className="flex justify-end">
                            <Typography color="black" className="font-semibold text-sm">
                              {/* {order.customerData[0].phoneNumber} */} N/A
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="delivery">
              <div className="px-0 md:px-4 flex flex-col items-center md:items-start gap-4">
                <div className="space-y-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-auto">
                      <Typography color="gray" className="font-medium text-sm">
                        Latitude:
                      </Typography>
                      <Typography color="black" className="font-semibold text-sm">
                        {order.setup.latitude}
                      </Typography>
                    </div>
                    <div className="w-full md:w-auto md:text-right">
                      <Typography color="gray" className="font-medium text-sm">
                        Longitude:
                      </Typography>
                      <Typography color="black" className="font-semibold text-sm">
                        {order.setup.longitude}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="w-full mb-2 overflow-hidden rounded-lg border border-gray-200">
                  {hasMapData ? (
                    // Render the map if latitude and longitude are available
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="map"
                    />
                  ) : (
                    // Render "No Map Data" message if latitude or longitude is missing
                    <div className="h-[450px] p-4 flex items-center justify-center text-gray-400">
                      <h3 className="font-semibold text-2xl">No Map Data</h3>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>

          </TabsBody>
        </Tabs>
      </Card>
    </div>
  );
}