"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ActivityType, type Activity } from "@/types/employee.types";
import {
  getActivityIcon,
  getActivityColor,
  getActivityLabel,
} from "@/lib/activity.helper";
import { FC } from "react";

interface ActivityButtonsProps {
  currentActivity: Activity | null;
  onStartActivity: (type: ActivityType) => void;
}

const ActivityButtons: FC<ActivityButtonsProps> = ({
  currentActivity,
  onStartActivity,
}) => {
  return (
    <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:play-circle" className="text-xl text-green-500" />
          <h3 className="text-lg font-semibold text-white">Start activity</h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ActivityType).map((type, index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                color={getActivityColor(type)}
                variant={currentActivity?.type === type ? "solid" : "flat"}
                onPress={() => onStartActivity(type)}
                startContent={<Icon icon={getActivityIcon(type)} width={20} />}
                className="w-full h-20 flex-col gap-2"
                isDisabled={!!currentActivity && currentActivity.type !== type}
              >
                <span className="font-semibold">{getActivityLabel(type)}</span>
                {currentActivity?.type === type && (
                  <span className="text-xs">Currently running</span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ActivityButtons;
