import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className='text-center min-h-lvh'>
      <h1 className='text-4xl font-bold mb-4'>
        Welcome to AI-Powered Accessibility
      </h1>
      <p className='mb-8'>
        Enhance your web browsing experience with our AI tools.
      </p>
      <div className='space-x-4'>
        <Link
          href='/speech'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Speech Tools
        </Link>
        <Link
          href='/vision'
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Vision Tools
        </Link>
      </div>
    </div>
  );
}
