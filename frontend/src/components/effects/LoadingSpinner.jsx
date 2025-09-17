// LoadingSpinner.jsx
const LoadingSpinner = ({ text = 'Loading...' }) => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
        <span>{text}</span>
      </div>
    );
  };
  
  export default LoadingSpinner;
  