"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { type Employee, Gender } from "@/types/employee.types";
import { getProfileColor, getProfileIcon } from "@/lib/employee.helpers";
import ApiClient from "@/api";
import { toast } from "sonner";
import { useEmployeeStore } from "@/data/employee-store";

interface ManageProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

const apiClient = new ApiClient();

const EditEmployeeModal: FC<ManageProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [formData, setFormData] = useState<Employee>({
    firstName: "",
    lastName: "",
    gender: Gender.MALE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setEmployees, employees } = useEmployeeStore();

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        gender: employee.gender,
      });
    }
  }, [employee]);

  const handleUpdate = async () => {
    if (!employee || !formData.firstName.trim() || !formData.lastName.trim()) {
      return;
    }

    setIsLoading(true);
    await apiClient.admin.helper
      .updateEmployee({ ...formData, id: employee.id })
      .then((response) => {
        if (response.status) {
          const updated = response.data;
          setEmployees(
            employees.map((emp) => (emp.id === updated.id ? updated : emp))
          );
          toast.success(
            `Employee ${response.data.firstName} ${response.data.lastName} updated successfully!`
          );
          onClose();
          setFormData({
            firstName: "",
            lastName: "",
            gender: Gender.MALE,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFormData({
          firstName: employee.firstName,
          lastName: employee.lastName,
          gender: employee.gender,
        });

        onClose();
      }}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        backdrop: "bg-black/80",
        base: "bg-gray-900 border border-gray-700",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:account-edit" className="text-2xl text-blue-500" />
            <h2 className="text-xl font-bold text-white">Select gender</h2>
          </div>
          <p className="text-sm text-gray-400 font-normal">
            Edit or delete the employee profile
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-6 mt-4">
            {/* Profile Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full ${getProfileColor(
                    formData.gender
                  )} flex items-center justify-center border-2 border-white/20`}
                >
                  <Icon
                    icon={getProfileIcon(formData.gender)}
                    className="text-white text-2xl"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formData.gender === Gender.MALE ? "Male" : "Female"}
                  </p>
                  {employee.createdAt && (
                    <p className="text-gray-500 text-xs">
                      Created at:{" "}
                      {new Date(employee.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                startContent={
                  <Icon icon="mdi:account" className="text-gray-400" />
                }
                classNames={{
                  inputWrapper: ["!bg-gray-800", "!transition-colors"],
                  input: [
                    "!text-white",
                    "!placeholder:text-gray-400",
                    "!bg-transparent",
                  ],
                  label: "text-white",
                }}
                isRequired
                errorMessage="Please enter a valid first name"
              />

              <Input
                label="Last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                startContent={
                  <Icon icon="mdi:account" className="text-gray-400" />
                }
                classNames={{
                  inputWrapper: ["!bg-gray-800", "!transition-colors"],
                  input: [
                    "!text-white",
                    "!placeholder:text-gray-400",
                    "!bg-transparent",
                  ],
                  label: "text-white",
                }}
                isRequired
                errorMessage="Please enter a valid last name"
              />
            </div>

            <Select
              label="Gender"
              placeholder="Select gender"
              defaultSelectedKeys={[formData.gender]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  gender: e.target.value as Gender,
                });
              }}
              startContent={
                formData.gender === "MALE" ? (
                  <Icon icon="mdi:gender-male" className="text-blue-500" />
                ) : (
                  <Icon icon="mdi:gender-female" className="text-pink-500" />
                )
              }
              classNames={{
                trigger: "!bg-gray-800",
                label: "!text-gray-300",
                value: "!text-white",
                popoverContent: "!bg-gray-800 !border-gray-600",
                listbox: "!bg-gray-800",
              }}
            >
              <SelectItem
                key={Gender.MALE}
                className="text-white !hover:bg-gray-700"
                startContent={
                  <Icon icon="mdi:gender-male" className="text-blue-500" />
                }
              >
                Männlich
              </SelectItem>
              <SelectItem
                key={Gender.FEMALE}
                className="text-white"
                startContent={
                  <Icon icon="mdi:gender-female" className="text-pink-500" />
                }
              >
                Weiblich
              </SelectItem>
            </Select>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onClose}
            className="text-gray-300 border-gray-600 hover:border-gray-500"
            isDisabled={isLoading}
          >
            Close
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={isLoading}
            isDisabled={!formData.firstName.trim() || !formData.lastName.trim()}
            startContent={
              !isLoading && <Icon icon="mdi:content-save" width={16} />
            }
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEmployeeModal;
