import { getStorage, setStorage } from './storage';
import { addDays, subDays, differenceInHours } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const fetchFlights = async (searchParams) => {
  const { routes, tripType, maxDuration, aircraftTypes, flexibleDates } = searchParams;
  const cacheKey = `flights_${JSON.stringify({ routes, tripType, maxDuration, aircraftTypes })}`;
  const cached = getStorage(cacheKey);

  console.log('fetchFlights: Search params:', { routes, tripType, maxDuration, aircraftTypes, flexibleDates });

  // Check cache with 1-hour expiry
  if (cached && cached.timestamp && differenceInHours(new Date(), new Date(cached.timestamp)) < 1) {
    console.log('fetchFlights: Returning cached results');
    return cached.data;
  }

  let results = [];

  // Handle flexible dates (±1 day)
  const getDateRange = (date) => {
    if (!flexibleDates || !date) return [date];
    const baseDate = new Date(date);
    return [subDays(baseDate, 1), baseDate, addDays(baseDate, 1)].map((d) =>
      d.toISOString().split('T')[0]
    );
  };

  const flights = getStorage('flights') || [];
  console.log(`fetchFlights: Loaded ${flights.length} flights from localStorage`);

  if (tripType === 'one-way') {
    const { from, to, date } = routes[0];
    if (!from || !to || from === to) {
      throw new Error('Invalid route: Missing or same from/to city');
    }
    const dateRange = getDateRange(date);
    const filteredFlights = flights.filter((flight) => {
      const matchesRoute = flight.from === from && flight.to === to && (flight.seatsAvailable - flight.seatsBooked > 0);
      const matchesDuration = !maxDuration || parseDuration(flight.duration) <= maxDuration;
      const matchesAircraft = !aircraftTypes?.length || aircraftTypes.includes(flight.aircraft);
      return matchesRoute && matchesDuration && matchesAircraft;
    }).map((flight) => ({
      ...flight,
      id: flight.id || uuidv4(),
      flightDate: date || new Date().toISOString().split('T')[0],
      segment: 'outbound'
    }));
    console.log(`fetchFlights: Found ${filteredFlights.length} flights for ${from} → ${to}`);
    if (filteredFlights.length === 0) {
      throw new Error('No flights found for the selected route');
    }
    results = [filteredFlights];
  } else if (tripType === 'round-trip') {
    if (routes.length !== 2) {
      throw new Error('Round-trip requires exactly two routes');
    }
    const [outbound, returnTrip] = routes;
    if (!outbound.from || !outbound.to || !returnTrip.from || !returnTrip.to || outbound.from === outbound.to || returnTrip.from === returnTrip.to) {
      throw new Error('Invalid route: Missing or same from/to city');
    }
    if (outbound.from !== returnTrip.to || outbound.to !== returnTrip.from) {
      throw new Error('Round-trip requires return route to match origin and destination');
    }
    if (new Date(returnTrip.date) < new Date(outbound.date)) {
      throw new Error('Return date must be after departure date');
    }
    const outboundDateRange = getDateRange(outbound.date);
    const returnDateRange = getDateRange(returnTrip.date);
    const outboundFlights = flights.filter((flight) => {
      const matchesRoute = flight.from === outbound.from && flight.to === outbound.to && (flight.seatsAvailable - flight.seatsBooked > 0);
      const matchesDuration = !maxDuration || parseDuration(flight.duration) <= maxDuration;
      const matchesAircraft = !aircraftTypes?.length || aircraftTypes.includes(flight.aircraft);
      return matchesRoute && matchesDuration && matchesAircraft;
    }).map((flight) => ({
      ...flight,
      id: flight.id || uuidv4(),
      flightDate: outbound.date || new Date().toISOString().split('T')[0],
      segment: 'outbound'
    }));
    const returnFlights = flights.filter((flight) => {
      const matchesRoute = flight.from === returnTrip.from && flight.to === returnTrip.to && (flight.seatsAvailable - flight.seatsBooked > 0);
      const matchesDuration = !maxDuration || parseDuration(flight.duration) <= maxDuration;
      const matchesAircraft = !aircraftTypes?.length || aircraftTypes.includes(flight.aircraft);
      return matchesRoute && matchesDuration && matchesAircraft;
    }).map((flight) => ({
      ...flight,
      id: flight.id || uuidv4(),
      flightDate: returnTrip.date || new Date().toISOString().split('T')[0],
      segment: 'return'
    }));
    console.log(`fetchFlights: Outbound flights: ${outboundFlights.length}, Return flights: ${returnFlights.length}`);
    if (outboundFlights.length === 0 || returnFlights.length === 0) {
      throw new Error('No flights found for one or both segments');
    }
    results = [outboundFlights, returnFlights];
  } else if (tripType === 'multi-city') {
    if (routes.length > 3) {
      throw new Error('Multi-city trips are limited to 3 destinations');
    }
    for (let i = 0; i < routes.length; i++) {
      const { from, to, date } = routes[i];
      if (!from || !to || from === to) {
        throw new Error(`Invalid route for segment ${i + 1}: Missing or same from/to city`);
      }
      if (i > 0 && new Date(date) < new Date(routes[i - 1].date)) {
        throw new Error(`Date for segment ${i + 1} must be after segment ${i}`);
      }
      const dateRange = getDateRange(date);
      const segmentFlights = flights.filter((flight) => {
        const matchesRoute = flight.from === from && flight.to === to && (flight.seatsAvailable - flight.seatsBooked > 0);
        const matchesDuration = !maxDuration || parseDuration(flight.duration) <= maxDuration;
        const matchesAircraft = !aircraftTypes?.length || aircraftTypes.includes(flight.aircraft);
        return matchesRoute && matchesDuration && matchesAircraft;
      }).map((flight) => ({
        ...flight,
        id: flight.id || uuidv4(),
        flightDate: date || new Date().toISOString().split('T')[0],
        segment: `segment${i + 1}`
      }));
      console.log(`fetchFlights: Segment ${i + 1} flights: ${segmentFlights.length}`);
      if (segmentFlights.length === 0) {
        throw new Error(`No flights found for segment ${i + 1}`);
      }
      results.push(segmentFlights);
    }
  } else {
    throw new Error('Invalid trip type');
  }

  // Cache results with timestamp
  setStorage(cacheKey, { data: results, timestamp: new Date().toISOString() });
  console.log('fetchFlights: Cached results:', results);

  return new Promise((resolve) => {
    setTimeout(() => resolve(results), 500); // Simulate API delay
  });
};

// Helper to parse duration (e.g., "2h 45m" to 2.75 hours)
const parseDuration = (duration) => {
  if (!duration) return 0;
  const [hours, minutes] = duration
    .split(' ')
    .map((part) => parseInt(part.replace(/[hm]/, '')));
  return hours + (minutes || 0) / 60;
};