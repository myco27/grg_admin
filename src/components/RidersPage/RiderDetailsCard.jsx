import React from 'react';
import { Card, CardBody, Typography, Rating } from '@material-tailwind/react';
import { UserCircle, Info, Mail, Phone, Bike } from 'lucide-react';

export default function RiderDetailsCard({ rider }) {

  return (
    <div>
      <Card className="w-full mx-auto mb-3 shadow-none border border-gray-300 break-all">
        <CardBody className="px-6 py-4">
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-10">
            {/* Rider Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xl">
                   {rider.first_name[0]}
                   {rider.last_name[0]}
                </span>
              </div>
              <div>
                <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                  <UserCircle className="w-5 h-5" />
                  Rider
                </Typography>
                <Typography color="blue-gray" className="font-semibold text-md">
                    {rider.first_name} {rider.last_name}
                </Typography>
              </div>
            </div>

            {/* Rider Email */}
            <div>
              <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                <Mail className="w-5 h-5" />
                Email
              </Typography>
              <Typography color="blue-gray" className="font-semibold text-md">
                {rider.email}
              </Typography>
            </div>

            {/* Rider Phone Number */}
            <div>
              <Typography color="gray" className="flex items-center text-md font-medium">
                <Phone className="w-5 h-5 mr-1" />
                Phone #
              </Typography>
              <Typography color="blue-gray" className="font-semibold text-md">
                {rider.mobile_number}
              </Typography>
            </div>

            {/* License Plate */}
            <div>
              <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                <Info className="w-5 h-5" />
                License #
              </Typography>
              <Typography color="blue-gray" className="font-semibold text-md">
                {rider.license_number}
              </Typography>
            </div>

            {/* Rider Rating */}
            <div className="ml-auto text-right">
              <Typography color="gray" className="text-md font-medium">
                Rating:
              </Typography>
              <Rating value={5} readonly />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}