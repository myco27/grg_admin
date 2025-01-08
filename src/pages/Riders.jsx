import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Typography, Input, Button, Spinner, IconButton } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import DetailsCard from '../components/RidersPage/OrderDetailsCard';
import Pagination from '../components/RidersPage/RiderPagination';
import OrdersPagination from '../components/RidersPage/OrdersPagination';
import RiderDetails from '../components/RidersPage/RiderDetailsCard';
import Loading from "../components/layout/Loading";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import useDebounce from "../components/UseDebounce";
import axiosClient from '../axiosClient';

export default function Riders() {
  // Router and navigation hooks
  const { riderId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for riders and orders
  const [riders, setRiders] = useState([]);
  const [riderOrders, setRiderOrders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);

  // State for filtered data
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Search query states
  const [riderSearchQuery, setRiderSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ridersPerPage] = useState(9); // Riders per page
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [ordersPerPage] = useState(3); // Orders per page

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(true);

  // Cache for API responses
  const [cache, setCache] = useState({});

  // Debounced search queries
  const debouncedRiderSearchQuery = useDebounce({ value: riderSearchQuery });
  const debouncedOrderSearchQuery = useDebounce({ value: orderSearchQuery });

  // Pagination logic for riders
  const indexOfLastRider = currentPage * ridersPerPage;
  const indexOfFirstRider = indexOfLastRider - ridersPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstRider, indexOfLastRider);
  const paginateRiders = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic for orders
  const indexOfLastOrder = currentOrdersPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const paginateOrders = (pageNumber) => setCurrentOrdersPage(pageNumber);

  // Fetch riders from API
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

  // Fetch rider orders from API
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

  // Fetch riders and orders when component mounts or selected rider changes
  useEffect(() => {
    fetchRiders();

    if (selectedRider) {
      fetchRiderOrder(selectedRider.id);
    }
  }, [fetchRiders, selectedRider]);

  // Filter riders based on search query
  useEffect(() => {
    const filtered = riders.filter(rider => {
      const riderFullName = `${rider.first_name} ${rider.last_name}`;
      return riderFullName.toLowerCase().includes(debouncedRiderSearchQuery.toLowerCase());
    });
    setFilteredRiders(filtered);

    if (riderId) {
      const foundRider = riders.find(rider => rider.id === parseInt(riderId));
      setSelectedRider(foundRider || (riders.length > 0 ? riders[0] : null));
    } else if (riders.length > 0) {
      setSelectedRider(riders[0]);
    }
  }, [riderId, debouncedRiderSearchQuery, riders]);

  // Filter orders based on search query
  useEffect(() => {
    const filtered = riderOrders.filter(order => {
      return order.order_id.toString().includes(debouncedOrderSearchQuery.toLowerCase());
    });
    setFilteredOrders(filtered);
  }, [debouncedOrderSearchQuery, riderOrders]);

  // Handle rider selection
  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
    navigate(`/riders/${rider.id}?search=${riderSearchQuery}`);
  };

  // Handle search input for riders
  const handleSearchRider = (e) => {
    const query = e.target.value;
    setRiderSearchQuery(query);
    setSearchParams({ search: query });
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle search input for orders
  const handleSearchOrder = (e) => {
    const query = e.target.value;
    setOrderSearchQuery(query);
    setCurrentOrdersPage(1); // Reset to the first page when searching
  };

  return (
    <Fragment>
      <div className='bg-gray-100 w-full'>
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Left side - Rider List */}
            <div className="h-auto lg:h-[89dvh] lg:w-[340px] bg-white rounded-lg border border-gray-300 py-4">
              <Typography variant="h5" className="font-semibold text-black ml-4">All Riders</Typography>
              <div className="w-full p-2 mb-2">
                {/* Search input for Riders */}
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
                  value={riderSearchQuery}
                  onChange={handleSearchRider}
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

              {/* Pagination Controls for Riders */}
              <Pagination
                currentPage={currentPage}
                paginate={paginateRiders}
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
                  <Typography variant="h5" className="text-black mb-4">Details</Typography>
                  {selectedRider ? (
                    <div>
                      <RiderDetails rider={selectedRider} />
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <Typography variant="h5" className="text-black mb-2 md:mb-4 mt-8">
                          Orders
                        </Typography>
                        <div className="w-[240px] mb-4 md:mb-0">
                          {/* Search input for Orders */}
                          <Input
                            label="Search orders..."
                            icon={
                              searchLoading || isLoading ? (
                                <Spinner className="h-5 w-5" />
                              ) : (
                                <Search className="h-5 w-5" />
                              )
                            }
                            size="md"
                            className="bg-white"
                            value={orderSearchQuery}
                            onChange={handleSearchOrder}
                          />
                        </div>
                      </div>

                      {currentOrders.length > 0 ? (
                        currentOrders.map((order) => (
                          <DetailsCard key={order.order_id} order={order} /> // Show orders map if there are orders
                        ))
                      ) : (
                        <Typography color="gray" className="font-medium text-center mt-4">
                          No orders found for this rider.
                        </Typography>
                      )}

                      {/* Pagination Controls for Orders */}
                      {currentOrders.length > 0 && (
                        <OrdersPagination
                          currentPage={currentOrdersPage}
                          paginate={paginateOrders}
                          indexOfLastOrder={indexOfLastOrder}
                          filteredOrders={filteredOrders}
                          ordersPerPage={ordersPerPage}
                        />
                      )}
                    </div>
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