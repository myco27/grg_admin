import React, { useState, useEffect, Fragment } from 'react';
import Footer from "../components/Footer"
import { Typography, Input } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import DetailsCard from '../components/RidersPage/OrderDetailsCard';
import RiderDetails from '../components/RidersPage/RiderDetailsCard';
import MapCard from '../components/RidersPage/MapCard';
import ordersData from '../data/orders.json';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from "lucide-react";

export default function Riders() {
  const { riderName } = useParams(); 
  const navigate = useNavigate();
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uniqueRiders = ordersData.orders.reduce((acc, order) => {
      const rider = order.riderData[0];
      if (rider && !acc.find(r => r.name === rider.name)) {
        acc.push(rider);
      }
      return acc;
    }, []);
    setRiders(uniqueRiders);
  
    const urlSearchQuery = searchParams.get('search') || '';
    setSearchQuery(urlSearchQuery);
  
    const filtered = uniqueRiders.filter(rider => {
      const riderNameMatch = rider.name.toLowerCase().includes(urlSearchQuery.toLowerCase());
      const orderMatch = ordersData.orders.some(order =>
        order.riderData[0]?.name === rider.name &&
        (order.id.toString().includes(urlSearchQuery) ||
          order.status.toLowerCase().includes(urlSearchQuery.toLowerCase()))
      );
      return riderNameMatch || orderMatch;
    });
    setFilteredRiders(filtered);
  
    if (riderName) {
      const foundRider = uniqueRiders.find(rider => rider.name === riderName);
      setSelectedRider(foundRider || (uniqueRiders.length > 0 ? uniqueRiders[0] : null));
    } else if (uniqueRiders.length > 0) {
      setSelectedRider(uniqueRiders[0]);
    }
  }, [riderName, searchParams]);

  useEffect(() => {
    const filtered = riders.filter(rider => {
      const riderNameMatch = rider.name.toLowerCase().includes(searchQuery.toLowerCase());
      const orderMatch = ordersData.orders.some(order =>
        order.riderData[0]?.name === rider.name &&
        (order.id.toString().includes(searchQuery) ||
          order.status.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return riderNameMatch || orderMatch;
    });
    setFilteredRiders(filtered);
    if (selectedRider && !filtered.find(rider => rider.name === selectedRider.name)) {
      setSelectedRider(null);
    }
  }, [searchQuery, riders, selectedRider]);

  const ordersForSelectedRider = ordersData.orders.filter(order =>
    selectedRider && order.riderData[0]?.name === selectedRider.name
  );

  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
    navigate(`/riders/${rider.name}?search=${searchQuery}`); 
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams({ search: query }); 
  };

  return (
    <Fragment>
      <div className='bg-gray-100 w-full'>
        <div className="mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Rider List */}
            <div className="h-[89dvh] overflow-y-auto lg:w-[340px] bg-white rounded-lg border border-gray-300 py-4">
              <Typography variant="h5" className="font-semibold text-black ml-4">All Riders</Typography>
              <div className="w-full p-2 mb-2">
                <Input
                  label="Search orders..."
                  icon={<Search className="h-5 w-5" />}
                  size="md"
                  className="bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {filteredRiders.map((rider) => {
                const order = ordersData.orders.find(order => order.riderData[0]?.name === rider.name);
                return (
                  <div
                    key={rider.name}
                    onClick={() => handleRiderSelect(rider)}
                    className={`transition-colors duration-300 ${selectedRider?.name === rider.name ? "border border-blue-500" : ""}`}
                  >
                    <RiderCard rider={rider} order={order} />
                  </div>
                )
              })}
              {filteredRiders.length === 0 && (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    No riders available.
                  </Typography>
                </div>
              )}
            </div>

            {/* Right side - Order Details */}
            <div className="w-full">
              {selectedRider ? (
                <div className="h-[89dvh] overflow-y-auto bg-white rounded-lg border border-gray-300 p-4">
                  {ordersForSelectedRider.length > 0 ? (
                    <>
                      <Typography variant='h5' className='text-black mb-2'>Rider Details</Typography>
                      <RiderDetails className="mb-4" order={ordersForSelectedRider[0]} />
                      <div className="h-px bg-gray-300 mb-6 mt-8" />
                      {ordersForSelectedRider.map(order => (
                        <div key={order.id}>
                          <Typography variant='h5' className='text-black mb-2'>Order Details: {order.index}</Typography>
                          <DetailsCard order={order} />
                          <Typography variant='h5' className='text-black mb-2'>Map Overview</Typography>
                          <MapCard order={order} />
                          <div className="h-px bg-gray-300 mb-6 mt-8" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Typography color="gray" className="font-medium">
                        No orders for this rider.
                      </Typography>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    Select a rider to view details
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </Fragment>
  );
}