import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import OrderRate from "../../components/Charts/OrderRate";
import SalesByRestaurant from "../../components/Charts/SalesByRestaurant";
import SalesByCentral from "../../components/Charts/SalesByCentral";
import { Bike, Building2, Hotel, UserRound } from "lucide-react";

const Dashboard = () => {
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [activeRiders, setActiveRiders] = useState(0);
  const [totalCentral, setTotalCentral] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  const [loading, setLoading] = useState(false);


  const fetchDashboardCardData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/dashboard/card-data");

      if (response.status === 200) {
        setActiveCustomers(response.data.data.totalActiveCustomer);
        setActiveRiders(response.data.data.totalActiveRider);
        setTotalCentral(response.data.data.totalNumberOfCentral);
        setTotalRestaurants(response.data.data.totalNumberOfRestaurant);
      }
    } catch (error) {
      console.error("Error fetching dashboard card data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardCardData();
  }, []);

  return (
    <div className="m-5 flex flex-col justify-center gap-5">
      <div id="row1" className="flex flex-col gap-1 sm:flex-row">
        <Card className="item-center flex min-w-[360px] justify-center">
        <div id="div1" className="grid grid-cols-2 grid-rows-2 gap-2 px-5">
          <div className="flex items-center justify-center rounded-md border">
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2 flex flex-row gap-1" >
              <Building2 className="rounded"/> Central
              </Typography>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                </div>
              ) : (
                <Typography variant="h3" className="text-primary" >
        
                {totalCentral}
                </Typography>
              )}
            </CardBody>
          </div>
          <div className="flex min-w-fit items-center justify-center rounded-md border">
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2 flex flex-row">
                <UserRound/>Customer
              </Typography>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-t-purple-500" />
                </div>
              ) : (
                <Typography variant="h3" className="text-primary">
                  {activeCustomers}
                </Typography>
              )}
            </CardBody>
          </div>
          <div className="flex items-center justify-center rounded-md border">
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2 flex flex-row gap-1">
                <Hotel/>Restaurant
              </Typography>
              
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full" />
                </div>
              ) : (
                <Typography variant="h3" className="text-primary">
                  {totalCentral}
                </Typography>
              )}
            </CardBody>
          </div>
          <div className="flex min-w-fit items-center justify-center rounded-md border">
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2 flex flex-row gap-1">
                <Bike/> Riders
              </Typography>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                </div>
              ) : (
                <Typography variant="h3" className="text-primary">
                  {activeRiders}
                </Typography>
              )}
            </CardBody>
          </div>
        </div>
        </Card>
        <div className="flex-grow">
          <SalesByRestaurant/>
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:flex-row">
        <div className="flex">
            <SalesByCentral/>
        </div>
        <div className="flex-grow">
          <OrderRate></OrderRate>
        </div>
      </div>
    </div>
  );
};

{
  /*
   */
}
export default Dashboard;
