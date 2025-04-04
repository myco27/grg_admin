import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import axiosClient from "../../axiosClient";

const chartConfig = {
  type: "bar",
  height: 250,
  series: [
    {
      name: "Actual",
      data: [
        {
          x: "Bangsar",
          y: 10,
          goals: [
            {
              name: "Expected",
              value: 10,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "KLCC",
          y: 44,
          goals: [
            {
              name: "Expected",
              value: 44,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Changkat",
          y: 54,
          goals: [
            {
              name: "Expected",
              value: 54,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Damansara",
          y: 66,
          goals: [
            {
              name: "Expected",
              value: 66,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Ramlee",
          y: 81,
          goals: [
            {
              name: "Expected",
              value: 81,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Melaka",
          y: 67,
          goals: [
            {
              name: "Expected",
              value: 67,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Sunway",
          y: 67,
          goals: [
            {
              name: "Expected",
              value: 67,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Queens bay",
          y: 67,
          goals: [
            {
              name: "Expected",
              value: 67,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Auto City",
          y: 67,
          goals: [
            {
              name: "Expected",
              value: 67,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Chulia",
          y: 81,
          goals: [
            {
              name: "Expected",
              value: 81,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Gurney",
          y: 92,
          goals: [
            {
              name: "Expected",
              value: 92,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
        {
          x: "Batu",
          y: 48,
          goals: [
            {
              name: "Expected",
              value: 48,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        },
      ],
    },
  ],
  options: {
    chart: { height: 1000, type: "bar" },
    plotOptions: {
      bar: { columnWidth: "30", horizontal: false },
    },
    colors: ["#612B9B4D"],
    xaxis: {
      labels: { style: { fontSize: "6px", fontWeight: "bold" } },
    },
    yaxis: {
      labels: {
        show: false,
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    legend: {
      labels: {
        colors: "#000",
        style: { fontSize: "14px" },
      },
    },
    tooltip: {
      style: { fontSize: "14px" },
    },
    dataLabels: {
      enabled: false,
      style: { fontSize: "12px", fontWeight: "bold" },
    },
  },
};

const SalesByRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const [totalMonthlySales, setTotalMonthlySales] = useState([]);

  const fetchSalesByRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        "/admin/dashboard/sales-by-restaurant"
      );

      if (response.status === 200) {
        console.log(response.data);
        setTotalMonthlySales(response.data.totalData.totalNetSales);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesByRestaurants();
  }, []);

  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-2 rounded-none"
      >
        <Typography color="black" variant="h5">
          Sales by Restaurant
        </Typography>
        <Typography>
          <span className="block">{totalMonthlySales}</span>
          <span className="text-gray-500">Total Sales (Monthly)</span>
        </Typography>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default SalesByRestaurant;
