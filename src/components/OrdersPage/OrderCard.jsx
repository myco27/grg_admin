import {
  Card,
  CardBody,
  Typography,
  Chip,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  Bike,
  Calendar,
  UserCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handlePreviewOrderDetails = (e) => {
    navigate(`/orders/${order.order_id}`);
  };

  useEffect(() => {
    // console.log("ordercard", order);
  }, []);

  // const displayedProducts = showAllProducts ? order.products : [order.products[0]];

  return (
    <Card
      className="w-full h-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handlePreviewOrderDetails}
    >
      <CardBody className="p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center">
            <Checkbox
              color="green"
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex items-center gap-2">
              <Typography className="text-gray-900 font-semibold text-md">
                {order.order_number}
              </Typography>
              <Typography className="text-gray-600 font-medium">
                {/* {order.shippingType ?? "N/A"} */}
                N/A
              </Typography>
            </div>
          </div>
          <Chip
            value={order.order_status}
            className={`text-xs px-2 py-1 rounded-full ${
              order.order_status === "cancelled"
                ? "bg-red-100 text-red-600"
                : order.order_status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.order_status === "delivered"
                ? "bg-green-100 text-green-600"
                : order.order_status === "processing"
                ? "bg-blue-100 text-blue-600"
                : order.order_status === "completed"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* Product Section */}
        <div className="flex-1 flex flex-col gap-4 py-4">
          <Typography className="text-black text-sm">Store Name:</Typography>
          {/* {displayedProducts.map((product, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-gray-100 p-2 flex-shrink-0">
                  <img
                    src={product.image || '/rockygo_logo.png'}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.src = '/rockygo_logo.png';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    
                    <div className="min-w-0">
                        <Typography className="text-gray-900 text-sm font-bold truncate">
                        {product.name}
                        </Typography>
                        <Typography className="text-xs text-gray-600 font-medium">
                        {product.quantity} x ${product.price.toFixed(2)}
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="h6" className="text-gray-900 text-sm text-right">
                            ${(product.quantity * product.price).toFixed(2)}
                        </Typography>
                        <Typography variant="paragraph" className="text-right text-xs font-medium">
                            {order.paymentMethod}
                        </Typography>
                    </div>

                  </div>
                </div>
              </div>
            ))} */}

          {/* {order.products.length > 1 && (
              <div className="w-full flex justify-center mt-[-1rem]">
                <Button 
                  variant="text" 
                  className="show-more-btn text-xs flex flex-row gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllProducts(!showAllProducts);
                  }}
                >
                  {showAllProducts ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Show More <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            )} */}
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t border-gray-200">
          <div>
            <Typography className="text-gray-600 text-md font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Order Date
            </Typography>
            <Typography className="text-gray-900 text-md font-bold truncate">
              {order.date_created}
            </Typography>
          </div>

          <div>
            <Typography className="text-gray-600 text-md font-medium flex items-center gap-1">
              <Bike className="w-4 h-4" />
              Rider:
            </Typography>
            <Typography className="text-gray-900 text-md font-bold truncate">
              {/* {order.riderData[0].name ?? "N/A"} */}
              N/A
            </Typography>
          </div>

          <div>
            <Typography className="text-gray-600 text-md font-medium flex items-center gap-1">
              <UserCircle className="w-4 h-4" />
              Customer
            </Typography>
            <Typography className="text-gray-900 text-md font-bold truncate">
              {/* {order.customerData[0].name ?? "N/A"} */}
              N/A
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
