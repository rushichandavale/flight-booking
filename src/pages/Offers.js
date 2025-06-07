import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTag } from 'react-icons/fa';
import { Button } from '../components/Common';
const offers = [
  {
    city: 'Mumbai',
    discount: 'Up to 25% Off',
    description: 'Explore the vibrant city of Mumbai with exclusive flight discounts.',
    validity: 'Valid until Dec 31, 2025',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Delhi',
    discount: 'Flat 20% Off',
    description: 'Discover historic Delhi with our limited-time offer on flights.',
    validity: 'Valid until Jan 15, 2026',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Bangalore',
    discount: '₹1500 Off',
    description: 'Fly to the tech hub of Bangalore at unbeatable prices.',
    validity: 'Valid until June 30, 2025',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Chennai',
    discount: '₹1500 Off',
    description: 'Coastal city with rich culture and Marina Beach.',
    validity: 'Valid until June 30, 2025',
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Pune',
    discount: '₹1500 Off',
    description: 'Cultural hub with historic forts and vibrant cafes.',
    validity: 'Valid until June 30, 2025',
    image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

function Offers() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleBookFlight = () => {
    navigate(user ? '/search' : '/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center min-h-[20rem] sm:h-[28rem] flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}
        role="region"
        aria-labelledby="hero-heading"
        aria-describedby="hero-description"
      >
       <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-20 text-center text-white px-2 sm:px-4" data-aos="fade-up" data-aos-duration="1000">
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
          >
            Special Offers
          </h1>
          <p
            id="hero-description"
            className="text-base sm:text-lg mt-4 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Save big on your next adventure with our exclusive flight deals.
          </p>
        </div>
      </section>

      {/* Offers Section */}
      <section
        className="max-w-7xl mx-auto py-16 px-2 sm:px-4 md:px-6 lg:px-8 min-w-[280px]"
        role="region"
        aria-labelledby="offers-heading"
      >
        <h2
          id="offers-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          <FaTag className="mr-2 text-blue-600 text-3xl" /> Exclusive Deals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {offers.map((offer, index) => (
            <div
              key={offer.city}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full min-h-[24rem] focus:outline-none focus:ring-2 focus:ring-blue-600"
              data-aos="fade-up"
              data-aos-duration={1200 + index * 100}
              tabIndex={0}
            >
              <img
                src={offer.image}
                alt={`View of ${offer.city}`}
                className="w-full aspect-[4/3] object-cover hover:ring-2 hover:ring-blue-600 "
                loading="lazy"
              />
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                  <FaTag className="mr-2 text-blue-600" /> {offer.discount}
                </h3>
                <p className="text-gray-800 font-bold mt-2">{offer.city}</p>
                <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2">{offer.description}</p>
                <p className="text-gray-600 text-sm mt-2">Valid: {offer.validity}</p>
                <Button
                 
                  onClick={() => navigate('/search', { state: { to: offer.city } })}
                  aria-label={`Book flight to ${offer.city}`}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section> 
    </div>
  );
}

export default Offers;