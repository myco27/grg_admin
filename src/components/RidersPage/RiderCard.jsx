import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";

function RiderCard({ rider }) {
  return (
    <Card className="w-full border-b border-t border-gray-300 rounded-none shadow-none h-[80px] flex justify-center">
      <CardBody className="ml-[-0.5rem] flex gap-2">
        <img
          src={rider.image || '/rockygo_logo.png'} // Use rider.image or fallback to logo
          alt={`${rider.first_name} ${rider.last_name}`} // Use rider's full name as alt text
          className="w-12 h-12 rounded-full object-contain bg-gray-100 p-1"
          onError={(e) => {
            e.target.src = '/rockygo_logo.png'; // Fallback image on error
            e.target.onerror = null;
          }}
        />
        <div className='w-full mr-[-1rem] mt-1'>
          <div className='flex flex-row justify-between'>
            <Typography color="black" className="font-semibold text-sm">
              {rider.first_name || "None"} {rider.last_name || "None"} {/* Use first and last name */}
            </Typography>
          </div>
          <Typography color="gray" className="font-normal text-xs">
            License #: {rider.license_number || "None"} {/* Use license_number */}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default RiderCard;