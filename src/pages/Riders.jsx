import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Typography, Input, Spinner } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import OrderDetailsCard from '../components/RidersPage/OrderDetailsCard';
import RiderPagination from '../components/RidersPage/RiderPagination';
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

  // Search query states
  const [riderSearchQuery, setRiderSearchQuery] = useState(searchParams.get('riderSearch') || '');
  const [orderSearchQuery, setOrderSearchQuery] = useState(searchParams.get('orderSearch') || '');
  const debouncedRiderSearchQuery = useDebounce({ value: riderSearchQuery });
  const debouncedOrderSearchQuery = useDebounce({ value: orderSearchQuery });

  // Pagination states
  const [currentRiderPage, setCurrentRiderPage] = useState(parseInt(searchParams.get('riderPage')) || 1);
  const [lastRiderPage, setLastRiderPage] = useState(null);

  // Order Pagination states
  const [currentOrdersPage, setCurrentOrdersPage] = useState(parseInt(searchParams.get('orderPage')) || 1);
  const [lastOrderPage, setLastOrderPage] = useState(null);
  const [ordersPerPage, setOrdersPerPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Cache for API responses
  const [cache, setCache] = useState({});

  // Pagination logic for riders
  const paginateRiders = (pageNumber) => setCurrentRiderPage(pageNumber);
  const [totalRiders, setTotalRiders] = useState(0);

  // Pagination logic for orders
  const paginateOrders = (pageNumber) => setCurrentOrdersPage(pageNumber);

  // Fetch riders from API with search query and pagination
  const fetchRiders = useCallback(async () => {
    const cacheKey = `riders-${debouncedRiderSearchQuery}-${currentRiderPage}`;
  
    if (cache[cacheKey]) {
      setRiders(cache[cacheKey].data);
      setTotalRiders(cache[cacheKey].total);
      setLastRiderPage(cache[cacheKey].lastRiderPage);
      setIsLoading(false);
      setSearchLoading(false);
      return;
    }
  
    try {
      setSearchLoading(true);
      const response = await axiosClient.get('/admin/riders', {
        params: { 
          search: debouncedRiderSearchQuery,
          page: currentRiderPage,
        },
      });
  
      if (response.status === 200) {
        const ridersData = response.data.data;
        setRiders(ridersData.data);
        setTotalRiders(ridersData.total);
        setLastRiderPage(ridersData.last_page);
        setIsLoading(false);
  
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: { data: ridersData.data, total: ridersData.total, lastRiderPage: ridersData.last_page },
        }));
      }
    } catch (error) {
      setError('Failed to fetch riders');
      setIsLoading(false);
    } finally {
      setSearchLoading(false);
    }
  }, [debouncedRiderSearchQuery, currentRiderPage, cache]);

  // Fetch rider orders from API with search and pagination
  const fetchRiderOrder = useCallback(async (riderId, page = currentOrdersPage, search = orderSearchQuery) => {
    const cacheKey = `rider-orders-${riderId}-${page}-${search}`;

    if (cache[cacheKey]) {
      setRiderOrders(cache[cacheKey].data);
      setLastOrderPage(cache[cacheKey].lastOrderPage);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axiosClient.get('/admin/riders/order', {
        params: { 
          id: riderId,
          page: currentOrdersPage,
          search: search,
        },
      });

      if (response.status === 200) {
        const orders = response.data.data;
        setRiderOrders(orders);
        setLastOrderPage(orders.last_page);
        setOrdersPerPage(orders.per_page);
        setTotalOrders(orders.total);

        // Update the cache with the new data
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: { data: orders, lastOrderPage: orders.last_page },
        }));

      }
    } catch (error) {
      console.error('Failed to fetch rider orders:', error);
      setError('Failed to fetch rider orders');
    }

  },[cache]);

  // Fetch riders when component mounts or selected rider changes
  useEffect(() => {
    fetchRiders()
  }, [fetchRiders]) 

  // Validate rider ID from URL params  
  useEffect(() => {
    if (riderIdFromParams) {
      const isValidId = /^\d+$/.test(riderIdFromParams); // Check if ID is a valid number
      
      if (!isValidId) {
        navigate('/notfound');
        return;
      }
  
      // Check if the selected rider is in the current list of riders
      const rider = riders.find((rider) => rider.id === parseInt(riderIdFromParams));
      if (!rider) {
        // If the rider is not found, set selected rider to null
        setSelectedRider(null);
        return;
      }
  
      // If the rider is found, set it as the selected rider
      setSelectedRider(rider);
      fetchRiderOrder(rider.id, currentOrdersPage, debouncedOrderSearchQuery);
    }
  }, [riderIdFromParams, riders, navigate, fetchRiderOrder, currentOrdersPage, debouncedOrderSearchQuery]);

  // Handle changes in the riders list
  useEffect(() => {
    if (selectedRider) {
      // Check if the selected rider is still in the current list of riders
      const rider = riders.find((rider) => rider.id === selectedRider.id);
      if (!rider) {
        // If the rider is not in the list, clear the selection
        setSelectedRider(null);
      }
    }
  }, [riders, selectedRider]);

  // Validate pagination from URL params
  useEffect(() => {
    const riderPage = parseInt(searchParams.get('riderPage'));
    const orderPage = parseInt(searchParams.get('orderPage'));
  
    // Early return if lastRiderPage or lastOrderPage is not yet available
    if (lastRiderPage === null || lastOrderPage === null) {
      return;
    }
  
    // Validate if riderPage or orderPage is invalid (NaN or less than 1)
    if (
      (riderPage && (isNaN(riderPage) || riderPage < 1)) ||
      (orderPage && (isNaN(orderPage) || orderPage < 1))
    ) {
      navigate('/notfound');
      return;
    }
  
    // Validate against last page numbers
    if (
      (riderPage && riderPage > lastRiderPage) ||
      (orderPage && orderPage > lastOrderPage)
    ) {
      navigate('/notfound');
      return;
    }
  }, [searchParams, lastRiderPage, lastOrderPage, navigate]);

  // Validate URL query parameters
  useEffect(() => {
    const validParams = ['riderSearch', 'riderPage', 'orderPage', 'orderSearch'];
    const currentParams = Array.from(searchParams.keys());
    
    // Check for invalid parameter names
    const hasInvalidParams = currentParams.some(param => !validParams.includes(param));
    
    // Validate numeric parameters
    const riderPage = parseInt(searchParams.get('riderPage'));
    const orderPage = parseInt(searchParams.get('orderPage'));
    
    const isInvalidNumber = (num) => isNaN(num) || num < 1;
    const hasInvalidPages = 
      (searchParams.has('riderPage') && isInvalidNumber(riderPage)) ||
      (searchParams.has('orderPage') && isInvalidNumber(orderPage));

    if (hasInvalidParams || hasInvalidPages) {
      navigate('/notfound');
      return;
    }
  }, [searchParams, navigate]);

  // Refresh page when back button is pressed
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle rider selection
  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
    const params = new URLSearchParams(searchParams);
    params.set('riderSearch', riderSearchQuery);
    params.set('riderPage', currentRiderPage);
    params.set('orderSearch', orderSearchQuery);
    params.set('orderPage', currentOrdersPage);
    navigate(`/riders/${rider.id}?${params.toString()}`);
  };
  

  // Handle search input for riders
  const handleSearchRider = (e) => {
    const query = e.target.value;
    setRiderSearchQuery(query);
    setSearchParams({ riderSearch: query, riderPage: 1 });
    setCurrentRiderPage(1);
  };

  // Handle search input for orders
  const handleSearchOrder = (e) => {
    const query = e.target.value;
    setOrderSearchQuery(query);
    setCurrentOrdersPage(1);
  };

  return (
    <Fragment>
      <div className='bg-gray-100 w-full'>
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Rider List */}
            <div className="h-auto lg:h-[89dvh] lg:w-[340px] bg-white rounded-lg overflow-y-auto border border-gray-300 py-4">
              <Typography variant="h5" className="font-semibold text-black ml-4">All Riders</Typography>
              <div className="w-full px-2 py-1 mb-2">
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
              <RiderPagination
                currentPage={currentRiderPage}
                paginate={paginateRiders}
                totalRiders={totalRiders}
                lastPage={lastRiderPage}
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

                      {riderOrders.data && riderOrders.data.length > 0 ? (
                        riderOrders.data.map((order) => (
                          <OrderDetailsCard key={order.order_id} order={order} />
                        ))
                      ) : (
                        <Typography color="gray" className="font-medium text-center mt-4">
                          No orders found for this rider.
                        </Typography>
                      )}

                      {/* Pagination Controls for Orders */}
                      {riderOrders.data && riderOrders.data.length > 0 && (
                        <OrdersPagination
                          currentPage={currentOrdersPage}
                          paginate={paginateOrders}
                          lastPage={riderOrders.last_page}
                          totalOrders={totalOrders}
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