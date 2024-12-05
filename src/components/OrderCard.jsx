import {
  Card,
  CardBody,
  Typography,
  Chip,
  Checkbox
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Bike, Calendar, UserCircle } from "lucide-react"

export default function OrderDetails({ order }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking checkbox
    if (e.target.type !== 'checkbox') {
      navigate(`/dashboard/${order.id}`);
    }
  };

  return (
    <Card className="w-full h-[280px] cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <CardBody className="p-4 flex flex-col h-full">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center">
                <Checkbox
                color="green"
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                    <Typography variant="h6" className="text-gray-900">
                        {order.id}
                    </Typography>
                    <Typography className="text-gray-600 font-medium">
                        {order.shippingType}
                    </Typography>
                </div>
            </div>
          <Chip
            value={order.status}
            className={`text-xs px-3 py-1 rounded-full ${
              order.status === "Cancelled" ? "bg-red-100 text-red-600" :
              order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
              order.status === "Delivered" ? "bg-green-100 text-green-600" :
              order.status === "Processing" ? "bg-blue-100 text-blue-600" :
              order.status === "Shipped" ? "bg-purple-100 text-purple-600" :
              "bg-gray-100 text-gray-900"
            }`}/>
        </div>

        {/* Product Section */}
        <div className="flex items-start gap-4 py-4 flex-1">
            <div className="h-20 w-20 rounded-lg bg-gray-100 p-2 flex-shrink-0">
                <img
                src={order.product.image}
                alt={order.product.name}
                className="h-full w-full object-contain"
                />
            </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <Typography variant="h6" className="text-gray-900 truncate">
                    {order.product.name}
                    </Typography>
                    <Typography className="text-sm text-gray-600 font-medium">
                    {order.product.quantity} x ${order.product.price.toFixed(2)}
                    </Typography>
                    {order.otherProducts > 0 && (
                    <Typography className="text-sm text-gray-500">
                        +{order.otherProducts} Other Product{order.otherProducts > 1 ? 's' : ''}
                    </Typography>
                    )}
                </div>

                <div>
                    <Typography variant="h6" className="text-gray-900 text-right">
                        ${order.totalPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="paragraph" className="text-right font-medium">
                        {order.paymentMethod}
                    </Typography>
                </div>

            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t border-gray-200">
            <div>
                <Typography className="text-gray-600 font-medium flex items-center gap-1">
                 <Calendar className="w-5 h-5" />
                 Order Date
                </Typography>
                <Typography className="text-gray-900 font-bold truncate">
                    {order.orderDate}
                </Typography>
            </div>

            <div>
                <Typography className="text-gray-600 font-medium flex items-center gap-1">
                 <Bike className="w-5 h-5" />
                 Rider:
                </Typography>
                <Typography className="text-gray-900 font-bold truncate">
                {order.riderName}
                </Typography>
            </div>

            <div>
                <Typography className="text-gray-600 font-medium flex items-center gap-1">
                 <UserCircle className="w-5 h-5" />
                 Customer
                </Typography>
                <Typography className="text-gray-900 font-bold truncate">
                    {order.customerName}
                </Typography>
            </div>

        </div>

      </CardBody>
    </Card>
  );
}