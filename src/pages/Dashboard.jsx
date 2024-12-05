import {React, Fragment, useEffect} from "react";
import { Typography } from "@material-tailwind/react";
import Header from "../components/Header";
import { orders } from "../data/orders.json";
import { useParams } from "react-router-dom";
import TimelineSection from "../components/DashboardPage/TimelineSection";
import Footer from "../components/Footer";
import DetailsCard from "../components/DashboardPage/DetailsCard";
import TabsCard from "../components/DashboardPage/TabsCard";
import PaymentCard from "../components/DashboardPage/PaymentCard";

const Dashboard = () => {
  const { orderId } = useParams();
  const order = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      
      <Header />

      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

        {/* Main Content */}
        <main className="px-3 md:px-8 py-4 overflow-x-hidden w-full overflow-y-auto pb-4">

          {/* Order Details Card */}
          <div className="w-full mx-auto">

            <Typography variant="h4" className="text-gray-900 mb-2">
              Order Details
            </Typography>
            
            <DetailsCard order={order} />

            {/* Tabs Section */}
            <Typography variant="h4" className="text-gray-900 mb-1">
              Main Info
            </Typography>

            <TabsCard order={order}/>

          </div>

          {/* Recent Payment Section */}
          <div className="w-full mx-auto">

            <Typography variant="h4" className="text-gray-900 mb-2 mt-8">
              Payment Information
            </Typography>

            <PaymentCard order={order}/>

          </div>

        </main>

        <div className="px-3 py-4 md:px-8 lg:px-0 lg:py-0">
         <TimelineSection/>
        </div>

      </div>

      <Footer/>

    </Fragment>
  );
};

export default Dashboard;