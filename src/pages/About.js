import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

const teamMembers = [
  { name: 'John Doe', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { name: 'Jane Smith', role: 'Chief Operations Officer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { name: 'Alex Brown', role: 'Head of Technology', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
];

function About() {
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
            About FlightBook
          </h1>
          <p
            id="hero-description"
            className="text-base sm:text-lg mt-4 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Connecting you to the world with seamless travel experiences.
          </p>
        </div>
      </section>

      {/* Mission & Why Choose Us Section */}
      <section
        className="max-w-7xl mx-auto py-16 px-2 sm:px-4 md:px-6 lg:px-8 text-center min-w-[280px]"
        role="region"
        aria-labelledby="mission-heading"
      >
        <h2
          id="mission-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          Our Mission
        </h2>
        <p
          className="text-base sm:text-lg text-gray-600 mb-12 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          At FlightBook, we aim to make travel accessible, affordable, and enjoyable for everyone. Our platform connects you to thousands of flights, offering the best deals and a user-friendly experience.
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          Why Choose FlightBook?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6" data-aos="fade-up" data-aos-duration="1400">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:bg-teal-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">We compare prices across airlines to ensure you get the best deal.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:bg-teal-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Book your flights in just a few clicks with our intuitive interface.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:bg-teal-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Our support team is available around the clock to assist you.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className="bg-white py-16"
        role="region"
        aria-labelledby="team-heading"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <h2
            id="team-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <FaUsers className="mr-2 text-blue-600 text-3xl" /> Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
              <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  className="w-40 sm:w-48 h-40 sm:h-48 aspect-square object-cover rounded-full mx-auto mt-4 hover:ring-2 hover:ring-blue-600"
                  loading="lazy"
                />

               <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> 
    </div>
  );
}

export default About;