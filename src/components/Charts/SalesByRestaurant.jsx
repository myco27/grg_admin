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
    height: 240,
          
    series: [
        {
          name: 'Actual',
          data: [
            {
              x: 'Bangsar',
              y: 10,
              goals: [
                {
                  name: 'Expected',
                  value: 10,
                  strokeWidth: 10,
                  strokeColor: 'purple'
                }
              ]
            },
            {
              x: 'KLCC',
              y: 44,
              goals: [
                {
                  name: 'Expected',
                  value: 54,
                  strokeWidth: 10, 
                  strokeHeight: 2,
                  strokeColor: 'purple'
                }
              ]
            },
            {
              x: 'Changkat',
              y: 54,
              goals: [
                {
                  name: 'Expected',
                  value: 52,
                  strokeWidth: 10, 
                  strokeHeight: 2 ,
                  strokeLineCap: 'round',
                  strokeColor: 'purple'
                }
              ]
            },
            {
              x: 'Damansara',
              y: 66,
              goals: [
                {
                  name: 'Expected',
                  value: 61,
                  strokeWidth: 10, 
                  strokeHeight: 2 ,
                  strokeLineCap: 'round',
                  strokeColor: 'purple'
                }
              ]
            },
            {
              x: 'Ramlee',
              y: 81,
              goals: [
                {
                  name: 'Expected',
                  value: 66,
                  strokeWidth: 10, 
                  strokeHeight: 2,
                  strokeLineCap: 'round',
                  strokeColor: 'purple'
                }
              ]
            },
            {
              x: 'Melaka',
              y: 67,
              goals: [
                {
                  name: 'Expected',
                  value: 70,
                  strokeWidth: 10, 
                  strokeHeight: 2,
                  strokeColor: 'purple'
                }
              ]
            },
            {
                x: 'Sunway',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              },
              {
                x: 'Queens bay',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              },
              {
                x: 'Auto City',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              }
              ,{
                x: 'Chulia',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              },
              {
                x: 'Gurney',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              },
              {
                x: 'Batu',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 10, 
                    strokeHeight: 2,
                    strokeColor: 'purple'
                  }
                ]
              }
          ]
        }
      ],
      options: {
        chart: {
          height: 1000,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            columnWidth:'25',
            horizontal: false,
          }
        },
        colors: ['violet'],
        },
      
        
      }
    
    


export default function SalesByRestaurant() {
    return (
        <Card>
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
                <Typography variant="h5">Sales by Restaurant</Typography>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
            </CardBody>
        </Card>
    );
}
