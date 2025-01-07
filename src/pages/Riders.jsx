import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Typography, Input, Button, Spinner, IconButton } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import DetailsCard from '../components/RidersPage/OrderDetailsCard';
import Pagination from '../components/RidersPage/Pagination';
import RiderDetails from '../components/RidersPage/RiderDetailsCard';
import MapCard from '../components/RidersPage/MapCard';
import Loading from "../components/layout/Loading";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import useDebounce from "../components/UseDebounce";
import axiosClient from '../axiosClient';

export default function Riders() {
  const { riderId } = useParams();
  const navigate = useNavigate();
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cache, setCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(true);
  const [riderOrders, setRiderOrders] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ridersPerPage] = useState(8); // Number of riders per page

  // Debouncing
  const debouncedSearchQuery = useDebounce({ value: searchQuery });

  const fetchRiders = useCallback(async () => {
    const cacheKey = 'riders';

    if (cache[cacheKey]) {
      setRiders(cache[cacheKey].data);
      setIsLoading(false);
      setSearchLoading(false);
      return;
    }
    try {
      const response = await axiosClient.get('/admin/riders');
      setSearchLoading(true);
      
      if (response.status === 200) {
        const ridersData = response.data.data;
        setRiders(ridersData);
        setIsLoading(false);

        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: { data: ridersData },
        }));
      }
    } catch (error) {
      setError('Failed to fetch riders');
      setIsLoading(false);
      setSearchLoading(false);
    }
  }, [cache]);

  const fetchRiderOrder = async (riderId) => {
    try {
      const response = await axiosClient.get('/admin/riders/order', {
        params: { id: riderId },
      });
  
      if (response.status === 200) {
        const orders = response.data.data;
        setRiderOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch rider orders:', error);
      setError('Failed to fetch rider orders');
    }
  };

  useEffect(() => {
    fetchRiders();
    fetchRiderOrder();
    
    if (selectedRider) {
      fetchRiderOrder(selectedRider.id);
    }

  }, [fetchRiders, debouncedSearchQuery]);

  useEffect(() => {
    const filtered = riders.filter(rider => {
      const riderFullName = `${rider.first_name} ${rider.last_name}` || '';
      return riderFullName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    });
    setFilteredRiders(filtered);
  
    if (riderId) {
      const foundRider = riders.find(rider => rider.id === parseInt(riderId));
      setSelectedRider(foundRider || (riders.length > 0 ? riders[0] : null));
    } else if (riders.length > 0) {
      setSelectedRider(riders[0]);
    }
  }, [riderId, debouncedSearchQuery, riders]); 

  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
    navigate(`/riders/${rider.id}?search=${searchQuery}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams({ search: query });
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Pagination logic
  const indexOfLastRider = currentPage * ridersPerPage;
  const indexOfFirstRider = indexOfLastRider - ridersPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstRider, indexOfLastRider);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <div className='bg-gray-100 w-full'>
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Left side - Rider List */}
            <div className="h-auto lg:h-[89dvh] lg:w-[340px] bg-white rounded-lg border border-gray-300 py-4">
              <Typography variant="h5" className="font-semibold text-black ml-4">All Riders</Typography>
              <div className="w-full p-2 mb-2">
                <Input
                  label="Search riders..."
                  icon={
                    searchLoading || isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )
                  }
                  size="md"
                  className="bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {currentRiders.length === 0 ? (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    No riders available.
                  </Typography>
                </div>
              ) : (
                currentRiders.map((rider) => (
                  <div
                    key={rider.id}
                    onClick={() => handleRiderSelect(rider)}
                    className={`transition-colors duration-300 ${selectedRider?.id === rider.id ? "border border-blue-500" : ""}`}
                  >
                    <RiderCard rider={rider} />
                  </div>
                ))
              )}

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                paginate={paginate}
                indexOfLastRider={indexOfLastRider}
                filteredRiders={filteredRiders}
                ridersPerPage={ridersPerPage}
              />

            </div>

            {/* Right side - Rider Details */}
            <div className="w-full bg-white h-[89dvh] overflow-y-auto rounded-lg border border-gray-300 p-4">
              {isLoading ? (
                <div className="flex items-center justify-center overflow-y-hidden">
                  <Loading />
                </div>
              ) : (
                <div className="">
                  <Typography variant="h5" className="text-black mb-4">Rider Details</Typography>
                  {selectedRider ? (
                    <RiderDetails rider={selectedRider} />
                  ) : (
                    <div className="text-center py-8">
                      <Typography color="gray" className="font-medium">
                        No rider selected.
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}