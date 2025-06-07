import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking } from '../store/flightSlice';
import { InputField, Button } from '../components/Common';
import { FaLock, FaCreditCard, FaUniversity } from 'react-icons/fa';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiRazorpay } from 'react-icons/si';
import { BiRupee } from 'react-icons/bi';
import CreditCard from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { ClipLoader } from 'react-spinners';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

function PaymentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { flight, passengers } = state || {};
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
    upiId: '',
    bank: '',
    bankUsername: '',
    bankPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const banks = [
    { value: '', label: 'Select Bank' },
    { value: 'HDFC', label: 'HDFC Bank' },
    { value: 'SBI', label: 'State Bank of India' },
    { value: 'ICICI', label: 'ICICI Bank' },
    { value: 'Axis', label: 'Axis Bank' },
    { value: 'Kotak', label: 'Kotak Mahindra Bank' },
  ];

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!flight || !passengers || !user) {
      newErrors.form = 'Missing booking or user details';
      return newErrors;
    }
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = 'Valid expiry date (MM/YY) required';
      }
      if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = 'Valid 3-digit CVV required';
      }
      if (!formData.cardName) {
        newErrors.cardName = 'Cardholder name required';
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g., user@bank)';
      }
    } else if (paymentMethod === 'netbanking') {
      if (!formData.bank) {
        newErrors.bank = 'Select a bank';
      }
      // Username and password optional for mock
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const booking = {
      id: uuidv4(),
      userId: user.id,
      flightId: flight.id,
      passengers,
      totalPrice: flight.price * passengers.length,
      status: 'Confirmed',
      paymentMethod,
      bookingDate: new Date().toISOString().split('T')[0],
    };

    dispatch(addBooking(booking));
    setIsLoading(false);
    setShowSuccessModal(true);

    // Navigate after modal
    setTimeout(() => {
      navigate(`/confirmation/${booking.id}`, { state: { booking, flight } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
          Secure Payment
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flight Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Flight Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Route:</span> {flight?.from || 'N/A'} → {flight?.to || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Airline:</span> {flight?.airline || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Passengers:</span> {passengers?.length || 0}
              </p>
              <p className="text-gray-600 flex items-center">
                <span className="font-semibold">Total Price:</span>
                <BiRupee className="ml-1" />{(flight?.price || 0) * (passengers?.length || 0)}
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <SiRazorpay className="text-2xl text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Payment Gateway</h2>
            </div>
            {/* Payment Method Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  paymentMethod === 'card'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <FaCreditCard className="inline mr-1" /> Card
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  paymentMethod === 'upi'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <BiRupee className="inline mr-1" /> UPI
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  paymentMethod === 'netbanking'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <FaUniversity className="inline mr-1" /> Net Banking
              </button>
            </div>

            {/* Payment Forms */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {paymentMethod === 'card' && (
                <>
                  {/* Card Preview */}
                  <div className="mb-4">
                    <CreditCard
                      number={formData.cardNumber}
                      name={formData.cardName}
                      expiry={formData.expiry.replace('/', '')}
                      cvc={formData.cvv}
                      focused={formData.focus}
                      preview={false}
                    />
                  </div>
                  {/* Card Fields */}
                  <InputField
                    label="Card Number"
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    error={errors.cardNumber}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                    onFocus={() => setFormData((prev) => ({ ...prev, focus: 'number' }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Expiry Date (MM/YY)"
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      error={errors.expiry}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                      onFocus={() => setFormData((prev) => ({ ...prev, focus: 'expiry' }))}
                    />
                    <InputField
                      label="CVV"
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      error={errors.cvv}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                      onFocus={() => setFormData((prev) => ({ ...prev, focus: 'cvc' }))}
                    />
                  </div>
                  <InputField
                    label="Cardholder Name"
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    error={errors.cardName}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                    onFocus={() => setFormData((prev) => ({ ...prev, focus: 'name' }))}
                  />
                </>
              )}

              {paymentMethod === 'upi' && (
                <>
                  <InputField
                    label="UPI ID"
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="user@bank"
                    error={errors.upiId}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Or scan QR code</p>
                    <QRCodeCanvas value={`upi://pay?pa=${formData.upiId || 'user@bank'}&am=${(flight?.price || 0) * (passengers?.length || 0)}`} size={100} />
                  </div>
                </>
              )}

              {paymentMethod === 'netbanking' && (
                <>
                  <div className="relative">
                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                      Select Bank
                    </label>
                    <select
                      id="bank"
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm rounded-md transition-all duration-200 ${
                        errors.bank ? 'border-red-500' : ''
                      }`}
                    >
                      {banks.map((bank) => (
                        <option key={bank.value} value={bank.value}>
                          {bank.label}
                        </option>
                      ))}
                    </select>
                    {errors.bank && (
                      <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
                    )}
                  </div>
                  <InputField
                    label="Username (Optional)"
                    type="text"
                    name="bankUsername"
                    value={formData.bankUsername}
                    onChange={handleChange}
                    placeholder="Enter bank username"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                  />
                  <InputField
                    label="Password (Optional)"
                    type="password"
                    name="bankPassword"
                    value={formData.bankPassword}
                    onChange={handleChange}
                    placeholder="Enter bank password"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
                  />
                </>
              )}

              {/* Error Message */}
              {errors.form && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
                  {errors.form}
                </div>
              )}

              {/* Security Badges */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <FaLock className="mr-2 text-blue-600" />
                  <span>256-bit SSL Secure</span>
                </div>
                <div className="flex space-x-2">
                  <RiVisaLine className="text-2xl text-gray-600" />
                  <RiMastercardLine className="text-2xl text-gray-600" />
                  <span className="text-gray-600">PCI DSS</span>
                </div>
              </div>

              {/* Pay Button */}
              <Button disabled={isLoading} className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={20} color="#fff" className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  `Pay Now`
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful</h2>
              <p className="text-gray-600 text-center mb-4">
                Your payment of <BiRupee className="inline" />{(flight?.price || 0) * (passengers?.length || 0)} via {paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'} has been processed.
              </p>
              <p className="text-gray-500 text-sm">Redirecting to confirmation...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;