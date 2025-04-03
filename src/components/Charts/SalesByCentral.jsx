import React from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const centralStores = ["GravyBaby", "SouthernRock", "Shucked"];
const colors = ['#800080', '#800000', '#FFDB58']; // Purple, Maroon, Mustard

const chartConfig = {
    type: "bar",
    height: 240,
    series: [
        {
            name: "Sales",
            data: [50, 40, 80],
            color: undefined, // Do not set the color here, set it in the chart options
        },
    ],
    options: {
        chart: {
            toolbar: { show: false },
        },
        title: { show: false },
        dataLabels: {
            enabled: true,
            formatter: (val, { dataPointIndex }) => `${centralStores[dataPointIndex]} ${val}`,
            position: "inside",
            style: {
                colors: ["white"],
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
            categories: centralStores,
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: {
                style: {
                    colors: ["#000000", "#000000", "#000000"], // Set x-axis label color to black (or as you want)
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
    // Apply colors to the bars here
    colors: colors, // This sets the colors for each bar
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
                <Typography variant="h5" color='black'>Sales by Central</Typography>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
            </CardBody>
        </Card>
    );
}
