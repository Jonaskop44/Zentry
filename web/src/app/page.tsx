"use client";

import { useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
} from "@heroui/react";
import PasswordStrength from "@/components/Auth/PasswordStrength";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/lib/auth-validation";
import FloatingElement from "@/components/Auth/FloatingElement";
import ApiClient from "@/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient();
type Variant = "LOGIN" | "REGISTER";

const AuthPage = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const currentForm:
    | UseFormReturn<LoginFormData>
    | UseFormReturn<RegisterFormData> =
    variant === "LOGIN" ? loginForm : registerForm;

  const watchedPassword =
    (currentForm as ReturnType<typeof useForm<RegisterFormData>>).watch(
      "password"
    ) || "";

  const onSubmit = (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true);
    if (variant === "LOGIN") {
      apiClient.auth.helper
        .login(data as LoginFormData)
        .then((response) => {
          if (response.status) {
            toast.success("Login successful!");
            router.push("/select-profile");
          } else {
            toast.error("Login failed. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      apiClient.auth.helper
        .register(data as RegisterFormData)
        .then((response) => {
          if (response.status) {
            toast.success("Registration successful! Please log in.");
            toggleMode();
          } else {
            toast.error("Registration failed. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const toggleMode = () => {
    setVariant(variant === "LOGIN" ? "REGISTER" : "LOGIN");
    loginForm.reset();
    registerForm.reset();
    setShowPassword(false);
    setFocusedField(null);
  };

  const floatingPositions = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: pos.left, top: pos.top }}
          >
            <FloatingElement delay={i * 0.2} />
          </div>
        ))}
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <Card className="w-full max-w-xl shadow-2xl bg-black/30 backdrop-blur-sm relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <CardHeader className="flex flex-col items-center text-center pb-8 relative">
            <motion.div variants={itemVariants} className="relative">
              <motion.div
                className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center mb-6 shadow-lg relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 4px 20px rgba(255, 255, 255, 0.05)",
                    "0 8px 30px rgba(255, 255, 255, 0.08)",
                    "0 4px 20px rgba(255, 255, 255, 0.05)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent"
                  style={{
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Icon
                      icon={
                        variant === "LOGIN" ? "mdi:login" : "mdi:account-plus"
                      }
                      className="h-8 w-8 text-gray-200"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold text-gray-300 relative">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {variant === "LOGIN" ? "Welcome back" : "Create an account"}
                </motion.span>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                >
                  <Icon icon="mdi:sparkles" className="h-4 w-4 text-gray-400" />
                </motion.div>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-gray-400">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {variant === "LOGIN"
                    ? "Log in to your account"
                    : "Create a new account"}
                </motion.span>
              </p>
            </motion.div>
          </CardHeader>

          <CardBody className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.form
                initial={{ opacity: 0, x: variant === "LOGIN" ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: variant === "LOGIN" ? 30 : -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onSubmit={currentForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: focusedField === "username" ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      label="Username"
                      placeholder="Your username"
                      autoComplete="off"
                      color="default"
                      classNames={{
                        inputWrapper: [
                          "!bg-black/40",
                          "!transition-colors",
                          "!border",
                          "!border-white/20",
                        ],
                        input: [
                          "!text-white",
                          "!placeholder:text-gray-400",
                          "!bg-transparent",
                        ],
                        label: "text-white",
                        description: "text-gray-400",
                        errorMessage: "text-red-500",
                      }}
                      startContent={
                        <motion.div
                          animate={{
                            scale: focusedField === "username" ? 1.2 : 1,
                            color: "#9CA3AF",
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon icon="mdi:account" className="h-4 w-4" />
                        </motion.div>
                      }
                      onFocus={() => setFocusedField("username")}
                      {...(variant === "LOGIN"
                        ? loginForm.register("username")
                        : registerForm.register("username"))}
                      isInvalid={!!currentForm.formState.errors.username}
                      errorMessage={
                        currentForm.formState.errors.username?.message
                      }
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: focusedField === "password" ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      label="Password"
                      placeholder="Your password"
                      classNames={{
                        inputWrapper: [
                          "!bg-black/40",
                          "!transition-colors",
                          "!border",
                          "!border-white/20",
                        ],
                        input: [
                          "!text-white",
                          "!placeholder:text-gray-400",
                          "!bg-transparent",
                        ],
                        label: "text-white",
                        description: "text-gray-400",
                        errorMessage: "text-red-500",
                      }}
                      type={showPassword ? "text" : "password"}
                      startContent={
                        <motion.div
                          animate={{
                            scale: focusedField === "password" ? 1.2 : 1,
                            color: "#9CA3AF",
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon icon="mdi:lock" className="h-4 w-4" />
                        </motion.div>
                      }
                      endContent={
                        <motion.button
                          type="button"
                          className="p-1 rounded-full transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            rotate: showPassword ? 180 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Icon
                            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                            className="h-4 w-4 text-gray-400"
                          />
                        </motion.button>
                      }
                      onFocus={() => setFocusedField("password")}
                      {...(variant === "LOGIN"
                        ? loginForm.register("password")
                        : registerForm.register("password"))}
                      isInvalid={!!currentForm.formState.errors.password}
                      errorMessage={
                        currentForm.formState.errors.password?.message
                      }
                    />
                  </motion.div>

                  {variant === "REGISTER" && watchedPassword && (
                    <PasswordStrength password={watchedPassword} />
                  )}
                </motion.div>

                {variant === "LOGIN" && (
                  <div className="flex items-center justify-between pt-2">
                    <Checkbox
                      classNames={{
                        label: "text-gray-400",
                      }}
                      {...(
                        currentForm as UseFormReturn<LoginFormData>
                      ).register?.("rememberMe")}
                    >
                      Remember me
                    </Checkbox>
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    className={`w-full font-medium py-6 relative overflow-hidden transition-colors ${
                      currentForm.formState.isValid
                        ? "bg-gradient-to-br from-black via-gray-900 to-black hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                    size="lg"
                    isDisabled={!currentForm.formState.isValid}
                    isLoading={isLoading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={{
                        x: currentForm.formState.isValid ? "100%" : "-100%",
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                    />
                    {isLoading
                      ? "Processing"
                      : variant === "LOGIN"
                      ? "Login"
                      : "Sign Up"}
                  </Button>
                </motion.div>
              </motion.form>
            </AnimatePresence>

            <motion.div
              className="text-center pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-300 hover:text-gray-400 font-medium transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{
                    backgroundSize: ["0% 2px", "100% 2px"],
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-gray-400 to-gray-600 bg-no-repeat bg-bottom"
                  style={{ backgroundSize: "0% 2px" }}
                >
                  {variant
                    ? "No account yet? Register now"
                    : "Already have an account? Register now"}
                </motion.span>
              </motion.button>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
