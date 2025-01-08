import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Typography, Input, Spinner } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import DetailsCard from '../components/RidersPage/OrderDetailsCard';
import Pagination from '../components/RidersPage/RiderPagination';
import OrdersPagination from '../components/RidersPage/OrdersPagination';
import RiderDetails from '../components/RidersPage/RiderDetailsCard';
import Loading from "../components/layout/Loading";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from "lucide-react";
import useDebounce from "../components/UseDebounce";
import axiosClient from '../axiosClient';

export default function Riders() {
  // Router and navigation hooks
  const { riderId: riderIdFromParams } = useParams(); // Get riderId from URL params
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for riders and orders
  const [riders, setRiders] = useState([]);
  const [riderOrders, setRiderOrders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);

  // State for filtered orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Reintroduce filteredOrders state

  // Search query states
  const [riderSearchQuery, setRiderSearchQuery] = useState(searchParams.get('search') || '');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const debouncedRiderSearchQuery = useDebounce({ value: riderSearchQuery });
  const debouncedOrderSearchQuery = useDebounce({ value: orderSearchQuery }); // Add debounced order search query

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ridersPerPage] = useState(9); // Riders per page
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [ordersPerPage] = useState(3); // Orders per page

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Cache for API responses
  const [cache, setCache] = useState({});

  // Pagination logic for riders
  const paginateRiders = (pageNumber) => setCurrentPage(pageNumber);
  const [totalRiders, setTotalRiders] = useState(0);

  // Pagination logic for orders
  const indexOfLastOrder = currentOrdersPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder); // Use filteredOrders for pagination
  const paginateOrders = (pageNumber) => setCurrentOrdersPage(pageNumber);

  // Fetch riders from API with search query
  const fetchRiders = useCallback(async () => {
    const cacheKey = `riders-${debouncedRiderSearchQuery}-${currentPage}`;

    if (cache[cacheKey]) {
      setRiders(cache[cacheKey].data);
      setTotalRiders(cache[cacheKey].total); // Ensure totalRiders is updated from cache
      setIsLoading(false);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axiosClient.get('/admin/riders', {
        params: { 
          search: debouncedRiderSearchQuery,
          page: currentPage,
          page_size: ridersPerPage,
        },
      });

      if (response.status === 200) {
        const ridersData = response.data.data;
        setRiders(ridersData.data); // Update this line to match the server response structure
        setTotalRiders(ridersData.total); // Update total number of riders
        setIsLoading(false);

        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: { data: ridersData.data, total: ridersData.total }, // Ensure total is stored in cache
        }));
      }
    } catch (error) {
      setError('Failed to fetch riders');
      setIsLoading(false);
    } finally {
      setSearchLoading(false);
    }
  }, [debouncedRiderSearchQuery, currentPage, ridersPerPage, cache]);

  // Fetch rider orders from API
  const fetchRiderOrder = async (riderId) => {
    try {
      const response = await axiosClient.get('/admin/riders/order', {
        params: { id: riderId },
      });

      if (response.status === 200) {
        const orders = response.data.data;
        setRiderOrders(orders);
        setFilteredOrders(orders); // Initialize filteredOrders with fetched orders
      }
    } catch (error) {
      console.error('Failed to fetch rider orders:', error);
      setError('Failed to fetch rider orders');
    }
  };

  // Fetch riders and orders when component mounts or selected rider changes
  useEffect(() => {
    fetchRiders();

    // Restore selected rider from URL params
    if (riderIdFromParams) {
      const rider = riders.find((rider) => rider.id === parseInt(riderIdFromParams));
      if (rider) {
        setSelectedRider(rider);
        fetchRiderOrder(rider.id);
      }
    }
  }, [fetchRiders, riderIdFromParams, riders]);

  // Filter orders based on search query
  useEffect(() => {
    const filtered = riderOrders.filter(order => {
      return order.order_id.toString().includes(debouncedOrderSearchQuery.toLowerCase());
    });
    setFilteredOrders(filtered);
    setCurrentOrdersPage(1); // Reset to the first page when filtering
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
    setSearchParams({ search: query }); // Update URL search params
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle search input for orders
  const handleSearchOrder = (e) => {
    const query = e.target.value;
    setOrderSearchQuery(query);
  };

  return (
    <Fragment>
      <div className='bg-gray-100 w-full'>
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Rider List */}
            <div className="h-auto lg:h-[89dvh] lg:w-[340px] bg-white rounded-lg overflow-y-auto border border-gray-300 py-4">
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
              {riders.length === 0 ? (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    No riders available.
                  </Typography>
                </div>
              ) : (
                riders.map((rider) => (
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
                totalRiders={totalRiders}
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
                          <DetailsCard key={order.order_id} order={order} />
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
                          filteredOrders={filteredOrders} // Use filteredOrders for pagination
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