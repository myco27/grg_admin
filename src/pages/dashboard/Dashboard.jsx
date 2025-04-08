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
import {
  Bike,
  Building2,
  Hotel,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Loading from "../../components/layout/Loading";

const Dashboard = () => {
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [activeRiders, setActiveRiders] = useState(0);
  const [totalCentral, setTotalCentral] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [customerTrend, setCustomerTrend] = useState(true);
  const [riderTrend, setRiderTrend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOrder, setIsOrder] = useState([])

  const fetchStoreMontly = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/admin/dashboard/card-data");

      if (response === 200) {
      }
    } catch (e) {
      console.log(e.error);
    } finally {
      setLoading(false);
    }
  };

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


    const getOrdersData = async() => {
      try{
        console.log('21321312');
        const response = await axiosClient.get("/admin/orders/rate")
        console.log('sadsadsa');
        if (response.status === 200){
          const orderData =  (response.data)
          console.log(orderData)
          setIsOrder(orderData)   
        }
      }catch (error){
        console.error(error)
      }
      finally{
        console.log("Success")
      }
    }

  useEffect(() => {
    fetchDashboardCardData();
    getOrdersData();
  }, []);

  return (
    <Card className="rounded-none shadow-none">
      <div className="m-5 flex flex-col gap-1">
        <div
          id="row1"
          className="flex flex-grow flex-col justify-center gap-1 border-red-100 sm:flex-row md:flex-col lg:flex-col xl:flex-row"
        >
          <Card className="item-center flex max-w-[370px] justify-around rounded-none shadow-none">
            <div id="div1" className="grid min-w-full grid-cols-2 grid-rows-2 gap-2 p-0">
              <div className="flex items-center justify-center rounded-none border">
                <CardBody className="flex min-h-[175px] flex-col justify-center text-center">
                  <Typography variant="h5" className="mb-2 flex flex-row gap-1">
                    <Building2 className="rounded" /> Central
                  </Typography>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                    </div>
                  ) : (
                    <Typography variant="h3" className="text-primary">
                      {totalCentral}
                    </Typography>
                  )}
                </CardBody>
              </div>
              <div className="flex min-w-fit items-center justify-center rounded-none border">
                <CardBody className="min-w-1 text-center">
                  <Typography variant="h5" className="mb-2 flex flex-row">
                    <UserRound />
                    Customer
                  </Typography>
                  {loading ? (
                      <div className="flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Typography
                        variant="h3"
                        className={`${
                          customerTrend ? "text-primary" : "text-[#C70381]"
                        }`}
                      >
                        {activeCustomers}
                      </Typography>
                      {customerTrend ? (
                        <TrendingUp className="text-primary" />
                      ) : (
                        <TrendingDown className="text-[#C70381]" />
                      )}
                    </div>
                  )}
                </CardBody>
              </div>
              <div className="flex items-center justify-center rounded-none border">
                <CardBody className="text-center">
                  <Typography variant="h5" className="mb-2 flex flex-row gap-1">
                    <Hotel />
                    Restaurant
                  </Typography>

                  {loading ? (
                      <div className="flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                    </div>
                  ) : (
                    <Typography variant="h3" className="text-primary">
                      {totalCentral}
                    </Typography>
                  )}
                </CardBody>
              </div>
              <div className="flex min-w-fit items-center justify-center rounded-none border">
                <CardBody className="text-center">
                  <Typography variant="h5" className="mb-2 flex flex-row gap-1">
                    <Bike /> Riders
                  </Typography>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-8 border-gray-300 border-t-purple-500" />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Typography
                        variant="h3"
                        className={`${
                          riderTrend ? "text-primary" : "text-[#C70381]"
                        }`}
                      >
                        {activeRiders}
                      </Typography>
                      {riderTrend ? (
                        <TrendingUp className="text-primary" />
                      ) : (
                        <TrendingDown className="text-[#C70381]" />
                      )}
                    </div>
                  )}
                </CardBody>
              </div>
            </div>
          </Card>
          <div className="flex-grow">
            <SalesByRestaurant />
          </div>
        </div>
        <div className="flex flex-col gap-1 md:flex-col lg:flex-row">
          <div className="flex">
            <SalesByCentral />
          </div>
          <div className="flex-grow">
            <OrderRate orderData={isOrder}></OrderRate>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;
