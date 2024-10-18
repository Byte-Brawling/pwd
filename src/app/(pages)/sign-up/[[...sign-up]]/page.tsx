"use client"
import { createUser } from "@/server/actions";
import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  createUser()
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className='flex items-center justify-center min-h-screen'
    >
      <SignUp signInUrl='/sign-in' />
    </motion.div>
  );
}
