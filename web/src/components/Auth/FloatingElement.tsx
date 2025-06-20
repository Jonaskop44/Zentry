import { motion } from "framer-motion";
import { FC } from "react";

interface FloatingElementProps {
  delay?: number;
}

const FloatingElement: FC<FloatingElementProps> = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 bg-gray-200 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [-20, -100],
      x: [0, Math.random() * 40 - 20],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: Math.random() * 2,
    }}
  />
);

export default FloatingElement;
