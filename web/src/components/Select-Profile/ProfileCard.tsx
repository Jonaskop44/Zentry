import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Card, CardBody, Button } from "@heroui/react";
import { Employee } from "@/types/employee.types";
import { getProfileColor, getProfileIcon } from "@/lib/employee.helpers";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileCardProps {
  employee: Employee;
  index: number;
  isManaging: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ProfileCard: FC<ProfileCardProps> = ({
  employee,
  index,
  isManaging,
  onSelect,
  onDelete,
  onEdit,
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (confirmingDelete) {
      const timer = setTimeout(() => {
        setConfirmingDelete(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDelete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={() =>
        !isManaging && employee.id !== undefined && onSelect(employee.id)
      }
    >
      <motion.div
        className="relative mb-4"
        whileHover={{ rotateY: 5, rotateX: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="bg-transparent border-3 border-transparent">
          <CardBody className="p-2">
            <div
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${getProfileColor(
                employee.gender
              )} flex items-center justify-center border-4 border-white/20`}
            >
              <Icon
                icon={getProfileIcon(employee.gender)}
                className="text-white text-4xl md:text-5xl"
              />
            </div>
          </CardBody>
        </Card>

        {isManaging && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center gap-4">
            <Button
              isIconOnly
              color={confirmingDelete ? "warning" : "danger"}
              variant="solid"
              size="lg"
              onPress={() => {
                if (confirmingDelete) {
                  if (employee.id !== undefined) {
                    onDelete(employee.id);
                  }
                } else {
                  setConfirmingDelete(true);
                  toast.info("Click again to confirm deletion", {
                    duration: 5000,
                  });
                }
              }}
            >
              <Icon
                icon={
                  confirmingDelete
                    ? "solar:shield-warning-broken"
                    : "solar:trash-bin-2-line-duotone"
                }
                width={20}
              />
            </Button>
            <Button
              isIconOnly
              color="primary"
              variant="solid"
              size="lg"
              onPress={() => {
                if (employee.id !== undefined) {
                  onEdit(employee.id);
                }
              }}
            >
              <Icon icon="solar:pen-new-square-line-duotone" width={20} />
            </Button>
          </div>
        )}
      </motion.div>

      <motion.h3
        className="text-white text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        {employee.firstName} {employee.lastName}
      </motion.h3>
    </motion.div>
  );
};

export default ProfileCard;
