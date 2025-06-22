import { motion } from "framer-motion";
import { FC } from "react";
import { Icon } from "@iconify/react";

interface PasswordStrengthProps {
  password: string;
}

const requirements = [
  {
    label: "At least 10 characters",
    test: (password: string) => password.length >= 10,
  },
  {
    label: "At least one number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: "At least one capital letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "At least one special character",
    test: (password: string) => /[^a-zA-Z0-9]/.test(password),
  },
];

const PasswordStrength: FC<PasswordStrengthProps> = ({ password }) => {
  const passedRequirements = requirements.filter((req) =>
    req.test(password)
  ).length;
  const strength = passedRequirements / requirements.length;

  const getStrengthColor = () => {
    if (strength < 0.25) return "#EF4444";
    if (strength < 0.5) return "#F97316";
    if (strength < 0.75) return "#EAB308";
    return "#10B981";
  };

  const getStrengthText = () => {
    if (strength < 0.25) return "Weak";
    if (strength < 0.5) return "Medium";
    if (strength < 0.75) return "Good";
    return "Strong";
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scale: 0.9 }}
      animate={{
        opacity: password ? 1 : 0,
        height: password ? "auto" : 0,
        scale: password ? 1 : 0.9,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 bg-black/30 p-4 rounded-lg"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-400">
              Password Strength
            </span>
          </div>
          <motion.span
            className="text-sm font-bold"
            animate={{ color: getStrengthColor() }}
            transition={{ duration: 0.3 }}
          >
            {getStrengthText()}
          </motion.span>
        </div>

        <div className="relative">
          <div className="w-full bg-gray-200/30 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-3 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{
                width: `${strength * 100}%`,
                backgroundColor: getStrengthColor(),
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {requirements.map((requirement, index) => {
          const isPassed = requirement.test(password);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-300 ${
                isPassed
                  ? "bg-green-300/40 border border-green-300"
                  : "bg-gray-800/30 border border-gray-800"
              }`}
            >
              <motion.div
                animate={{
                  scale: isPassed ? [1, 1.3, 1] : 1,
                  rotate: isPassed ? [0, 360, 0] : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  isPassed ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: isPassed ? 1 : 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  {isPassed ? (
                    <Icon
                      icon="solar:check-circle-linear"
                      className="h-3 w-3 text-white"
                    />
                  ) : (
                    <Icon
                      icon="solar:close-circle-linear"
                      className="h-3 w-3 text-white"
                    />
                  )}
                </motion.div>
              </motion.div>
              <motion.span
                className={`text-sm font-medium ${
                  isPassed ? "text-green-400" : "text-gray-600"
                }`}
                transition={{ duration: 0.3 }}
              >
                {requirement.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PasswordStrength;
