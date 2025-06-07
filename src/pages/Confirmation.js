import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage } from '../services/storage';
import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '../components/Common';
import FlightMap from '../components/FlightMap';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(state?.booking || null);
  const [flight, setFlight] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!state?.booking) {
      console.log('No booking found in state:', state);
      setBooking(null);
      setFlight(null);
      return;
    }

    const flights = getStorage('flights') || [];
    const foundFlight = flights.find((f) => f.id === state.booking?.flightId) || state.flight || null;
    console.log('Flight data:', foundFlight);
    setFlight(foundFlight);
  }, [state]);

  const generateTicketPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4', // 595 x 842 px
    });

    doc.setFont('helvetica', 'bold');

    // Header
    doc.setFillColor(0, 128, 128);
    doc.rect(0, 0, 595, 60, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Boarding Pass', 20, 40);

    // Airline and Logo Placeholder
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Airline: ${flight.airline || 'N/A'}`, 20, 80);
    doc.setFontSize(8);
    doc.text('[Airline Logo]', 500, 80);

    // Main Ticket Box
    doc.setLineWidth(1);
    doc.rect(20, 100, 555, 250);

    // Passenger Details
    doc.setFontSize(10);
    doc.text('Passenger Details:', 30, 120);
    if (Array.isArray(booking.passengers) && booking.passengers.length > 0) {
      booking.passengers.forEach((p, index) => {
        doc.text(`${index + 1}. ${p.name || 'N/A'} (Age: ${p.age || 'N/A'})`, 40, 130 + index * 15);
      });
    } else {
      doc.text('No passenger details available', 40, 130);
    }

    // Flight Details
    doc.text('Flight Details:', 30, 160);
    doc.text(`Booking ID: ${booking.id || 'N/A'}`, 40, 175);
    doc.text(`Flight: ${flight.from || 'N/A'} → ${flight.to || 'N/A'}`, 40, 190);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`, 40, 205);
    doc.text(`Departure: ${flight.departureTime || 'N/A'}`, 40, 220);
    doc.text(`Arrival: ${flight.arrivalTime || 'N/A'}`, 40, 235);

    // QR Code
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 450, 120, 60, 60);
        console.log('QR Code added to PDF, size:', { width: 60, height: 60 });
      } else {
        console.error('QR Code canvas not found');
      }
    }

    // Barcode Placeholder
    doc.setFontSize(8);
    doc.text('Barcode: [||||| |||| |||]', 30, 260);

    // Footer
    doc.text('Thank you for flying with us!', 20, 280);
    doc.text(`Ticket Number: ${booking.id || 'N/A'}`, 20, 295);

    return doc;
  };

  const handleDownloadTicket = () => {
    const doc = generateTicketPDF();
    doc.save(`ticket_${booking.id || 'booking'}.pdf`);
    setShowPreview(false);
  };

  const handlePreviewTicket = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    return () => {
      const strayCanvases = document.querySelectorAll('canvas[id="qr-code"]');
      strayCanvases.forEach((canvas) => {
        if (canvas.parentElement && !qrCodeRef.current?.contains(canvas)) {
          console.log('Removing stray QR code canvas:', canvas);
          canvas.parentElement.remove();
        }
      });
    };
  }, [showPreview]);

  if (!booking || !flight?.id) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-red-500 text-sm mb-4">Booking or flight details not found.</p>
          <Button onClick={() => navigate('/search')} className="w-full">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <FaCheckCircle className="text-4xl text-teal-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Booking ID:</span> {booking.id || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Route:</span> {flight.from || 'N/A'} → {flight.to || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Airline:</span> {flight.airline || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Passengers:</span> {Array.isArray(booking.passengers) ? booking.passengers.length : 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Total Price:</span> ₹{booking.totalPrice || 0}
                </p>
              </div>
              <h3 className="font-bold text-gray-800 mt-4">Passenger Details</h3>
              <div className="space-y-2">
                {Array.isArray(booking.passengers) && booking.passengers.length > 0 ? (
                  booking.passengers.map((p, index) => (
                    <p key={index} className="text-gray-600">
                      {p.name || 'N/A'} (Age: {p.age || 'N/A'})
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600">No passenger details available</p>
                )}
              </div>
              <button
                onClick={handlePreviewTicket}
                className="text-blue-600 hover:underline text-sm"
              >
                Download Ticket
              </button>
            </div>
          </div>
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Flight Route</h3>
            <div className="w-full h-[600px] relative">
              <FlightMap from={flight.from} to={flight.to} />
            </div>
          </div>
        </div>
        <Button onClick={() => navigate('/bookings')} className="mt-6 w-full md:w-auto">
          View Booking
        </Button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ticket Preview</h2>
            <div id="ticket-preview" className="border border-gray-200 p-4">
              <div className="bg-teal-600 text-white p-3 mb-4">
                <h3 className="text-lg font-bold">Boarding Pass</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm">Airline: {flight.airline || 'N/A'}</p>
                  <p className="text-xs">[Airline Logo]</p>
                  <div className="mt-2">
                    <p className="font-semibold text-sm">Passenger Details:</p>
                    {Array.isArray(booking.passengers) && booking.passengers.length > 0 ? (
                      booking.passengers.map((p, index) => (
                        <p key={index} className="text-xs">
                          {index + 1}. {p.name || 'N/A'} (Age: {p.age || 'N/A'})
                        </p>
                      ))
                    ) : (
                      <p className="text-xs">No passenger details available</p>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold text-sm">Flight Details:</p>
                    <p className="text-xs">Booking ID: {booking.id || 'N/A'}</p>
                    <p className="text-xs">Flight: {flight.from || 'N/A'} → {flight.to || 'N/A'}</p>
                    <p className="text-xs">Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-xs">Departure: {flight.departureTime || 'N/A'}</p>
                    <p className="text-xs">Arrival: {flight.arrivalTime || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div ref={qrCodeRef}>
                    <QRCodeCanvas value={booking?.id || 'N/A'} size={100} />
                  </div>
                  <p className="text-xs mt-2">Barcode: [||||]</p>
                  <p className="text-xs mt-2">Ticket Number: {booking.id || 'N/A'}</p>
                </div>
              </div>
              <p className="text-xs mt-4">Thank you for flying with us!</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setShowPreview(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                Close
              </Button>
              <Button onClick={handleDownloadTicket} className="bg-teal-600 hover:bg-teal-700 text-white">
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Confirmation;