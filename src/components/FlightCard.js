import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';

function FlightCard({ flight }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4 items-center hover:shadow-lg transition-shadow duration-200">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-lg text-gray-800">{flight.airline || 'N/A'}</p>
          <p className="text-sm text-gray-600">{flight.timeSlot || 'N/A'}</p>
        </div>
        <p className="text-gray-600">
          {flight.from || 'N/A'} → {flight.to || 'N/A'}
        </p>
        <p className="text-gray-500 text-sm">
          {flight.departureTime || 'N/A'} - {flight.arrivalTime || 'N/A'}
        </p>
        <p className="text-gray-500 text-sm">Stops: {flight.stops || 0}</p>
        <p className="text-gray-500 text-sm">
          Seats Available: {(flight.seatsAvailable || 0) - (flight.seatsBooked || 0)}
        </p>
        <p className="text-gray-500 text-sm">Duration: {flight.duration || 'N/A'}</p>
        <p className="text-gray-500 text-sm">Aircraft: {flight.aircraft || 'N/A'}</p>
      </div>
      <div className="text-center sm:text-right">
        <p className="font-bold text-xl text-blue-600">₹{flight.price || 0}</p>
        <Button
          onClick={() => navigate('/booking-details', { state: { flight } })}
          className="mt-2 w-full sm:w-auto px-6"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default FlightCard;