import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

export default function SalesByCentral({centralData}) {


  const sortedData = centralData.sort((a, b) => b.total_sales - a.total_sales)
  const top3data = sortedData.slice(0,3)

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: top3data.map((store)=>store.store_name),
        data: top3data.map((store) => ({
          x: store.store_name,
          y: Math.trunc(store.total_sales),
          color: "#612B9B"
        }))
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
        formatter: (val, { dataPointIndex }) => {
          const branchNames = centralData.map((store)=>store.store_name);
          return `${branchNames[dataPointIndex]}: ${val}`;
        },
        style: {
          fontSize: "11px",
          fontWeight: "italic",
          colors: "black",
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "10",
          borderRadius: 2,
          distributed: true,
        },
      },
      xaxis: {
        max: 700000,
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
        show:false
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
  
  return (
    <Card className="flex-grow rounded-none border shadow-none sm:min-w-[370px]">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col rounded-none md:flex-row md:items-center"
      >
        <Typography variant="h5" color="black">
          Top 3 Sales by Central
        </Typography>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}


