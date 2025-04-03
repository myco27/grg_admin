import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

const chartConfig = {
    type: "bar",
    height: 250,
    series: [
        {
            name: "Actual",
            data: [
                { x: "Bangsar", y: 10, goals: [{ name: "Expected", value: 10, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "KLCC", y: 44, goals: [{ name: "Expected", value: 44, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Changkat", y: 54, goals: [{ name: "Expected", value: 54, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Damansara", y: 66, goals: [{ name: "Expected", value: 66, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Ramlee", y: 81, goals: [{ name: "Expected", value: 81, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Melaka", y: 67, goals: [{ name: "Expected", value: 67, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Sunway", y: 67, goals: [{ name: "Expected", value: 67, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Queens bay", y: 67, goals: [{ name: "Expected", value: 67, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Auto City", y: 67, goals: [{ name: "Expected", value: 67, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Chulia", y: 81, goals: [{ name: "Expected", value: 81, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Gurney", y: 92, goals: [{ name: "Expected", value: 92, strokeWidth: 15, strokeColor: "purple" }] },
                { x: "Batu", y: 48, goals: [{ name: "Expected", value: 48, strokeWidth: 15, strokeColor: "purple" }] },
            ],
        },
    ],
    options: {
        chart: {
            height: 1000,
            type: "bar",
        },
        plotOptions: {
            bar: {
                columnWidth: "30",
                horizontal: false,
            },
        },
        colors: ["violet"],
        xaxis: {
            labels: {
                style: {
                    fontSize: "6px", 
                    fontWeight: "bold",
                },
            },
        },
        yaxis: {
            labels: {
                show:false,
                style: {
                    fontSize: "14px", 
                    fontWeight: "bold",
                },
            },
        },
        legend: {
            labels: {
                colors: "#000",
                style: {
                    fontSize: "14px", 
                },
            },
        },
        tooltip: {
            style: {
                fontSize: "14px", 
            },
        },
        dataLabels: {
            enabled:false,
            style: {
                fontSize: "12px", // Change data label font size
                fontWeight: "bold",
            },
        },
    },
};


export default function SalesByRestaurant() {
  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <Typography color='black' variant="h5">Sales by Restaurant</Typography>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
