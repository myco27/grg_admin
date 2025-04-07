import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const chartConfig = {
  type: "line",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [
        [new Date("2024-04-01").getTime(), 50],
        [new Date("2024-04-02").getTime(), 40],
        [new Date("2024-04-03").getTime(), 300],
        [new Date("2024-04-04").getTime(), 320],
        [new Date("2024-04-05").getTime(), 500],
        [new Date("2024-04-06").getTime(), 350],
        [new Date("2024-04-07").getTime(), 200],
        [new Date("2024-04-08").getTime(), 230],
        [new Date("2024-04-09").getTime(), 500],
      ],
    },
  ],
  options: {
    chart: {
      toolbar: { show: false },
    },
    title: { show: false },
    dataLabels: { enabled: false },
    colors: ["purple"],
    stroke: {
      lineCap: "round",
      curve: "straight",
    },
    markers: { size: 0 },
    xaxis: {
      type: "datetime", 
      tickAmount: 5, 
      labels: {
        formatter: (value) => {
          return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          });
        },
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#612B9B",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      padding: { top: 5, right: 20 },
    },
    fill: { opacity: 0.8 },
    tooltip: {
      theme: "light",
      x: {
        format: "MMM dd", // Tooltip format (e.g., "Apr 01")
      },
    },
  },
};


// Component
export default function OrderRate() {
  return (
    <Card className="rounded-none border shadow-none">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex items-center justify-center"
      >
        <Typography variant="h5" className="flex-grow" color='black'>
          Order Rate
        </Typography>
        <div className="flex items-center justify-center gap-5 rounded-md px-4 py-2">
          <div className="flex flex-col items-center">
            <Typography variant="small">Android</Typography>
            <Typography variant="h6">1,123</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Typography variant="small">iOS</Typography>
            <Typography variant="h6">1,123</Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
