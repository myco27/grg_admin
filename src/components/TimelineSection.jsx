import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Button
} from "@material-tailwind/react";
import { Home, Bell, MapPin, Banknote, LogOut } from "lucide-react";

const TimelineSection = () => {
  return (
    <div className="p-4 lg:p-0 lg:w-80 bg-gray-100 transform">
      <div className="lg:sticky lg:top-0 lg:h-screen w-full">
        <Card className="h-full lg:h-screen flex flex-col mx-auto lg:rounded-none">
          <CardBody className="p-8 h-full flex">
            <div className="w-full">
              <Typography variant="h4" className="text-gray-900 mb-4">
                Timeline
              </Typography>
              <div className="flex-1 overflow-y-auto">
                <Timeline>
                  <TimelineItem className="pt-4">
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="p-2">
                        <Home className="h-4 w-4" />
                      </TimelineIcon>
                      <Typography variant="h5" color="blue-gray">
                        Order Placed
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-16">
                      <Typography color="gray" className="font-normal">
                        Order has been placed and is being processed for delivery.
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="p-2">
                        <Bell className="h-4 w-4" />
                      </TimelineIcon>
                      <Typography variant="h5" color="blue-gray">
                        Order Confirmed
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-16">
                      <Typography color="gray" className="font-normal">
                        Your order has been confirmed and is being prepared for shipping.
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="p-2">
                        <MapPin className="h-4 w-4" />
                      </TimelineIcon>
                      <Typography variant="h5" color="blue-gray">
                        Order Shipped
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-16">
                      <Typography color="gray" className="font-normal">
                        Your order has been shipped and is on its way to the delivery address.
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineHeader>
                      <TimelineIcon className="p-2">
                        <Banknote className="h-4 w-4" />
                      </TimelineIcon>
                      <Typography variant="h5" color="blue-gray">
                        Order Delivered
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-[13px]">
                      <Typography color="gray" className="font-normal">
                        Order has been successfully delivered to the destination.
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>
                </Timeline>
                <div className="mt-10 flex flex-col justify-center">
                  <Button variant="text" className="text-sm flex items-center justify-center">
                    Log Out
                    <LogOut className="h-6 w-6 ml-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TimelineSection;