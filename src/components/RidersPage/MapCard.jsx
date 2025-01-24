import { React } from 'react';
import {
  Card,
  Typography,
} from '@material-tailwind/react';

export default function MapCard({ order }) {

  const hasMapData = order.setup.latitude && order.setup.longitude;
  const mapUrl = `https://maps.google.com/maps?q=${order.setup.latitude},${order.setup.longitude}&z=15&output=embed`;


  return (
    <Card className='shadow-none border border-gray-300 mb-4'>
      <div className="p-4 flex flex-col items-center md:items-start gap-4">
        <div className="space-y-1 w-full">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
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

            <div className="flex flex-row justify-between items-center w-full pt-3 border-t border-gray-200">
                <div>
                <Typography color="gray" className="font-medium text-sm">
                    Email
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

        <div className="w-full mb-2 overflow-hidden rounded-lg border border-gray-200">
          {hasMapData ? (
            // Render the map if latitude and longitude are available
            <iframe
              src={mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="map"
            />
          ) : (
            // Render "No Map Data" message if latitude or longitude is missing
            <div className="h-[450px] p-4 flex items-center justify-center text-gray-400">
              <h3 className="font-semibold text-2xl">No Map Data</h3>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}