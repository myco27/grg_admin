import React from 'react';
import { Card, CardBody, Typography, Rating } from '@material-tailwind/react';
import { UserCircle, CalendarDays, MapPin, Store, Bike } from 'lucide-react';

export default function DetailsCard({ order, averageRating }) {

  if (!order) return null;

  return (
    <div className='pb-4'>
      <Card className='shadow-md'>
        <CardBody className='px-6 py-4'>
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-start items-start md:items-center gap-8">

                <div className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">
                      {order.user_details.first_name?.[0]}
                      {order.user_details.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <Typography color="black" className='font-bold text-md'>
                      {order.user_details.first_name} {order.user_details.last_name}
                    </Typography>
                    <Typography color="gray" className="font-medium text-md flex flex-row">
                      <Bike className='h-5 w-5 mr-1'/> Delivery Rider
                    </Typography>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <Rating value={averageRating} className='mt-1 ml-[-4px] mt-[0px]' readOnly />
                  <Typography color="gray" className='font-medium text-md'>
                    Rating:
                  </Typography>
                </div>

                <div className="md:text-right mt-1 md:ml-auto">
                  <Typography color="blue-gray" className='font-bold text-md'>
                    #{order.order_number || 'N/A'}
                  </Typography>
                  <Typography color="gray" className="font-medium text-md">
                    Order Number
                  </Typography>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-px bg-gray-200 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-start gap-2">
                    <UserCircle className="w-9 h-9 text-blue-500 mt-1" />
                    <div>
                      <Typography color="gray" className="font-medium mb-[-4px] text-md">
                        Customer Name
                      </Typography>
                      <Typography color="black" className="font-bold text-md">
                        N/A
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
                        {order.setup.store_name}
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
                        {order.date_created || 'N/A'}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-9 h-9 text-orange-500 mt-1" />
                    <div>
                      <Typography color="gray" className="font-medium mb-[-4px] text-md">
                        Shipping Type
                      </Typography>
                      <Typography color="black" className="font-bold text-md uppercase">
                        {order.type || 'N/A'}
                      </Typography>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </CardBody>
      </Card>
    </div>
  );
}