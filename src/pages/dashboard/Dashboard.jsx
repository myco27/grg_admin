import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import axiosClient from "../../axiosClient";

const Dashboard = () => {
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [activeRiders, setActiveRiders] = useState(0);
  const [totalCentral, setTotalCentral] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  const fetchDashboardCardData = async () => {
    const response = await axiosClient.get("/admin/dashboard/card-data");

    if (response.status === 200) {
      setActiveCustomers(response.data.data.totalActiveCustomer);
      setActiveRiders(response.data.data.totalActiveRider);
      setTotalCentral(response.data.data.totalNumberOfCentral);
      setTotalRestaurants(response.data.data.totalNumberOfRestaurant);
    }
  };

  useEffect(() => {
    fetchDashboardCardData();
  }, []);

  return (
    <div className="flex flex-col p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="text-center">
            <Typography variant="h5" className="mb-2 text-nowrap">
              Active Customers
            </Typography>
            <Typography variant="h3" color="green">
              {activeCustomers}
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <Typography variant="h5" className="mb-2">
              Active Riders
            </Typography>
            <Typography variant="h3" color="green">
              {activeRiders}
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <Typography variant="h5" className="mb-2">
              Central
            </Typography>
            <Typography variant="h3" color="green">
              {totalCentral}
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <Typography variant="h5" className="mb-2">
              Restaurants
            </Typography>
            <Typography variant="h3" color="green">
              {totalRestaurants}
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
