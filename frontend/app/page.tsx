"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen bg-background text-foreground py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
            Mainframe Challenge Prize Event Day
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Welcome to the Capture The Flag Platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Guest Speakers
              </h3>
              <p className="text-lg text-muted-foreground mb-4">
                Our guest speakers will share their expertise, career journeys,
                and practical tips to help you explore opportunities in this
                growing field:
              </p>
              <motion.ul className="space-y-3 text-muted-foreground mb-8">
                {[
                  {
                    name: "Ricki West",
                    role: "Technical Support Engineer @ Broadcom",
                    link: "https://www.linkedin.com/in/ricki-west/",
                  },
                  {
                    name: "Niall Ashley",
                    role: "Mainframe Advocate",
                    link: "https://www.linkedin.com/in/niall-a-a91914124/",
                  },
                ].map((speaker, index) => (
                  <motion.li
                    key={speaker.name}
                    className="flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-lg">
                      <motion.a
                        href={speaker.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary font-bold hover:text-primary/80"
                        transition={{ duration: 0.2 }}
                      >
                        {speaker.name}
                      </motion.a>{" "}
                      – {speaker.role}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              variants={itemVariants}
            >
              Whether you&apos;re a computing student or completely new to tech
              or mainframes, this event will help you learn more about what
              mainframes are, how they&apos;re used, the career paths available,
              and how anyone can start learning and building a future in this
              space.
            </motion.p>

            <motion.p
              className="text-lg text-primary/80 font-medium"
              variants={itemVariants}
            >
              Don&apos;t miss this chance to gain insight, ask questions, and
              get inspired to begin your own mainframe journey!
            </motion.p>
          </motion.div>

          <motion.div
            className="lg:col-span-1 flex items-start"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/MaSS Events 2025.png"
                alt="Mainframe Challenge Prize Event Day Poster"
                width={400}
                height={600}
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mb-12"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground">
            Event Details
          </h3>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Calendar,
                label: "Date",
                value: "Tuesday, 25th October 2025",
              },
              { icon: Clock, label: "Time", value: "3:00 PM – 6:00 PM" },
              {
                icon: MapPin,
                label: "Location",
                value: "MC413, University of Wolverhampton",
              },
            ].map((detail) => (
              <motion.div
                key={detail.label}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-card"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  borderColor: "hsl(var(--primary))",
                  backgroundColor: "hsl(var(--primary) / 0.05)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <detail.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-muted-foreground mb-1">
                  {detail.label}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {detail.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-accent-foreground mr-3" />
            <h3 className="text-2xl font-semibold text-accent-foreground">
              Join Our Community
            </h3>
          </div>
          <p className="text-muted-foreground mb-6">
            You can join the WhatsApp group to become a part of the society:
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="https://bit.ly/MaSSWLV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-accent hover:bg-accent/80 text-accent-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Join WhatsApp Group
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ExternalLink className="w-4 h-4 ml-2" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="https://forms.microsoft.com/e/t98kePdXGe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Register for Event
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FileText className="w-4 h-4 ml-2" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <p className="text-sm text-muted-foreground border-t border-border pt-6">
          <strong>Privacy Notice:</strong> When you submit this form, it will
          not automatically collect your details like name and email address
          unless you provide it yourself.
        </p>
      </div>
    </section>
  );
}
