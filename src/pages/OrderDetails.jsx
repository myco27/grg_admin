import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Loading from "../components/layout/Loading";
import {
  Typography,
  Button,
} from "@material-tailwind/react";
import DetailsCard from "../components/OrderDetailsPage/DetailsCard";
import TimelineSection from "../components/OrderDetailsPage/TimelineSection";
import TabsCard from "../components/OrderDetailsPage/TabsCard";
import PaymentCard from "../components/OrderDetailsPage/PaymentCard";

export default function OrderDetails() {
  const { order_id } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  // Scroll at top most after page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch order details from the backend
  useEffect(() => {
    const fetchOrderDetails = async () => {

      // Check if order ID in url has letter
      if (/[a-zA-Z]/.test(order_id)) {
        console.log("Invalid order_id (contains letters), redirecting to /notfound");
        navigate("/notfound");
        return;
      }

      try {
        const response = await axiosClient.get(`/admin/orders/${order_id}`);
        if (response.status === 200) {
          setOrder(response.data.data);
          console.log(response)
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        navigate("/notfound"); // Redirect to not found page if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_id, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <Typography className="text-center text-gray-500">
        Order not found.
      </Typography>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <main className="px-3 md:px-8 py-6 overflow-x-hidden w-full overflow-y-auto pb-4">
          <Typography variant="h4" className="text-gray-900 mb-4">
            Order Details
          </Typography>

          <DetailsCard order={order} />

          <Typography variant="h4" className="text-gray-900 mt-4 mb-4">
              Main Info
          </Typography>

          <TabsCard order={order}/>

          <Typography variant="h4" className="text-gray-900 mt-4 mb-4">
              Payment Info
          </Typography>

          <PaymentCard order={order}/>

        </main>

        <div className="px-3 py-4 md:px-8 lg:px-0 lg:py-0">
          <TimelineSection order={order}/>
        </div>

      </div>
    </Fragment>
  );
}