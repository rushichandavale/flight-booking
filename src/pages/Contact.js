import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../components/Common';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { setStorage, getStorage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

function Contact() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const contacts = getStorage('contacts') || [];
      const newContact = {
        id: uuidv4(),
        userId: user?.id || null,
        ...formData,
        timestamp: new Date().toISOString(),
      };
      contacts.push(newContact);
      setStorage('contacts', contacts);
      setSuccess('Your message has been submitted successfully!');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setErrors({ form: 'Failed to submit message. Please try again.' });
    }
  };

  const handleBookFlight = () => {
    navigate(user ? '/search' : '/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Banner with Image */}
      <section
        className="relative bg-cover bg-center min-h-[16rem] sm:min-h-[20rem] flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}
        role="banner"
        aria-labelledby="contact-heading"
        aria-describedby="contact-description"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50 z-10" />
        <div className="relative z-20 text-center text-white px-2 sm:px-4 max-w-7xl mx-auto min-w-[280px]">
          <h1
            id="contact-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Get in Touch
          </h1>
          <p
            id="contact-description"
            className="text-base sm:text-lg mt-4 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            We’re here to assist you 24/7. Reach out and let’s plan your journey!
          </p>
          <div
            className="flex justify-center space-x-4 mt-6"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <FaEnvelope className="text-blue-600 text-2xl animate-pulse" aria-hidden="true" />
            <FaPhone className="text-blue-600 text-2xl animate-pulse" aria-hidden="true" />
            <FaMapMarkerAlt className="text-blue-600 text-2xl animate-pulse" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Contact Form & Details */}
      <section
        className="max-w-7xl mx-auto py-16 px-2 sm:px-4 md:px-6 lg:px-8 min-w-[280px]"
        role="region"
        aria-labelledby="contact-form-heading"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
          {/* Contact Form */}
          <div
            className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:bg-teal-50 hover:shadow-xl hover:scale-45 transition-all duration-300"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <h2
              id="contact-form-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
            >
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                error={errors.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `name-error` : undefined}
              />
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                error={errors.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `email-error` : undefined}
              />
              <InputField
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                error={errors.subject}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? `subject-error` : undefined}
              />
              <InputField
                label="Message"
                type="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                error={errors.message}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `message-error` : undefined}
              />
              {errors.form && (
                <div
                  className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  {errors.form}
                </div>
              )}
              {success && (
                <div
                  className="bg-green-100 text-green-600 p-3 rounded-lg text-sm text-center"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  {success}
                </div>
              )}
              <button
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-teal-600 hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
                aria-label="Send message"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div
            className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:bg-teal-50 hover:shadow-xl hover:scale-45 transition-all duration-300"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-600 mr-3 text-xl" aria-hidden="true" />
                <div>
                  <p className="text-gray-800 font-medium">Email</p>
                  <p className="text-gray-600 text-sm sm:text-base">support@flightbook.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-600 mr-3 text-xl" aria-hidden="true" />
                <div>
                  <p className="text-gray-800 font-medium">Phone</p>
                  <p className="text-gray-600 text-sm sm:text-base">+1-800-555-1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-600 mr-3 text-xl" aria-hidden="true" />
                <div>
                  <p className="text-gray-800 font-medium">Address</p>
                  <p className="text-gray-600 text-sm sm:text-base">123 Sky Lane, Travel City, TC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="max-w-7xl mx-auto py-16 px-2 sm:px-4 md:px-6 lg:px-8 text-center min-w-[280px]"
        role="region"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="sr-only">
          Call to Action
        </h2>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-lg font-medium hover:from-blue-700 hover:to-teal-600 hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleBookFlight}
          aria-label="Book your next flight"
        >
          Book Your Next Flight
        </button>
      </section>
    </div>
  );
}

export default Contact;