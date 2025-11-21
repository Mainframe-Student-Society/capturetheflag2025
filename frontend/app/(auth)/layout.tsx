"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "motion/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex">
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-gray-900 flex-col justify-center px-12"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex items-center mb-6"
              variants={itemVariants}
            >
              <motion.h1
                className="text-3xl font-bold text-white"
                whileHover={{ scale: 1.02 }}
              >
                MainFrame Student Society
              </motion.h1>
            </motion.div>
            <motion.h2
              className="text-4xl font-bold text-white mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              Join the CTF 2025
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8"
              variants={itemVariants}
            >
              Test your cybersecurity skills and learn mainframe system
              interactions through hands-on challenges.
            </motion.p>
            <motion.div
              className="space-y-4 text-gray-300"
              variants={containerVariants}
            >
              {[
                "Interactive cybersecurity challenges",
                "Real-time leaderboard competition",
                "Team collaboration features",
              ].map((text, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  variants={itemVariants}
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full mr-3"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
