import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import Chart from "react-apexcharts";
import Loading from "../layout/Loading";
import { ChevronDown } from "lucide-react";

export default function SalesByRestaurant() {
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState("All");
  const [chartSeries, setChartSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
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
  
  // Filter stores based on search term
  const filteredStores = storeData.filter(store => 
    (store.central_store_name + store.store_name)
      .toLowerCase()
      .replace(/[:\s]/g, "")  
      .includes(searchTerm.toLowerCase().replace(/\s/g, ""))  
  );
  
  const selectStore = (userId, storeName) => {
    setSelectedStore(storeName);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const fetchStoreMonthly = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        "admin/dashboard/sales-by-restaurant"
      );
      if (response.status === 200) {
        const array = Object.values(response.data.data);
        setStoreData(array);
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
    <Card className="rounded-none border shadow-none">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="overflow flex flex-col gap-4 overflow-visible rounded-none md:flex-row md:items-center"
      >
        <div className="flex-grow overflow-visible">
          <Typography color="black" variant="h5" className="min-w-[350px]">
            Sales by Restaurant
          </Typography>
          <Typography>{selectedStore}</Typography>
        </div>
      
        <div className="relative" ref={dropdownRef}>
          <Input 
            inputRef={inputRef}
            label={selectedStore}
            icon={<ChevronDown onClick={handleInputClick} className="cursor-pointer" />}
            placeholder={selectedStore} 
            value={searchTerm} 
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            className="cursor-pointer"
          />
          
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div 
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => selectStore("All", "All")}
                >
                  All
                </div>
                <hr className="my-1" />
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <div 
                      key={store.id}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => selectStore(store.id, store.store_name)}
                    >
                      {store.central_store_name + ":" + store.store_name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No matching stores found</div>
                )}
              </div>
            </div>
          )}
        </div>
      
      </CardHeader>
      <CardBody className="px-2 pb-0">
        {loading ? (
          <Loading />
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