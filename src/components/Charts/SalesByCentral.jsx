import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";




const chartConfig = {
  type: "bar",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [
        { x: "GravyBaby", y: 80, fillColor: "#612B9B", strokeColor: "blue" },
        { x: "SouthernRock", y: 40, fillColor: "#612B9B", strokeColor: "blue" },
        { x: "Shucked", y: 60, fillColor: "#612B9B", strokeColor: "blue" },
      ]
    },
  ],
  options: {
    chart: {
      toolbar: { show: false },
    },
    title: { show: false },
    dataLabels: {
      enabled: true,
      position: "inside",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "40%",
        borderRadius: 2,
        distributed: true,
      },
    },
    xaxis: {
      max: 100,
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 0,
      xaxis: { lines: { show: true } },
      padding: { top: 5, right: 20 },
    },
    fill: { opacity: 0.8 },
    tooltip: { theme: "dark" },
  },
};

// Component
export default function SalesByCentral() {
  return (
    <Card className="min-w-[412px]">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col rounded-none md:flex-row md:items-center"
      >
        <Typography variant="h5" color="black">
          Sales by Central
        </Typography>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
