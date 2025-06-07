import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RxCalendar } from 'react-icons/rx';
import { BsShieldCheck, BsFillBookmarkFill } from 'react-icons/bs';
import video from '../assets/video.mp4';
import aeroplane from '../assets/aeroplane.webp';
import supportimg from '../assets/supportimg.webp';
import paris from '../assets/paris.webp';
import london from '../assets/london.webp';
import bangkok from '../assets/bangkok.webp';
import pakistan from '../assets/pakistan.webp';
import traveler1 from '../assets/traveler1.jpg';
import traveler2 from '../assets/traveler2.jpg';
import traveler3 from '../assets/traveler3.webp';
import traveler4 from '../assets/traveler4.webp';

const travelers = [
  { id: 1, destinationImage: paris, travelerImage: traveler1, travelerName: 'Kenji Kishimoto', socialLink: 'https://twitter.com/kenji76' },
  { id: 2, destinationImage: london, travelerImage: traveler2, travelerName: 'Haider Ibrahim', socialLink: 'https://twitter.com/haider32' },
  { id: 3, destinationImage: bangkok, travelerImage: traveler3, travelerName: 'Alex Russo', socialLink: 'https://twitter.com/alex46' },
  { id: 4, destinationImage: pakistan, travelerImage: traveler4, travelerName: 'Justin Sky', socialLink: 'https://twitter.com/justin990' },
];

function Home() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleBookFlight = () => {
    navigate(user ? '/search' : '/login');
  };

  return (
    <div className="home flex flex-col">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
        <video
          src={video}
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover opacity-60 rounded-lg"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50 z-10" />
        <div className="relative z-20 text-center px-2 sm:px-4" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg">
            Start Planning Your Next Trip
          </h1>
          <button
            onClick={handleBookFlight}
            className="mt-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-teal-600 transition-all duration-200 shadow-md"
            aria-label="Book a flight"
          >
            Book Flight
          </button>
        </div>
        <img
          src={aeroplane}
          className="relative z-20 w-[60rem] max-w-[85%] mt-2 sm:mt-4"
          alt="Aeroplane illustration"
          loading="lazy"
        />
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Make Memories Worldwide</h2>
          <button
            onClick={handleBookFlight}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-teal-600 mt-2 sm:mt-4 md:mt-0 transition-all duration-200"
            aria-label="Explore destinations now"
          >
            Explore Now
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <RxCalendar className="text-5xl text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Book Now</h3>
            <p className="text-gray-600 mt-2">Plan your trip effortlessly with our intuitive booking system.</p>
          </div>
          <div
            className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <BsShieldCheck className="text-5xl text-teal-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Safety First</h3>
            <p className="text-gray-600 mt-2">Travel confidently with our top-priority safety measures.</p>
          </div>
          <div
            className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-aos="fade-up"
            data-aos-duration="1400"
          >
            <BsFillBookmarkFill className="text-5xl text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Save More</h3>
            <p className="text-gray-600 mt-2">Unlock the best deals for your next adventure.</p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase">Travel Support</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Expert Booking Assistance</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Our dedicated team ensures a seamless booking experience.
            </p>
          </div>
          <div className="flex flex-col-reverse md:flex-row md:items-center gap-4 sm:gap-8">
            <div className="flex flex-col space-y-6 md:w-1/2">
              <div
                className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                data-aos="fade-down"
                data-aos-duration="1000"
              >
                <span className="text-3xl font-bold text-blue-600">01</span>
                <h4 className="text-xl font-bold text-gray-800 mt-2">Travel Requirements</h4>
                <p className="text-gray-600 mt-2">Verify visa and health requirements effortlessly.</p>
              </div>
              <div
                className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                data-aos="fade-down"
                data-aos-duration="1200"
              >
                <span className="text-3xl font-bold text-teal-500">02</span>
                <h4 className="text-xl font-bold text-gray-800 mt-2">Travel Insurance</h4>
                <p className="text-gray-600 mt-2">Secure your trip with comprehensive coverage.</p>
              </div>
              <div
                className="p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                data-aos="fade-down"
                data-aos-duration="1400"
              >
                <span className="text-3xl font-bold text-red-500">03</span>
                <h4 className="text-xl font-bold text-gray-800 mt-2">Arrival Services</h4>
                <p className="text-gray-600 mt-2">Enjoy hassle-free transfers upon arrival.</p>
              </div>
            </div>
            <div
              className="md:w-1/2 flex justify-center md:justify-end"
              data-aos="fade-left"
              data-aos-duration="1400"
            >
              <img
                src={supportimg}
                alt="Travel support illustration"
                className="w-full max-w-xs md:max-w-md rounded-lg hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Travelers Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
          Top Travelers This Month
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {travelers.map(({ id, destinationImage, travelerImage, travelerName, socialLink }) => (
            <div
              key={id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <img
                src={destinationImage}
                className="w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-300"
                alt={`Destination visited by ${travelerName}`}
                loading="lazy"
              />
              <div className="p-2 sm:p-4 flex items-center space-x-4">
                <img
                  src={travelerImage}
                  className="w-12 h-12 rounded-full border-2 border-blue-600"
                  alt={`${travelerName}'s profile`}
                  loading="lazy"
                />
                <div className="truncate">
                  <p className="font-semibold text-gray-800 truncate">{travelerName}</p>
                  <a
                    href={socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                    aria-label={`Follow ${travelerName} on Twitter`}
                  >
                    {socialLink.replace('https://twitter.com/', '@')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;