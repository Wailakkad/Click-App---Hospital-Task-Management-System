"use client";
import { useRouter } from 'next/navigation'; 
import Head from 'next/head';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Unauthorized() {
  const router = useRouter();

  

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Unauthorized Access - Clinic Task Management</title>
        <meta name="description" content="You do not have permission to access this page." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Access Denied
            </h1>
            <h2 className="text-xl text-gray-600 font-medium">
              Unauthorized Access
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
              You do not have the necessary permissions to access this page. 
              This area is restricted to administrators only.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6">
           
            <button
              onClick={handleGoHome}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium border-2 border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors duration-200"
            >
              Return Home
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-400 pt-4">
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </>
  );
}