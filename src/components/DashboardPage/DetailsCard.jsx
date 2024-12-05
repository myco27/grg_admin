import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { UserCircle, CalendarDays, MapPin, QrCode } from 'lucide-react';

export default function DetailsCard({ order }) {
  const getRiderInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('');
  };

  if (!order) return null;

  return (
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
  );
}