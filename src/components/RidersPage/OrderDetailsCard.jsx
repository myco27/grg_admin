import React from 'react';
import { Card, CardBody, Typography, Chip } from '@material-tailwind/react';
import { CalendarDays, MapPin, QrCode, Store, Wallet } from 'lucide-react';

export default function DetailsCard({ order }) {
  const getRiderInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('');
  };

  if (!order) return null;

  const totalPrice = order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <Card className="mb-3 shadow-none border border-gray-300">
      <CardBody className='px-6 py-4'>
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex-1">

            <div className="flex flex-col sm:flex-row justify-start gap-4 md:gap-10">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">{getRiderInitials(order.customerName)}</span>
                </div>
                <div className="mt-1">
                  <Typography color="black" className='font-bold text-md'>
                    {order.customerName}
                  </Typography>
                  <Typography color="gray" className="font-medium text-md">
                    Customer
                  </Typography>
                </div>
              </div>

              <div className="text-left mt-1">
                <Typography color="blue-gray" className='font-bold text-md'>
                  #{order.id}
                </Typography>
                <Typography color="gray" className="font-medium text-md">
                  Order Number
                </Typography>
              </div>

              <div className='flex items-center justify-end ml-auto'>
                <Chip
                  value={order.status}
                  className={`text-xs px-3 py-1 text-center rounded-full ${
                    order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "Delivered" ? "bg-green-100 text-green-600" :
                    order.status === "Processing" ? "bg-blue-100 text-blue-600" :
                    order.status === "Shipped" ? "bg-purple-100 text-purple-600" :
                    order.status === "Completed" ? "bg-purple-100 text-purple-600" :
                    "bg-gray-100 text-gray-900"
                }`}
                />
              </div>
              
            </div>

            <div className="mt-4">
              <div className="h-px bg-gray-200 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <Wallet className="w-9 h-9 text-blue-500 mt-1" />
                  <div>
                    <Typography color="gray" className="font-medium mb-[-4px] text-md">
                      Total Price
                    </Typography>
                    <Typography color="black" className="font-bold text-md">
                      $ {totalPrice.toFixed(2)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Store className="w-9 h-9 text-red-400 mt-1" />
                  <div>
                    <Typography color="gray" className="font-medium mb-[-4px] text-md">
                      Store
                    </Typography>
                    <Typography color="black" className="font-bold text-md">
                      Store Name
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays className="w-9 h-9 text-green-500 mt-1" />
                  <div>
                    <Typography color="gray" className="font-medium mb-[-4px] text-md">
                      Order Date
                    </Typography>
                    <Typography color="black" className="font-bold text-md">
                      {order.orderDate}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-9 h-9 text-orange-500 mt-1" />
                  <div>
                    <Typography color="gray" className="font-medium mb-[-4px] text-md">
                      Shipping Type
                    </Typography>
                    <Typography color="black" className="font-bold text-md">
                      {order.shippingType}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* <div className="w-full lg:w-auto flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-gray-500" />
            </div>
          </div> */}

        </div>
      </CardBody>
    </Card>
  );
}