import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '../components/SearchForm';
import FlightCard  from '../components/FlightCard';
import { setFlights, setFilters } from '../store/flightSlice';
import { getStorage } from '../services/storage';
import { FaFilter, FaTimes } from 'react-icons/fa';

function Search() {
  const { searchResults, filters } = useSelector((state) => state.flights);
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState({ price: true, airlines: true, stops: true, timeSlots: true });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const storedFlights = getStorage('flights');
    if (storedFlights && storedFlights.length > 0) {
      console.log(`Search.js: Loaded ${storedFlights.length} flights from localStorage`);
      dispatch(setFlights(storedFlights));
    } else {
      console.warn('Search.js: No flights found in localStorage');
    }
  }, [dispatch]);

  const toggleFilterSection = (section) => {
    setIsFilterOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      dispatch(
        setFilters({
          [name]: checked
            ? [...filters[name], value]
            : filters[name].filter((v) => v !== value),
        })
      );
    } else if (name === 'priceRange') {
      dispatch(setFilters({ priceRange: [0, parseInt(value)] }));
    } else {
      dispatch(setFilters({ [name]: [value] }));
    }
  };

  const applyFilters = (flights) => {
    if (!flights || !Array.isArray(flights)) return [];
    return flights.filter((flight) => {
      const matchesPrice = flight.price <= filters.priceRange[1];
      const matchesAirline = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
      const matchesStops = filters.stops.length === 0 || filters.stops.includes(flight.stops.toString());
      const matchesTimeSlot = filters.timeSlots.length === 0 || filters.timeSlots.includes(flight.timeSlot);
      return matchesPrice && matchesAirline && matchesStops && matchesTimeSlot;
    });
  };

  const filteredResults = Array.isArray(searchResults) && searchResults.length > 0 && Array.isArray(searchResults[0])
    ? searchResults.map((segment) => applyFilters(segment))
    : applyFilters(searchResults);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Search Flights</h1>
          <button
            className="block sm:hidden p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-100 focus:ring-2 focus:ring-blue-600"
            onClick={toggleMobileFilter}
            aria-label="Toggle filters"
          >
            <FaFilter className="text-lg" />
          </button>
        </div>
        <SearchForm />
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden sm:block md:w-1/4 bg-white rounded-lg shadow-md p-4 sm:p-6 md:sticky md:top-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Filters</h2>
              <FaFilter className="text-blue-600" />
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleFilterSection('price')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm sm:text-base"
                >
                  Price Range
                  <span>{isFilterOpen.price ? '−' : '+'}</span>
                </button>
                {isFilterOpen.price && (
                  <div className="mt-2">
                    <input
                      type="range"
                      name="priceRange"
                      min="0"
                      max="20000"
                      value={filters.priceRange[1]}
                      onChange={handleFilterChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-sm text-gray-600 mt-1">Up to ₹{filters.priceRange[1]}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleFilterSection('airlines')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm sm:text-base"
                >
                  Airlines
                  <span>{isFilterOpen.airlines ? '−' : '+'}</span>
                </button>
                {isFilterOpen.airlines && (
                  <div className="mt-2 space-y-2">
                    {[...new Set(searchResults.flat().map((f) => f?.airline || ''))].filter(Boolean).map((airline) => (
                      <div key={airline} className="flex items-center">
                        <input
                          type="checkbox"
                          name="airlines"
                          value={airline}
                          checked={filters.airlines.includes(airline)}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">{airline}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleFilterSection('stops')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm sm:text-base"
                >
                  Stops
                  <span>{isFilterOpen.stops ? '−' : '+'}</span>
                </button>
                {isFilterOpen.stops && (
                  <div className="mt-2 space-y-2">
                    {['0', '1', '2'].map((stop) => (
                      <div key={stop} className="flex items-center">
                        <input
                          type="checkbox"
                          name="stops"
                          value={stop}
                          checked={filters.stops.includes(stop)}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                          {stop === '0' ? 'Non-stop' : `${stop} Stop`}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleFilterSection('timeSlots')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm sm:text-base"
                >
                  Time Slots
                  <span>{isFilterOpen.timeSlots ? '−' : '+'}</span>
                </button>
                {isFilterOpen.timeSlots && (
                  <div className="mt-2 space-y-2">
                    {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
                      <div key={slot} className="flex items-center">
                        <input
                          type="checkbox"
                          name="timeSlots"
                          value={slot}
                          checked={filters.timeSlots.includes(slot)}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                          {slot.charAt(0).toUpperCase() + slot.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Filter Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
              <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={toggleMobileFilter}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-blue-600"
                    aria-label="Close filters"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
                  <div>
                    <button
                      onClick={() => toggleFilterSection('price')}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm"
                    >
                      Price Range
                      <span>{isFilterOpen.price ? '−' : '+'}</span>
                    </button>
                    {isFilterOpen.price && (
                      <div className="mt-2">
                        <input
                          type="range"
                          name="priceRange"
                          min="0"
                          max="20000"
                          value={filters.priceRange[1]}
                          onChange={handleFilterChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-sm text-gray-600 mt-1">Up to ₹{filters.priceRange[1]}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleFilterSection('airlines')}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm"
                    >
                      Airlines
                      <span>{isFilterOpen.airlines ? '−' : '+'}</span>
                    </button>
                    {isFilterOpen.airlines && (
                      <div className="mt-2 space-y-2">
                        {[...new Set(searchResults.flat().map((f) => f?.airline || ''))].filter(Boolean).map((airline) => (
                          <div key={airline} className="flex items-center">
                            <input
                              type="checkbox"
                              name="airlines"
                              value={airline}
                              checked={filters.airlines.includes(airline)}
                              onChange={handleFilterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600">{airline}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleFilterSection('stops')}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm"
                    >
                      Stops
                      <span>{isFilterOpen.stops ? '−' : '+'}</span>
                    </button>
                    {isFilterOpen.stops && (
                      <div className="mt-2 space-y-2">
                        {['0', '1', '2'].map((stop) => (
                          <div key={stop} className="flex items-center">
                            <input
                              type="checkbox"
                              name="stops"
                              value={stop}
                              checked={filters.stops.includes(stop)}
                              onChange={handleFilterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                              {stop === '0' ? 'Non-stop' : `${stop} Stop`}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleFilterSection('timeSlots')}
                      className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm"
                    >
                      Time Slots
                      <span>{isFilterOpen.timeSlots ? '−' : '+'}</span>
                    </button>
                    {isFilterOpen.timeSlots && (
                      <div className="mt-2 space-y-2">
                        {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
                          <div key={slot} className="flex items-center">
                            <input
                              type="checkbox"
                              name="timeSlots"
                              value={slot}
                              checked={filters.timeSlots.includes(slot)}
                              onChange={handleFilterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                              {slot.charAt(0).toUpperCase() + slot.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Flight Results */}
          <div className="w-full md:w-3/4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Flight Results</h2>
            {!searchResults || searchResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
                <p className="text-sm sm:text-base text-gray-600">No flights searched yet. Use the form above to find flights.</p>
              </div>
            ) : Array.isArray(searchResults[0]) ? (
              filteredResults.map((segment, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                    Segment {index + 1}: {segment[0]?.from || 'N/A'} → {segment[0]?.to || 'N/A'}
                  </h3>
                  {segment.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
                      <p className="text-sm sm:text-base text-gray-600">No flights found for this segment. Try adjusting your filters.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {segment.map((flight) => (
                        <FlightCard key={flight.id} flight={flight} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                  {searchResults[0]?.from || 'N/A'} → {searchResults[0]?.to || 'N/A'}
                </h3>
                {filteredResults.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
                    <p className="text-sm sm:text-base text-gray-600">No flights found. Try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResults.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {searchResults.length > 0 && (
              <p className="text-sm sm:text-base text-gray-600 mt-4">
                Total Results: {Array.isArray(searchResults[0]) ? filteredResults.flat().length : filteredResults.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;