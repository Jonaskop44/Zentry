"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, useDisclosure } from "@heroui/react";
import { useEmployeeStore } from "@/data/employee-store";
import ApiClient from "@/api";
import AddProfileModal from "@/components/Select-Profile/AddEmployeeModal";
import ProfileCard from "@/components/Select-Profile/ProfileCard";
import { toast } from "sonner";
import EditEmployeeModal from "@/components/Select-Profile/EditEmployeeModal";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient();

const DashboardPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [editEmployee, setEditEmployee] = useState<number | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const {
    isOpen: isOpenAddModal,
    onOpen: onOpenAddModal,
    onOpenChange: onOpenChangeAddModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onOpenChange: onOpenChangeEditModal,
  } = useDisclosure();
  const { setEmployees, employees, setEmployee } = useEmployeeStore();
  const router = useRouter();

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
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      apiClient.activity.helper.getActivityByEmployeeId(employeeId);
      setEmployee(employee);
      apiClient.activity.helper
        .getActivityByEmployeeId(employeeId)
        .then((response) => {
          if (response.status) {
            setEmployee({
              ...employee,
              activities: response.data,
            });
            router.push(`/dashboard`);
          } else {
            toast.error(
              "Failed to load employee activities. Please try again."
            );
          }
        });
    } else {
      toast.error("Selected employee not found.");
    }
  };

  const handleEditEmployee = (employeeId: number) => {
    setEditEmployee(employeeId);
    onOpenEditModal();
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    await apiClient.admin.helper.deleteEmployee(employeeId).then((response) => {
      if (response.status) {
        setEmployees(
          employees.filter((employee) => employee.id !== employeeId)
        );
        toast.success("Employee profile deleted successfully!");
      } else {
        toast.error("Failed to delete employee profile. Please try again.");
      }
    });
  };

  return (
    <>
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
          <p className="text-gray-400 text-lg">
            Select your profile to continue
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12"
        >
          <AnimatePresence>
            {employees.map((employee, index) => (
              <ProfileCard
                key={employee.id}
                employee={employee}
                index={index}
                isManaging={isManaging}
                onSelect={handleUserSelect}
                onDelete={handleDeleteEmployee}
                onEdit={handleEditEmployee}
              />
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
              onClick={onOpenAddModal}
              className="flex flex-col items-center cursor-pointer"
            >
              <motion.div
                className="mb-4"
                whileHover={{
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-transparent border-3 border-dashed border-gray-600 transition-all duration-300">
                  <CardBody className="p-2">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300">
                      <Icon
                        icon="mdi:plus"
                        className="text-white text-4xl md:text-5xl"
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
              <h3 className="text-gray-300 text-lg font-medium transition-colors">
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
            variant="bordered"
            color="default"
            size="lg"
            startContent={
              <Icon icon="solar:settings-line-duotone" width={20} />
            }
            onPress={() => setIsManaging(!isManaging)}
            className="text-white border-gray-600 hover:border-white"
          >
            {isManaging ? "Finish" : "Edit Profiles"}
          </Button>
          <Button
            variant="bordered"
            color="default"
            size="lg"
            startContent={
              <Icon icon="solar:download-minimalistic-outline" width={20} />
            }
            onPress={() => setIsManaging(!isManaging)}
            className="text-white border-gray-600 hover:border-white"
          >
            Export all activities
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
                  className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h2 className="text-white text-2xl font-bold">
                  Load{" "}
                  {employees.find((u) => u.id === selectedEmployee)?.firstName}
                  ´s Profil...
                </h2>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddProfileModal isOpen={isOpenAddModal} onClose={onOpenChangeAddModal} />
      {editEmployee !== null && (
        <EditEmployeeModal
          isOpen={isOpenEditModal}
          onClose={onOpenChangeEditModal}
          employee={employees.find((e) => e.id === editEmployee)!}
        />
      )}
    </>
  );
};

export default DashboardPage;
