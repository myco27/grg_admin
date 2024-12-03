import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@material-tailwind/react";
import { Search, QrCode, UserCircle, CalendarDays, MapPin, Info, DollarSign, CheckCircle2, Image, Home, Bell, Package } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { dashboardData } from "../data/dashboardData";

const mainInfoIcons = {
  customerName: {
    icon: UserCircle,
    color: "text-orange-400"
  },
  orderDate: {
    icon: CalendarDays,
    color: "text-purple-400"
  },
  destination: {
    icon: MapPin,
    color: "text-blue-400"
  }
};

const Dashboard = () => {
  const { orderDetails, recentPayment } = dashboardData;

  const renderMainInfoItem = (key, info) => {
    const IconConfig = mainInfoIcons[key];
    const Icon = IconConfig.icon;
    
    return (
      <div key={key} className="flex items-start gap-3">
        <Icon className={`w-12 h-12 ${IconConfig.color} mt-0.5`} />
        <div>
          <Typography color="gray" className="font-semibold">
            {info.label}
          </Typography>
          <Typography color="black" className="font-bold">
            {info.value}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

        {/* Main Content */}
        <main className="flex-1 max-w-[1600px] mx-auto p-8 overflow-x-hidden">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Sidebar />
              <Typography variant="h2" className="text-gray-900">
                Dashboard
              </Typography>
            </div>

            <div className="w-full max-w-xs">
              <Input
                type="text"
                placeholder="Search"
                className="text-lg !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 placeholder:text-gray-500 focus:!border-gray-900"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-[100px]" }}
                icon={<Search className="h-5 w-5 text-gray-500" />}
              />
            </div>
          </div>

          {/* Order Details Card */}
          <div className="w-full mx-auto">
            <Typography variant="h4" className="text-gray-900 mb-2">
              Order Details
            </Typography>
            <Card className="mb-8">
              <CardBody>
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xl">{orderDetails.rider.initials}</span>
                        </div>
                        <div className="mt-1">
                          <Typography variant="h5" color="blue-gray">
                            {orderDetails.rider.name}
                          </Typography>
                          <Typography color="gray" className="font-semibold">
                            {orderDetails.rider.role}
                          </Typography>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <Typography variant="h5" color="blue-gray">
                          #{orderDetails.rider.codeNumber}
                        </Typography>
                        <Typography variant="h6" color="gray" className="font-semibold">
                          Code Number
                        </Typography>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="h-px bg-gray-200 mb-8" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(orderDetails.mainInfo).map(([key, info]) => 
                          renderMainInfoItem(key, info)
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-auto flex justify-center">
                    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-gray-500" />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tabs Section */}
            <Typography variant="h4" className="text-gray-900 mb-1">
              Main Info
            </Typography>
            <Card>
              <Tabs value="detail-order">
                <TabsHeader
                  className="rounded-none border-b border-gray-200 bg-transparent p-0 overflow-x-auto"
                  indicatorProps={{
                    className: "bg-transparent border-b-2 border-blue-500 shadow-none rounded-none",
                  }}
                >
                  <Tab value="detail-order" className="text-gray-900">
                    Detail Order
                  </Tab>
                  <Tab value="rider-information" className="text-gray-900">
                    Rider Information
                  </Tab>
                  <Tab value="customer-information" className="text-gray-900">
                    Customer Information
                  </Tab>
                  <Tab value="documents" className="text-gray-900">
                    Documents
                  </Tab>

                </TabsHeader>
                <TabsBody>
                  <TabPanel value="detail-order">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-20 h-20 text-gray-500" />
                        </div>
                        <div className="flex-1 space-y-6 w-full">
                          <div className="space-y-1">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="w-full md:w-auto">
                                <Typography variant="h6" color="gray" className="font-bold">
                                  Order ID
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {orderDetails.product.orderId}
                                </Typography>
                              </div>
                              <div className="w-full md:w-auto md:text-right">
                                <Typography variant="h6" color="gray" className="font-bold">
                                  Shipment Address
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {orderDetails.product.shipmentAddress}
                                </Typography>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <Typography variant="h6" color="gray" className="font-bold">
                                Shipped
                              </Typography>
                              <div className="flex items-center gap-2">
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {orderDetails.product.shippedDate.date}
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                |  {orderDetails.product.shippedDate.time}
                                </Typography>
                              </div>
                            </div>
                            <div className="w-full sm:w-auto sm:text-right">
                              <Typography variant="h6" color="gray" className="font-bold">
                                Delivered
                              </Typography>
                              <div className="flex items-center gap-2">
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {orderDetails.product.deliveredDate.date}
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                | {orderDetails.product.deliveredDate.time}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="rider-information">
                    <Typography>Rider information content here</Typography>
                  </TabPanel>
                  <TabPanel value="customer-information">
                    <Typography>Customer information content here</Typography>
                  </TabPanel>
                  <TabPanel value="documents">
                    <Typography>Documents content here</Typography>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </Card>
          </div>

          {/* Recent Payment Section */}
          <div className="w-full mx-auto">
            <Typography variant="h4" className="text-gray-900 mb-2 mt-8">
              Recent Payment
            </Typography>
            <Card className="w-full mx-auto">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xl">{recentPayment.customer.initials}</span>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center gap-2 text-base">
                        <UserCircle className="w-5 h-5" />
                        Customer Name
                      </Typography>
                      <Typography color="blue-gray" className="font-medium text-lg">
                        {recentPayment.customer.name}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 w-full lg:w-auto">
                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center gap-2 text-base">
                        <Info className="w-5 h-5" />
                        Order ID
                      </Typography>
                      <Typography color="blue-gray" className="font-medium text-lg">
                        #{recentPayment.orderId}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center gap-2 text-base">
                        <DollarSign className="w-5 h-5" />
                        Price
                      </Typography>
                      <Typography color="blue-gray" className="font-medium text-lg">
                        ${recentPayment.amount}
                      </Typography>
                    </div>
                  </div>

                  <div className="bg-green-50 px-4 py-2 rounded-full flex items-center gap-2 ml-auto">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <Typography className="text-green-700 font-medium text-base">
                      {recentPayment.status}
                    </Typography>
                  </div>
                  
                </div>
              </CardBody>
            </Card>
          </div>

        </main>

        {/* <div className="w-[32rem]">
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <Package className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Order Placed
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography color="gray" className="font-normal text-gray-600">
                  Your order has been successfully placed and is being processed.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <Bell className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  In Transit
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography color="gray" className="font-normal text-gray-600">
                  Your package is currently in transit and on its way to the delivery address.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <Home className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Delivery
                </Typography>
              </TimelineHeader>
              <TimelineBody>
                <Typography color="gray" className="font-normal text-gray-600">
                  Your package will be delivered to the specified address.
                </Typography>
              </TimelineBody>
            </TimelineItem>
          </Timeline>
        </div> */}

    </div>
  );
};

export default Dashboard;