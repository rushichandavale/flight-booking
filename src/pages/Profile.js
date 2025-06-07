import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { setUser } from '../store/authSlice';
import { setStorage, getStorage } from '../services/storage';
import { InputField, Button } from '../components/Common';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    const users = getStorage('users') || [];
    if (users.some((u) => u.email === formData.email && u.id !== user.id)) {
      newErrors.email = 'Email is already in use';
    }
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
      const users = getStorage('users') || [];
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        password: formData.password
          ? CryptoJS.AES.encrypt(formData.password, 'secret-key').toString()
          : user.password,
      };

      const updatedUsers = users.map((u) =>
        u.id === user.id ? updatedUser : u
      );
      setStorage('users', updatedUsers);
      dispatch(setUser(updatedUser));

      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      alert('Profile updated successfully!');
    } catch (err) {
      setErrors({ form: 'Failed to update profile. Please try again.' });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="New Password (leave blank to keep current)"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            <div className="text-gray-600 text-sm">
              <p>Role: {user.role}</p>
            </div>
            {errors.form && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
                {errors.form}
              </div>
            )}
            <Button type="submit">Update Profile</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;