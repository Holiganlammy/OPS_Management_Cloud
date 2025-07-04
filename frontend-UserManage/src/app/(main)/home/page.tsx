import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">200</h1>
      <h2 className="text-2xl font-semibold mb-2">Home Page</h2>
      <p className="text-lg text-gray-500 mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
  );
};

export default Home;
