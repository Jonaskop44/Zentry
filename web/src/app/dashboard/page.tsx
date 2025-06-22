"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody } from "@heroui/react";
import { useEmployeeStore } from "@/data/employee-store";
import ApiClient from "@/api";
import { Gender } from "@/types/employee.types";

const getProfileColor = (gender: Gender) => {
  return gender === "MALE" ? "bg-blue-500" : "bg-pink-500";
};

const getProfileIcon = (gender: Gender) => {
  return gender === "MALE" ? "mdi:account" : "mdi:account-outline";
};

const apiClient = new ApiClient();

const DashboardPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const { setEmployees, employees } = useEmployeeStore();

  useEffect(() => {
    const getEmployees = async () => {
      await apiClient.admin.helper.getAllEmployees().then((response) => {
        if (response.status) {
          setEmployees(response.data);
        }
      });
    };

    if (employees.length === 0) {
      getEmployees();
    }
  }, [employees.length, setEmployees]);

  const handleUserSelect = (employeeId: number) => {
    setSelectedEmployee(employeeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Who wants to track there time
        </h1>
        <p className="text-gray-400 text-lg">Select your profile to continue</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12"
      >
        <AnimatePresence>
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() =>
                !isManaging &&
                employee.id !== undefined &&
                handleUserSelect(employee.id)
              }
            >
              <motion.div
                className="relative mb-4"
                whileHover={{
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-transparent border-3 border-transparent group-hover:border-white/30 transition-all duration-300">
                  <CardBody className="p-2">
                    <div
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${getProfileColor(
                        employee.gender
                      )} flex items-center justify-center border-4 border-white/20 group-hover:border-white/40 transition-all duration-300`}
                    >
                      <Icon
                        icon={getProfileIcon(employee.gender)}
                        className="text-white text-4xl md:text-5xl"
                      />
                    </div>
                  </CardBody>
                </Card>

                {isManaging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center"
                  >
                    <Button
                      isIconOnly
                      color="primary"
                      variant="solid"
                      size="lg"
                    >
                      <Icon icon="mdi:pencil" width={20} />
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              <motion.h3
                className="text-white text-lg font-medium group-hover:text-gray-300 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {employee.firstName} {employee.lastName}
              </motion.h3>
            </motion.div>
          ))}

          {/* Add Profile Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: employees.length * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center cursor-pointer group"
          >
            <motion.div
              className="mb-4"
              whileHover={{
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-transparent border-3 border-dashed border-gray-600 group-hover:border-white/50 transition-all duration-300">
                <CardBody className="p-2 flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
                  <Icon
                    icon="mdi:plus"
                    className="text-gray-500 group-hover:text-white transition-colors text-4xl md:text-5xl"
                  />
                </CardBody>
              </Card>
            </motion.div>
            <h3 className="text-gray-500 text-lg font-medium group-hover:text-white transition-colors">
              Add Employee
            </h3>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex gap-4"
      >
        <Button
          variant={isManaging ? "solid" : "bordered"}
          color="default"
          size="lg"
          startContent={<Icon icon="mdi:cog" width={20} />}
          onClick={() => setIsManaging(!isManaging)}
          className="text-white border-gray-600 hover:border-white"
        >
          {isManaging ? "Finish" : "Edit Profiles"}
        </Button>
      </motion.div>

      {/* Loading Animation when user is selected */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h2 className="text-white text-2xl font-bold">
                Load {employees.find((u) => u.id === selectedEmployee)?.id}s
                Profil...
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
