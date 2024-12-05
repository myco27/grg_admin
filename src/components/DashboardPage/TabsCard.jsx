import React from 'react';
import {
  Card,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from '@material-tailwind/react';

export default function TabsCard({ order }) {
  if (!order) return null;

  return (
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
            <div className="p-4">
              <Typography>Rider: {order.riderName}</Typography>
            </div>
          </TabPanel>

          <TabPanel value="customer-information">
            <div className="p-4">
              <Typography>Customer: {order.customerName}</Typography>
            </div>
          </TabPanel>

          <TabPanel value="documents">
            <div className="p-4">
              <Typography>Order #{order.id} Documents</Typography>
            </div>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </Card>
  );
}