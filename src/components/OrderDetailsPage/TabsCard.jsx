import { React, useState, useEffect, Children } from 'react';
import {
  Card,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Button,
} from '@material-tailwind/react';
import { useSearchParams } from 'react-router-dom';
import {ChevronUp, ChevronDown} from "lucide-react";

export default function TabsCard({ order }) {
  if (!order) return null;

  const totalPrice = order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const productsCount = order.products.reduce((sum, product) => sum + product.quantity, 0);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const displayedProducts = showAllProducts ? order.products : [order.products[0]];
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "order");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (activeTab !== "order") params.set('tab', activeTab);
    else params.delete('tab');
    setSearchParams(params);
  }, [activeTab, searchParams])

  const tabs =[
    {label: "Detail Order", value: "order"},
    {label: "Rider Information", value: "rider"},
    {label: "Customer Information", value: "customer"},
    {label: "Delivery Information", value: "delivery"},
  ];

  return (
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
            <div className="px-4 py-2 flex flex-col items-center md:items-start gap-8">
              {displayedProducts.map((product, index) => (
                <div key={index} className='w-full'>

                  <div className="pb-4 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-300">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                       <img
                          src={product.image || '/rockygo_logo.png'}
                          alt={product.name}
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
                              Product Name
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              {product.name}
                            </Typography>
                          </div>
                          <div className="w-full md:w-auto md:text-right">
                            <Typography color="gray" className="font-medium text-sm">
                              Payment Method
                            </Typography>
                            <Typography color="black" className="font-semibold text-sm">
                              {order.paymentMethod}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full pt-4 border-t border-gray-200">
                        <div>
                          <Typography color="gray" className="font-medium text-sm">
                            Quantity
                          </Typography>
                          <div className="flex items-center gap-2">
                            <Typography color="black" className="font-semibold text-sm">
                              {product.quantity} x ${product.price}
                            </Typography>
                          </div>
                        </div>
                        <div className="w-auto text-right">
                          <Typography color="gray" className="font-medium text-sm">
                            Price
                          </Typography>
                          <div className="flex justify-end">
                            <Typography color="black" className="font-semibold text-sm">
                              ${(product.quantity * product.price)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {order.products.length > 1 && (
                <div className='mt-[-1rem] w-full flex justify-center'>
                  <Button
                  variant="text"
                  className='show-more-btn text-xs flex flex-row gap-2'
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  >
                    {showAllProducts ? (
                      <>Show Less <ChevronUp className="h-4 w-4"/></>
                    ) : (
                      <>Show More <ChevronDown className="h-4 w-4"/></>
                    )}
                  </Button>
                </div>
              )}

              <div className='flex flex-row justify-between w-full mt-[-2rem]'>         
                <Typography className="font-semibold text-black text-sm">
                  <span className='text-gray-700'>Total Products:</span> {productsCount}
                </Typography>
                <div className='flex justify-end text-right'>
                <Typography className="font-semibold text-black text-sm">
                  <span className='text-gray-700'>Total Price:</span> ${totalPrice}
                </Typography>
                </div>
              </div>


            </div>
          </TabPanel>

          <TabPanel value="rider">
            <div className="px-4 py-2 flex flex-col items-center md:items-start gap-8">

              <div className='w-full'>

                <div className="pb-4 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-300">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={order.riderData[0].image || '/rockygo_logo.png'}
                        alt={order.riderData[0].name}
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
                            {order.riderData[0].name}
                          </Typography>
                        </div>
                        <div className="w-full md:w-auto md:text-right">
                          <Typography color="gray" className="font-medium text-sm">
                            Plate # 
                          </Typography>
                          <Typography color="black" className="font-semibold text-sm">
                            {order.riderData[0].licensePlate}
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
                            {order.riderData[0].email}
                          </Typography>
                        </div>
                      </div>
                      <div className="w-auto text-right">
                        <Typography color="gray" className="font-medium text-sm">
                          Cellphone #
                        </Typography>
                        <div className="flex justify-end">
                          <Typography color="black" className="font-semibold text-sm">
                            {order.riderData[0].phoneNumber}
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
                        src={order.customerData[0].image || '/rockygo_logo.png'}
                        alt={order.customerData[0].name}
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
                            {order.customerData[0].name}
                          </Typography>
                        </div>
                        <div className="w-full md:w-auto md:text-right">
                          <Typography color="gray" className="font-medium text-sm">
                            Home Address:
                          </Typography>
                          <Typography color="black" className="font-semibold text-sm">
                            {order.customerData[0].address}
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
                            {order.customerData[0].email}
                          </Typography>
                        </div>
                      </div>
                      <div className="w-auto text-right">
                        <Typography color="gray" className="font-medium text-sm">
                          Cellphone #
                        </Typography>
                        <div className="flex justify-end">
                          <Typography color="black" className="font-semibold text-sm">
                            {order.customerData[0].phoneNumber}
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
            <div className="px-4 flex flex-col items-center md:items-start gap-4">
              <div className="space-y-1 w-full">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="w-full md:w-auto">
                    <Typography color="gray" className="font-medium text-sm">
                      Customer Name:
                    </Typography>
                    <Typography color="black" className="font-semibold text-sm">
                      {order.customerData[0].name}
                    </Typography>
                  </div>
                  <div className="w-full md:w-auto md:text-right">
                    <Typography color="gray" className="font-medium text-sm">
                      Home Address:
                    </Typography>
                    <Typography color="black" className="font-semibold text-sm">
                      {order.customerData[0].address}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="w-full mb-2 overflow-hidden rounded-lg border border-gray-200">

                {order.mapSrc ? (
                  <iframe
                    src={order.mapSrc}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={order.customerData[0].address}
                  />
                ) : (
                  <div className='h-[450px] p-4 flex items-center justify-center text-gray-400'>
                    <Typography variant='h3' className='font-semibold'>
                      No Map Data
                    </Typography>
                  </div>
                )}

              </div>
            </div>
          </TabPanel>

        </TabsBody>
      </Tabs>
    </Card>
  );
}