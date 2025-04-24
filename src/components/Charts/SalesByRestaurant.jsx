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
  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [monthlySalesPerStore, setMonthlySalesPerStore] = useState([]);
  const [selectedStore, setSelectedStore] = useState("All");
  const [selectedStoreId, setSelectedStoreId] = useState(null);
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
  const [chartSeries, setChartSeries] = useState( [

    
    {
      name: 'Sales by Month', 
      data: monthlyData.map((entry) => ({
        x: entry.month, 
        y: Math.trunc(entry.total_sales), 
        fillColor: "#612B9B", 
        strokeColor: "blue", 
      }))
    }
  ]);

  const selectStore = (storeId, storeName, storeBranch) => {
    setSelectedStoreId(storeId);
    storeName === "All"?setSelectedStore(storeName):setSelectedStore(`${storeBranch} ${storeName}`)
    setSearchTerm("");
    setIsDropdownOpen(false);
  
    if (storeId === "All") {
      fetchMonthlyData(); 
    } else {
      fetchMonthlyPerStore(storeId); 
    }

  };
  
  const filteredStores = storeData.filter((store) =>
    (store.store_branch + store.store_name)
      .toLowerCase()
      .replace(/[:\s]/g, "")
      .includes(searchTerm.toLowerCase().replace(/\s/g, ""))
  );
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
    const allMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const dataToMap = selectedStore === "All" ? monthlyData : monthlySalesPerStore;
  
    const currentYear = new Date().getFullYear();
  
    const filtered = dataToMap.filter(entry => {
      const date = new Date(entry.date || entry.month);
      return date.getFullYear() === currentYear;
    });
  
    const monthlyTotals = Array(12).fill(0);
  
    filtered.forEach(entry => {
      const date = new Date(entry.date || entry.month);
      const monthIndex = date.getMonth(); 
      monthlyTotals[monthIndex] += Math.trunc(entry.total_sales);
    });
  
    const chartData = allMonths.map((month, i) => ({
      x: month,
      y: monthlyTotals[i] ?? 0,
      fillColor: "#612B9B",
      strokeColor: "blue",
    }));
  
    setChartSeries([
      {
        name: "Sales by Month",
        data: chartData,
      },
    ]);
  }, [monthlyData, monthlySalesPerStore, selectedStore]);
  
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

  
  useEffect(()=>{
    fetchStoreMonthly();
    fetchMonthlyData();

  },[selectedStoreId,selectedStore])

  const fetchStoreMonthly = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        "admin/dashboard/sales-by-restaurant"
      );
      if (response.status === 200) {
        const arrayStore = Object.values(response.data.data);
        setStoreData(arrayStore);
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

  const fetchMonthlyPerStore = async (selectedStoreId) => {
    const response = await axiosClient.get(
      `admin/dashboard/montlySalesPerStore?store_id=${selectedStoreId}`
    );
    setMonthlySalesPerStore(response.data);
  };
  
  const fetchMonthlyData = async () => {
    try {
      const response = await axiosClient.get("admin/dashboard/allStoreSales");
      setMonthlyData(response.data);
    } catch (e) {
      e.error;
    }
  };

  return (
    <Card className="max-w-[375px] rounded-none border shadow-none sm:max-w-none">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        flex-
        className="overflow flex flex-col gap-4 overflow-visible rounded-none sm:flex-col md:flex-col md:items-center lg:flex-row"
      >
        <div className="flex-grow overflow-visible">
          <Typography color="black" variant="h5" className="min-w-[350px]">
            Sales by {selectedStore}
          </Typography>
          <Typography>{selectedStore}</Typography>
        </div>

        <div className="relative" ref={dropdownRef}>
          <Input
            inputRef={inputRef}
            label={selectedStore}
            icon={
              <ChevronDown
                onClick={handleInputClick}
                className="cursor-pointer"
              />
            }
            placeholder={selectedStore}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            className="cursor-pointer"
          />
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto overflow-x-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                 onClick={()=>selectStore("All", "All")}
                >
                  All
                </div>
                <hr className="my-1" />
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        selectStore(store.id, store.store_name, store.store_branch);
                        
                      }}
                    >
                      {store.store_branch + ":" + store.store_name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No matching stores found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        {loading ? (
          <div className="min-h-[50px]">
            <Loading height={"min-h-[271px]"} />
          </div>
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
