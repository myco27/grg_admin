import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { UserCircle, CalendarDays, MapPin, QrCode } from 'lucide-react';

export default function DetailsCard({ order }) {
  const getRiderInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('');
  };

  if (!order) return null;

  return (
    <Card>
      <CardBody className='px-6 py-4'>
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">{getRiderInitials(order.riderName)}</span>
                </div>
                <div className="mt-1">
                  <Typography color="black" className='font-bold text-md'>
                    {order.riderName}
                  </Typography>
                  <Typography color="gray" className="font-medium text-md">
                    Delivery Rider
                  </Typography>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <Typography color="blue-gray" className='font-bold text-md'>
                  #{order.id}
                </Typography>
                <Typography color="gray" className="font-medium text-md">
                  Order Number
                </Typography>
              </div>
              
            </div>

            <div className="mt-4">
              <div className="h-px bg-gray-200 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-2">
                  <UserCircle className="w-9 h-9 text-blue-500 mt-1" />
                  <div>
                    <Typography color="gray" className="font-medium mb-[-4px] text-md">
                      Customer Name
                    </Typography>
                    <Typography color="black" className="font-bold text-md">
                      {order.customerName}
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
          
          <div className="w-full lg:w-auto flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-gray-500" />
            </div>
          </div>

        </div>
      </CardBody>
    </Card>
  );
}