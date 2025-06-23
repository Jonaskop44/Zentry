import {
  formatDuration,
  getActivityIcon,
  getActivityLabel,
} from "@/lib/activity.helper";
import { Activity } from "@/types/employee.types";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

interface TodayActivityProps {
  activities: Activity[];
}

const TodayActivities: FC<TodayActivityProps> = ({ activities }) => {
  const sortedActivities = activities.sort(
    (a, b) =>
      new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime()
  );

  return (
    <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm mt-6 max-h-[400px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon="solar:history-broken" className="text-xl text-blue-500" />
          <h3 className="text-lg font-semibold text-white">
            Today&apos;s activities
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
          <AnimatePresence>
            {sortedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "WORK"
                        ? "bg-green-500/20"
                        : activity.type === "BREAK"
                        ? "bg-yellow-500/20"
                        : activity.type === "WC"
                        ? "bg-purple-500/20"
                        : activity.type === "SMOKE"
                        ? "bg-red-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    <Icon
                      icon={getActivityIcon(activity.type)}
                      className="text-white text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getActivityLabel(activity.type)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {activity.startTime
                        ? new Date(activity.startTime).toLocaleTimeString(
                            "de-DE",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Unbekannt"}{" "}
                      -{" "}
                      {activity.endTime
                        ? new Date(activity.endTime).toLocaleTimeString(
                            "de-DE",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Läuft"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.startTime && activity.endTime ? (
                    <p className="text-white font-medium">
                      {formatDuration(
                        new Date(activity.endTime).getTime() -
                          new Date(activity.startTime).getTime()
                      )}
                    </p>
                  ) : (
                    <Chip size="sm" color="success" variant="flat">
                      Aktiv
                    </Chip>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {sortedActivities.length === 0 && (
            <div className="text-center py-8">
              <Icon
                icon="solar:calendar-outlines"
                className="text-4xl text-gray-500 mb-2"
              />
              <p className="text-gray-400">No activities today</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TodayActivities;
