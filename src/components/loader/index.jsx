"use client";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="relative flex items-center justify-center">
        
        {/* 1. Background Blur Glow (Peeche halke se chamakne ke liye) */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-md opacity-30 animate-pulse"></div>
        
        {/* 2. Main Premium Gradient Spinner */}
        <div className="w-16 h-16 rounded-full animate-spin bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 via-pink-500 to-transparent p-[4px] [mask-image:linear-gradient(transparent_20%,black_100%)]">
          {/* Spinner Track Trick */}
          <div className="w-full h-full bg-gray-950 rounded-full"></div>
        </div>
        
      </div>
      
      {/* 3. Sleek Loading Text (Optional, e-commerce ke liye accha lagta hai) */}
      <p className="mt-4 text-sm font-medium tracking-widest text-gray-400 uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}