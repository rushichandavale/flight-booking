import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchResults, clearSearchResults } from '../store/flightSlice';
import { fetchFlights } from '../services/api';
import { InputField, SelectField, Button } from './Common';

const cities = [
  { value: '', label: 'Select City' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Chennai', label: 'Chennai' },
];

function SearchForm() {
  const [tripType, setTripType] = useState('one-way');
  const [routes, setRoutes] = useState([{ from: '', to: '', date: '' }]);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear search results when trip type changes
  useEffect(() => {
    dispatch(clearSearchResults());
  }, [tripType, dispatch]);

  const addRoute = () => {
    if (routes.length < 3) {
      setRoutes([...routes, { from: '', to: '', date: '' }]);
    }
  };

  const removeRoute = (index) => {
    if (routes.length > 1) {
      setRoutes(routes.filter((_, i) => i !== index));
      setErrors({});
    }
  };

  const handleRouteChange = (index, field, value) => {
    const newRoutes = [...routes];
    if (!newRoutes[index]) {
      newRoutes[index] = { from: '', to: '', date: '' };
    }
    newRoutes[index][field] = value;
    setRoutes(newRoutes);
    setErrors((prev) => ({ ...prev, [`${field}${index}`]: '' }));
  };

  const validateRoutes = () => {
    const newErrors = {};
    if (!routes || routes.length === 0) {
      newErrors.form = 'At least one route is required';
      return newErrors;
    }

    routes.forEach((route, index) => {
      if (!route) {
        newErrors[`route${index}`] = 'Invalid route';
        return;
      }
      if (!route.from) newErrors[`from${index}`] = 'Required';
      if (!route.to) newErrors[`to${index}`] = 'Required';
      if (!route.date) newErrors[`date${index}`] = 'Required';
      if (route.from && route.to && route.from === route.to) {
        newErrors[`to${index}`] = 'Cannot be same as From';
      }
      if (index > 0 && route.date && routes[index - 1]?.date && new Date(route.date) < new Date(routes[index - 1].date)) {
        newErrors[`date${index}`] = 'Date must be after previous segment';
      }
    });

    if (tripType === 'round-trip') {
      if (routes.length !== 2) {
        newErrors.form = 'Round-trip requires exactly two routes';
      } else if (routes[0]?.from !== routes[1]?.to || routes[0]?.to !== routes[1]?.from) {
        newErrors.form = 'Round-trip requires return route to match origin and destination';
      }
    }

    if (
      routes.some((route, i) =>
        routes.slice(0, i).some((r) => r?.from === route?.from && r?.to === route?.to)
      )
    ) {
      newErrors.form = 'Duplicate routes not allowed';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateRoutes();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(clearSearchResults()); // Clear previous results before new search
      const results = await fetchFlights({ routes, tripType });
      dispatch(setSearchResults(results));
      navigate('/search');
    } catch (err) {
      setErrors({ form: err.message || 'Failed to fetch flights' });
    }
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    setErrors({});
    setRoutes(
      type === 'round-trip'
        ? [{ from: '', to: '', date: '' }, { from: '', to: '', date: '' }]
        : [{ from: '', to: '', date: '' }]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        {['one-way', 'round-trip', 'multi-city'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg font-medium ${
              tripType === type
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
            onClick={() => handleTripTypeChange(type)}
          >
            {type
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {routes.map((route, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end relative">
            <SelectField
              label={`From (Segment ${index + 1})`}
              value={route?.from || ''}
              onChange={(e) => handleRouteChange(index, 'from', e.target.value)}
              name={`from${index}`}
              options={cities}
              error={errors[`from${index}`]}
            />
            <SelectField
              label={`To (Segment ${index + 1})`}
              value={route?.to || ''}
              onChange={(e) => handleRouteChange(index, 'to', e.target.value)}
              name={`to${index}`}
              options={cities}
              error={errors[`to${index}`]}
            />
            <InputField
              label={`Date (Segment ${index + 1})`}
              type="date"
              value={route?.date || ''}
              onChange={(e) => handleRouteChange(index, 'date', e.target.value)}
              name={`date${index}`}
              min={index === 0 ? new Date().toISOString().split('T')[0] : routes[index - 1]?.date || new Date().toISOString().split('T')[0]}
              error={errors[`date${index}`]}
            />
            {tripType === 'multi-city' && index > 0 && (
              <button
                type="button"
                onClick={() => removeRoute(index)}
                className="text-red-500 hover:underline text-sm self-end mb-3 absolute right-0"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {tripType === 'multi-city' && routes.length < 3 && (
          <button
            type="button"
            onClick={addRoute}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add Trip
          </button>
        )}
        {errors.form && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
            {errors.form}
          </div>
        )}
        <Button>Search Flights</Button>
      </form>
    </div>
  );
}

export default SearchForm;