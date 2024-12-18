import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";

function RiderCard({ rider, order }) {
  return (
    <Card className="w-full border-b border-t border-gray-300 rounded-none shadow-none h-[80px] flex justify-center">
      <CardBody className="ml-[-0.5rem] flex gap-2">
        <img
          src={rider.image || '/rockygo_logo.png'}
          alt={rider.name}
          className="w-12 h-12 rounded-full object-contain bg-gray-100 p-1"
          onError={(e) => {
            e.target.src = '/rockygo_logo.png';
            e.target.onerror = null;
          }}
        />
        <div className='w-full mr-[-1rem]'>
          <div className='flex flex-row justify-between'>
            <Typography color="black" className="font-medium text-md">
              #{order.id}
            </Typography>

            <Chip
            value={order.status}
            className={`text-[10px] px-1 py-1 rounded-full bg-transparent ${
                order.status === "Cancelled" ? "text-red-600" :
                order.status === "Pending" ? "text-yellow-800" :
                order.status === "Delivered" ? "text-green-600" :
                order.status === "Processing" ? "text-blue-600" :
                order.status === "Shipped" ? "text-purple-600" :
                order.status === "Completed" ? "text-purple-600" :
                "text-gray-900"
            }`}
            />
          </div>
          <Typography color="gray" className="font-normal text-xs">
            {rider.name}
          </Typography>

        </div>
      </CardBody>
    </Card>
  );
}

export default RiderCard;
