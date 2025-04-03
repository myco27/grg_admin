import React from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

const centralStores = ['GravyBaby', 'SouthernRock', 'Shucked']
const chartConfig = {
    type: "bar",
    height: 240,
    series: [
        {
            name: 'Sales',
            data: [50, 40, 80],
        },
      
    ],
    options: {
        chart: {
            color:"purple",
            toolbar: {
                show: false,
            },
        },
        title: {
            show: "",
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, { dataPointIndex }) {
                return `${centralStores[dataPointIndex]} ${val}`;
            },
            position: "inside",
            style: {
                colors: ["white"],
                fontSize: "14px",
                fontWeight: "bold",
            },
        },
        plotOptions: {
            bar: {
                color:"purple",
                horizontal: true,
                columnWidth: "40%",
                borderRadius: 2,
            },
        },
        xaxis: {
            max: 100,
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            labels: {
                show:false,
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
            categories: centralStores, // Using custom categories (store names)
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 0,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 5,
                right: 20,
            },
        },
        fill: {
            opacity: 0.8,
        },
        tooltip: {
            theme: "dark",
        },
    },
};

export default function SalesByCentral() {
    return (
        <Card className='min-w-[412px]'>
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col rounded-none md:flex-row md:items-center"
            >
                <Typography variant='h5'>Sales by Central</Typography>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
            </CardBody>
        </Card>
    )
}
