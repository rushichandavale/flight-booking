import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const InputField = ({ label, type, value, onChange, name, placeholder, showToggle, toggleShow, isPassword, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600`}
        required
      />
      {isPassword && showToggle && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {type === 'password' ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export const SelectField = ({ label, value, onChange, name, options, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={onChange}
      name={name}
      className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600`}
      required
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export const Button = ({ children, onClick, disabled, className = '' }) => (
  <button
    type="submit"
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white p-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);