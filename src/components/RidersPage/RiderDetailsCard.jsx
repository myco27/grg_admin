import React from 'react';
import { Card, CardBody, Typography, Rating } from '@material-tailwind/react';
import { UserCircle, Info, Mail, Phone } from 'lucide-react';

export default function RiderDetailsCard({ rider }) {
  const InfoBlock = ({ icon: Icon, label, value }) => (
    <div className="flex-1 min-w-[200px] p-4 bg-gray-100 rounded-lg transition-all hover:bg-gray-100">
      <Typography color="gray" className="flex items-center gap-2 text-sm font-medium mb-2">
        <Icon className="w-5 h-5" />
        {label}
      </Typography>
      <Typography color="blue-gray" className="font-semibold text-md break-words">
        {value || "None"}
      </Typography>
    </div>
  );

  return (
    <Card className="w-full mx-auto mb-3 shadow-none border border-gray-300 break-all">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header with Avatar and Rating */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 font-bold text-xl">
                  {rider.first_name?.[0]}
                  {rider.last_name?.[0]}
                </span>
              </div>
              <div>
                <Typography color="gray" className="flex items-center gap-1 text-sm font-medium">
                  <UserCircle className="w-4 h-4" />
                  Rider Profile
                </Typography>
                <Typography variant="h6" color="blue-gray" className="font-bold">
                  {rider.first_name || "None"} {rider.last_name || "None"}
                </Typography>
              </div>
            </div>
            
            <div className="flex flex-col items-start sm:items-end">
              <Typography color="gray" className="text-sm font-medium mb-1">
                Rating
              </Typography>
              <Rating 
                value={5} 
                readonly 
                className="flex gap-1"
                ratedColor="amber"
              />
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoBlock
              icon={Mail}
              label="Email Address"
              value={rider.email}
            />
            <InfoBlock
              icon={Phone}
              label="Phone Number"
              value={rider.mobile_number}
            />
            <InfoBlock
              icon={Info}
              label="License Number"
              value={rider.license_number}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}