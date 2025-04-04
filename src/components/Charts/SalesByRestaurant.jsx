import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import Chart from "react-apexcharts";
import Loading from "../layout/Loading";
import { MenuIcon } from "lucide-react";

export default function SalesByRestaurant() {
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState("All");
  const [chartSeries, setChartSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredList, setFilteredList] = useState([])
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 250,
      zoom: {
        enabled: true,
        type: "xy",
        zoomedArea: {
          background: {
            opacity: 0.4,
            color: "#90CAF9",
          },
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        horizontal: false,
      },
    },
    colors: ["#612B9B"],
    xaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      zoomable: true,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      zoomable: true,
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
      enabled: false,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
  });
  
  const filteredStores = storeData.filter(store => 
    (store.central_store_name + store.store_name)
      .toLowerCase()
      .replace(/[:\s]/g, "")  
      .includes(searchTerm.toLowerCase().replace(/\s/g, ""))  
  );
  
  
  
  

  const getStoreId = (userId,storeName) => {
    console.log("The ID:", userId);
    setSelectedStore(storeName)
  };



  const fetchStoreMonthly = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        "admin/dashboard/sales-by-restaurant"
      );
      if (response.status === 200) {
        const array = Object.values(response.data.data);

        const sortedData = array.sort((a, b) => b.totalSales - a.totalSales);

        const top10Stores = sortedData.slice(0, 10);

        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const formattedData = top10Stores.map((store, index) => ({
          x: months[index % months.length], // This will cycle through months
          y: Math.floor(store.totalSales),
          goals: [
            {
              name: "Expected",
              value: store.totalNetSales,
              strokeWidth: 15,
              strokeColor: "#612B9B4D",
            },
          ],
        }));

        setStoreData(array);
        setFilteredList(array)
        console.log(array);
        setChartSeries([{ name: "Actual", data: formattedData }]);
      }
    } catch (e) {
      console.error(
        "Error fetching data:",
        e.response ? e.response.data : e.message
      );
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStoreMonthly();
  }, []);

  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="flex-grow">
          <Typography  color="black" variant="h5">
            Sales by Restaurant
          </Typography>
          <Typography>{selectedStore}</Typography>
        </div>
        <Menu placement="bottom-start" dismiss={{itemPress:false}}>
          <MenuHandler>
            <Button variant="text" className="text-primary">Menu</Button>
          </MenuHandler>
          <MenuList className="max-h-72">
            <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}label='Search'/>
            <hr className="my-3"></hr>
            <MenuItem onClick={()=>getStoreId("All", "All")}>All</MenuItem>
            <hr className="my-3"></hr>
            {filteredStores.map((store) => (
                
              <MenuItem onClick={() => getStoreId(store.id,store.store_name)} key={store.id}>
                {store.central_store_name +":"+ store.store_name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        {loading ? (
          <Loading></Loading>
        ) : (
          <Chart
            type="bar"
            height={250}
            series={chartSeries}
            options={chartOptions}
          />
        )}
      </CardBody>
    </Card>
  );
}
