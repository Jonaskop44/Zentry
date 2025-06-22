"use client";

import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  const previousPage = document.referrer || "/";

  const actionList = [
    {
      icon: "mdi:home",
      text: "To the homepage",
      delay: 0,
      onClick: () => router.push("/"),
    },
    {
      icon: "mdi:refresh",
      text: "Reload page",
      delay: 0.1,
      onClick: () => window.location.reload(),
    },
    {
      icon: "mdi:arrow-left",
      text: "Go back",
      delay: 0.2,
      onClick: () => router.push(previousPage),
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-8">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="text-center z-10"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <motion.h1
            className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-red-500 to-red-700 bg-clip-text"
            animate={{
              textShadow: [
                "0 0 20px rgba(239, 68, 68, 0.5)",
                "0 0 40px rgba(239, 68, 68, 0.8)",
                "0 0 20px rgba(239, 68, 68, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          className="mb-8"
        >
          <Card className="bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm">
            <CardBody className="flex items-center justify-center p-8">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              >
                <Icon
                  icon="mdi:television-off"
                  className="text-red-500 text-8xl"
                />
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Error Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops! Page not found
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved.
            Perhaps it has ended up in another dimension?
          </p>
        </motion.div>

        {/* Animated suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {actionList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + item.delay }}
                whileHover={{ scale: 1.05 }}
                onClick={item.onClick}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-500/50 transition-all duration-300"
              >
                <Icon
                  icon={item.icon}
                  className="text-red-500 text-2xl mb-2 mx-auto"
                />
                <p className="text-gray-300 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{
          duration: 0.1,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: Math.random() * 5 + 2,
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-red-500/5 to-transparent transform skew-y-12" />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
