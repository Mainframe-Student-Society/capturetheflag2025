"use client";

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
    <div className="min-h-screen bg-background flex">
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/20 to-background flex-col justify-center px-12"
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
              className="text-3xl font-bold text-foreground"
              whileHover={{ scale: 1.02 }}
            >
              MainFrame Student Society
            </motion.h1>
          </motion.div>
          <motion.h2
            className="text-4xl font-bold text-primary mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            Join the CTF 2025
          </motion.h2>

          <motion.div className="space-y-4" variants={itemVariants}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover the world of mainframe technology through interactive
              challenges and competitions.
            </p>

            <motion.div className="space-y-3" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-foreground">
                What are Mainframes?
              </h3>
              <p className="text-muted-foreground">
                Mainframes are high-performance computers used by the
                world&apos;s largest organizations for mission-critical
                applications, bulk data processing, and enterprise resource
                planning.
              </p>
            </motion.div>

            <motion.div className="space-y-3" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-foreground">
                Why Learn Mainframes?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Power 71% of Fortune 500 companies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Handle 90% of global credit card transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>
                    High-demand career opportunities with competitive salaries
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Work with cutting-edge enterprise technology</span>
                </li>
              </ul>
            </motion.div>
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
  );
}
