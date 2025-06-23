

const LoadingSpinner = ({ message }) => {
  return (
    <div className="fixed inset-0 z-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-blue-900 p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;