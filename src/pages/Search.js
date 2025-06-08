import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import { setFlights, setFilters } from '../store/flightSlice';
import { getStorage } from '../services/storage';
import { FaFilter } from 'react-icons/fa';

function Search() {
  const { searchResults, filters } = useSelector((state) => state.flights);
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState({ price: true, airlines: true, stops: true, timeSlots: true });

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Flights</h1>
        <SearchForm />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="md:w-1/4 bg-white rounded-lg shadow-md p-6 md:sticky md:top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <FaFilter className="text-blue-600" />
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleFilterSection('price')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
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
                      className="w-full custom-range"
                    />
                    <p className="text-sm text-gray-600 mt-1">Up to ₹{filters.priceRange[1]}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleFilterSection('airlines')}
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
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
                          className="h-4 w-4 text-blue-600"
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
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
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
                          className="h-4 w-4 text-blue-600"
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
                  className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
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
                          className="h-4 w-4 text-blue-600"
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
          <div className="md:w-3/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Flight Results</h2>
            {!searchResults || searchResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No flights searched yet. Use the form above to find flights.</p>
              </div>
            ) : Array.isArray(searchResults[0]) ? (
              filteredResults.map((segment, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Segment {index + 1}: {segment[0]?.from || 'N/A'} → {segment[0]?.to || 'N/A'}
                  </h3>
                  {segment.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-600">No flights found for this segment. Try adjusting your filters.</p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {searchResults[0]?.from || 'N/A'} → {searchResults[0]?.to || 'N/A'}
                </h3>
                {filteredResults.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">No flights found. Try adjusting your filters.</p>
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
              <p className="text-gray-600 mt-4">
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