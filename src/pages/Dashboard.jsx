import {React, Fragment} from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Chip,
} from "@material-tailwind/react";
import { QrCode, UserCircle, CalendarDays, MapPin, Info, DollarSign, CreditCard} from "lucide-react";
import Header from "../components/Header";
import { orders } from "../data/orders.json";
import { useParams } from "react-router-dom";
import TimelineSection from "../components/TimelineSection";
import Footer from "../components/Footer";

const Dashboard = () => {
  const { orderId } = useParams();
  const order = orders.find(o => o.id === orderId) || orders[0];
  
  // Create rider initials from name
  const getRiderInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('') || 'RD';
  };

  return (
    <Fragment>
      
      <Header />

      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

        {/* Main Content */}
        <main className="flex-1 px-8 py-4 overflow-x-hidden w-full">

          {/* Main Content Area */}
          <div className="w-full overflow-y-auto pb-4">

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
                            <span className="text-blue-600 font-semibold text-xl">{getRiderInitials(order.riderName)}</span>
                          </div>
                          <div className="mt-1">
                            <Typography variant="h5" color="blue-gray">
                              {order.riderName}
                            </Typography>
                            <Typography color="gray" className="font-semibold">
                              Delivery Rider
                            </Typography>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <Typography variant="h5" color="blue-gray">
                            #{order.id}
                          </Typography>
                          <Typography variant="h6" color="gray" className="font-semibold">
                            Order Number
                          </Typography>
                        </div>

                      </div>

                      <div className="mt-8">
                        <div className="h-px bg-gray-200 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                          <div className="flex items-start gap-2">
                            <UserCircle className="w-12 h-12 text-blue-500 mt-0.5" />
                            <div>
                              <Typography color="gray" className="font-semibold">
                                Customer Name
                              </Typography>
                              <Typography color="black" className="font-bold">
                                {order.customerName}
                              </Typography>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <CalendarDays className="w-12 h-12 text-green-500 mt-0.5" />
                            <div>
                              <Typography color="gray" className="font-semibold">
                                Order Date
                              </Typography>
                              <Typography color="black" className="font-bold">
                                {order.orderDate}
                              </Typography>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-12 h-12 text-orange-500 mt-0.5" />
                            <div>
                              <Typography color="gray" className="font-semibold">
                                Shipping Type
                              </Typography>
                              <Typography color="black" className="font-bold">
                                {order.shippingType}
                              </Typography>
                            </div>
                          </div>

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
                    
                      <div className="p-4 flex flex-col md:flex-row items-center md:items-start gap-8">

                        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img
                            src={order.product.image}
                            alt={order.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                          <div className="space-y-1">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="w-full md:w-auto">
                                <Typography variant="h6" color="gray" className="font-medium">
                                  Product Name
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {order.product.name}
                                </Typography>
                              </div>
                              <div className="w-full md:w-auto md:text-right">
                                <Typography variant="h6" color="gray" className="font-medium">
                                  Payment Method
                                </Typography>
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {order.paymentMethod}
                                </Typography>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <Typography variant="h6" color="gray" className="font-medium">
                                Quantity
                              </Typography>
                              <div className="flex items-center gap-2">
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  {order.product.quantity} {order.otherProducts ? `(+${order.otherProducts} other items)` : ''}
                                </Typography>
                              </div>
                            </div>
                            <div className="w-full sm:w-auto sm:text-right">
                              <Typography variant="h6" color="gray" className="font-medium">
                                Total Price
                              </Typography>
                              <div className="flex justify-end">
                                <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                                  ${order.totalPrice.toFixed(2)}
                                </Typography>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    
                    </TabPanel>

                    <TabPanel value="rider-information">
                      <Typography>Rider: {order.riderName}</Typography>
                    </TabPanel>

                    <TabPanel value="customer-information">
                      <Typography>Customer: {order.customerName}</Typography>
                    </TabPanel>

                    <TabPanel value="documents">
                      <Typography>Order #{order.id} Documents</Typography>
                    </TabPanel>

                  </TabsBody>
                </Tabs>
              </Card>
            </div>

            {/* Recent Payment Section */}
            <div className="w-full mx-auto">

              <Typography variant="h4" className="text-gray-900 mb-2 mt-8">
                Payment Information
              </Typography>

              <Card className="w-full mx-auto">
                <CardBody className="p-6">

                  <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8">

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xl">{order.customerName.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <Typography variant="small" color="gray" className="mb-1.5 flex items-center gap-1 text-base font-medium">
                          <UserCircle className="w-5 h-5" />
                          Customer Name
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-lg">
                          {order.customerName}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center gap-1 text-base font-medium">
                        <Info className="w-5 h-5" />
                        Order ID
                      </Typography>
                      <Typography color="blue-gray" className="font-semibold text-lg">
                        #{order.id}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center text-base font-medium">
                        <CreditCard className="w-5 h-5 mr-1" />
                        Payment Method
                      </Typography>
                      <Typography color="blue-gray" className="font-semibold text-lg">
                        {order.paymentMethod}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="gray" className="mb-1.5 flex items-center text-base font-medium">
                        <DollarSign className="w-5 h-5" />
                        Price
                      </Typography>
                      <Typography color="blue-gray" className="font-semibold text-lg">
                        ${order.totalPrice.toFixed(2)}
                      </Typography>
                    </div>

                    <div className="flex justify-end xl:ml-auto">
                      <Chip
                        value={order.status}
                        className={`text-sm px-3 py-2 rounded-full ${
                          order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "Delivered" ? "bg-green-100 text-green-600" :
                          order.status === "Processing" ? "bg-blue-100 text-blue-600" :
                          order.status === "Shipped" ? "bg-purple-100 text-purple-600" :
                          "bg-gray-100 text-gray-900"
                        }`}
                      />
                    </div>

                  </div>
                  
                </CardBody>
              </Card>

            </div>
          </div>
        </main>

        <TimelineSection/>

      </div>

      <Footer/>

    </Fragment>
  );
};

export default Dashboard;