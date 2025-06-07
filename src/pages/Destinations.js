import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage } from '../services/storage';
import { SelectField } from '../components/Common';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Mock city data (images, descriptions)
const cityData = {
  Mumbai: {
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant metropolis iconic landmarks like Gateway of India.',
  },
  Delhi: {
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Historic capital with Red Fort and bustling markets.',
  },
  Bangalore: {
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Tech hub known for gardens and vibrant nightlife.',
  },
  Chennai: {
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Coastal city with rich culture and Marina Beach.',
  },
  Pune: {
    image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Cultural hub with historic forts and vibrant cafes.',
  },
};

function DestinationCard({ city, price, image, description }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full min-h-[24rem] focus:outline-none focus:ring-2 focus:ring-blue-600"
      tabIndex={0}
    >
      <img
        src={image}
        alt={`View of ${city}`}
        className="w-full aspect-[4/3] object-cover   hover:ring-2 hover:ring-blue-600 transition-all duration-300"
        loading="lazy"
      />
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-blue-600" /> {city}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2">{description}</p>
        <p className="text-gray-800 font-bold mt-2">From ₹{price}</p>
        <button
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-teal-600   shadow-md mt-auto focus:ring-2 focus:ring-blue-600"
          onClick={() => navigate('/search', { state: { to: city } })}
          aria-label={`Book flight to ${city}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [sortOption, setSortOption] = useState('price-asc');

  useEffect(() => {
    const flights = getStorage('flights') || [];
    // Extract unique destinations and min prices
    const cityPrices = {};
    flights.forEach((flight) => {
      if (!cityPrices[flight.to] || flight.price < cityPrices[flight.to].price) {
        cityPrices[flight.to] = { price: flight.price, city: flight.to };
      }
    });
    const destinationsList = Object.values(cityPrices)
      .map((dest) => ({
        city: dest.city,
        price: dest.price,
        ...cityData[dest.city],
      }))
      .filter((dest) => dest.image && dest.description);
    setDestinations(destinationsList);
  }, []);

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name-asc') return a.city.localeCompare(b.city);
    return b.city.localeCompare(a.city);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="max-w-7xl mx-auto py-12 px-2 sm:px-4 md:px-6 lg:px-8 min-w-[280px]"
        role="region"
        aria-labelledby="destinations-heading"
      >
        <div className="text-center mb-12">
          <h1
            id="destinations-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Explore Top Destinations
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Discover amazing places to travel with our exclusive flight deals.
          </p>
        </div>
        <div className="flex justify-end mb-6" data-aos="fade-right" data-aos-duration="1000">
          <SelectField
            label="Sort By"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            options={[
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'name-asc', label: 'Name: A to Z' },
              { value: 'name-desc', label: 'Name: Z to A' },
            ]}
            className="w-full sm:w-48 max-w-xs"
            aria-label="Sort destinations"
          />
        </div>
        {destinations.length === 0 ? (
          <p
            className="text-gray-600 text-center text-base sm:text-lg"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            No destinations available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {sortedDestinations.map((dest, index) => (
              <DestinationCard
                key={dest.city}
                city={dest.city}
                price={dest.price}
                image={dest.image}
                description={dest.description}
                data-aos="fade-up"
                data-aos-duration={1200 + index * 100}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Destinations;