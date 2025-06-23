"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Activity } from "@/types/employee.types";
import {
  formatDuration,
  getActivityIcon,
  getActivityColor,
  getActivityLabel,
} from "@/lib/activity.helper";
import { FC } from "react";

interface CurrentActivityStatusProps {
  currentActivity: Activity | null;
  elapsedTime: number;
  onStopActivity: (activityId: number) => void;
}

const CurrentActivityStatus: FC<CurrentActivityStatusProps> = ({
  currentActivity,
  elapsedTime,
  onStopActivity,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8"
    >
      <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    currentActivity ? "bg-green-500" : "bg-gray-500"
                  } animate-pulse`}
                />
                <h2 className="text-xl font-semibold text-white">
                  {currentActivity ? "Current activity" : "No active activity"}
                </h2>
              </div>
              {currentActivity && (
                <Chip
                  color={getActivityColor(currentActivity.type)}
                  variant="flat"
                >
                  <div className="flex items-center gap-1">
                    <Icon
                      icon={getActivityIcon(currentActivity.type)}
                      width={14}
                    />
                    {getActivityLabel(currentActivity.type)}
                  </div>
                </Chip>
              )}
            </div>

            {currentActivity && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {formatDuration(elapsedTime)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Started:{" "}
                    {new Date(currentActivity.startTime!).toLocaleTimeString(
                      "de-DE"
                    )}
                  </p>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    if (currentActivity.id !== undefined) {
                      onStopActivity(currentActivity.id);
                    }
                  }}
                  startContent={
                    <Icon icon="solar:stop-circle-bold-duotone" width={16} />
                  }
                >
                  Stop
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CurrentActivityStatus;
