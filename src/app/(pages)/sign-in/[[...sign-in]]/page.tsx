"use client";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className='flex items-center justify-center min-h-screen bg-gray-100'
    >
      {/* Added a wrapper around SignIn to control width and centering */}
      <div className='w-full max-w-md p-4'>
        <SignIn signUpUrl='/sign-up' />
      </div>
    </motion.div>
  );
}
