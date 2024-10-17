import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className='bg-gray-800 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-xl font-bold'>
          AI Accessibility
        </Link>
        <ul className='flex space-x-4'>
          <li>
            <Link href='/speech'>Speech</Link>
          </li>
          <li>
            <Link href='/vision'>Vision</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
