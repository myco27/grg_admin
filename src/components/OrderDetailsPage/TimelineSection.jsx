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
} from "@material-tailwind/react";
import { Home, Bell, Truck, CheckCircle, XCircle, Package} from "lucide-react";

const TimelineSection = ({ order }) => {

  const timelineItems = [
      {
        icon: <Home className="h-4 w-4" />,
        title: "Order Placed",
        description: "Order has been placed and is being processed.",
        active: true 
      },
      {
        icon: <Bell className="h-4 w-4" />,
        title: "Order Confirmed",
        description: "Your order has been confirmed and is being prepared.",
        active: ["processing", "delivered", "completed", "intransit"].includes(order.order_status)
      },
      {
        icon: <Truck className="h-4 w-4" />,
        title: "Out for Delivery",
        description: `${order.user_details.first_name} ${order.user_details.last_name} is delivering your order.`,
        active: ["intransit", "delivered", "completed"].includes(order.order_status)
      },
      {
        icon: <Package className="h-4 w-4" />,
        title: "Order Delivered",
        description: `${order.user_details.first_name} ${order.user_details.last_name} has delivered your order.`,
        active: ["delivered", "completed"].includes(order.order_status)
      },
      {
        icon: order.order_status === "Cancelled" ? <XCircle className="h-4 w-4"/> : <CheckCircle className="h-4 w-4"/>,
        title: order.order_status === "Cancelled" ? "Order Cancelled" : "Order Completed",
        description: order.order_status === "Cancelled" ? "Order is cancelled" : "Order is Completed",
        active: ["Cancelled", "completed", "delivered"].includes(order.order_status)
      },
    ];

  return (
    <div className="lg:w-64 bg-gray-100 transform h-full">
      <div className="lg:sticky lg:top-0 lg:h-screen w-full">
        <Card className="h-full flex flex-col mx-auto lg:rounded-none shadow-md lg:shadow-none border-l border-gray-300 overflow-y-auto">
          <CardBody className="p-8 h-auto flex">
            <div className="w-full">
              <Typography variant="h4" className="text-gray-900 mb-4">
                Timeline
              </Typography>
              
              <div>
                <Timeline>
                  {timelineItems.map((timelineItem, index) => (
                    <TimelineItem key={index} className={index === 0 ? "pt-4" : ""}>
                      {index !== timelineItems.length - 1 && <TimelineConnector />}
                      <TimelineHeader>
                        <TimelineIcon className={`p-2 ${timelineItem.active ? (order.order_status === "Cancelled" ? "bg-red-500" : "bg-green-500 text-white") : "bg-gray-300 text-gray-600"}`}>
                          {timelineItem.icon}
                        </TimelineIcon>
                        <Typography variant="h6" color={timelineItem.active ? "black" : "gray"}>
                          {timelineItem.title}
                        </Typography>
                      </TimelineHeader>
                      <TimelineBody className="pb-12">
                        <Typography color="gray" className="font-normal text-sm">
                          {timelineItem.description}
                        </Typography>
                      </TimelineBody>
                    </TimelineItem>
                  ))}
                </Timeline>

              </div>

            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TimelineSection;