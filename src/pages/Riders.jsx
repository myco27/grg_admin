import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Typography, Input, Button, Spinner } from "@material-tailwind/react";
import RiderCard from '../components/RidersPage/RiderCard';
import DetailsCard from '../components/RidersPage/OrderDetailsCard';
import RiderDetails from '../components/RidersPage/RiderDetailsCard'; // Import RiderDetails component
import MapCard from '../components/RidersPage/MapCard';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import axiosClient from '../axiosClient';

export default function Riders() {
  const { riderId } = useParams(); // Changed from riderName to riderId
  const navigate = useNavigate();
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cache, setCache] = useState({});
  // const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const fetchRiders = useCallback(
    async () => {
      // Create cache key
      const cacheKey = 'riders';
  
      // Check cache
      if (cache[cacheKey]) {
        setRiders(cache[cacheKey].data);
        // setLoading(false);
        return;
      }
  
      try {
        // setLoading(true);
        const response = await axiosClient.get('/admin/riders');
        
        if (response.status === 200) {
          const ridersData = response.data.data;
  
          // Update state
          setRiders(ridersData);
          // setLoading(false);
  
          // Cache the data
          setCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: { data: ridersData },
          }));
        }
      } catch (error) {
        setError('Failed to fetch riders');
        // setLoading(false);
      }
    },
    [cache], 
  );

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    setSearchQuery(urlSearchQuery);

    // Filter riders based on search query
    const filtered = riders.filter(rider => {
      const riderFullName = `${rider.first_name} ${rider.last_name}` || ''; // Combine first and last name for search
      return riderFullName.toLowerCase().includes(urlSearchQuery.toLowerCase());
    });
    setFilteredRiders(filtered);

    // Set the selected rider based on the URL or default to the first rider
    if (riderId) {
      const foundRider = riders.find(rider => rider.id === parseInt(riderId)); // Match rider by ID
      setSelectedRider(foundRider || (riders.length > 0 ? riders[0] : null));
    } else if (riders.length > 0) {
      setSelectedRider(riders[0]);
    }
  }, [riderId, searchParams, riders]);

  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
    navigate(`/riders/${rider.id}?search=${searchQuery}`); // Updated to use rider ID
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
                  label="Search riders..."
                  icon={<Search className="h-5 w-5" />}
                  size="md"
                  className="bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              { filteredRiders.length === 0 ? (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    No riders available.
                  </Typography>
                </div>
              ) : (
                filteredRiders.map((rider) => (
                  <div
                    key={rider.id}
                    onClick={() => handleRiderSelect(rider)}
                    className={`transition-colors duration-300 ${selectedRider?.id === rider.id ? "border border-blue-500" : ""}`}
                  >
                    <RiderCard rider={rider} />
                  </div>
                ))
              )}
            </div>

            {/* Right side - Rider Details */}
            <div className="w-full">
              {selectedRider ? (
                <div className="h-[89dvh] overflow-y-auto bg-white rounded-lg border border-gray-300 p-4">
                  <Typography variant="h5" className="text-black mb-4">Rider Details</Typography>
                  <RiderDetails rider={selectedRider} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Typography color="gray" className="font-medium">
                    Select a rider to view details.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}