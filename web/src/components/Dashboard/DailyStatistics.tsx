import {
  formatDuration,
  getActivityColor,
  getActivityIcon,
} from "@/lib/activity.helper";
import { ActivityType } from "@/types/employee.types";
import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { FC } from "react";

interface DailyStatisticsProps {
  stats: {
    totalWork: number;
    totalBreak: number;
    totalWC: number;
    totalSmoke: number;
    totalFree: number;
    totalActivities: number;
  };
}

const DailyStatistics: FC<DailyStatisticsProps> = ({ stats }) => {
  const statisticsData = [
    {
      type: ActivityType.WORK,
      duration: stats.totalWork,
      label: "Arbeitszeit",
    },
    {
      type: ActivityType.BREAK,
      duration: stats.totalBreak,
      label: "Pausenzeit",
    },
    { type: ActivityType.WC, duration: stats.totalWC, label: "WC-Zeit" },
    {
      type: ActivityType.SMOKE,
      duration: stats.totalSmoke,
      label: "Raucherpausen",
    },
    { type: ActivityType.FREE, duration: stats.totalFree, label: "Freizeit" },
  ];

  const totalTime =
    stats.totalWork +
    stats.totalBreak +
    stats.totalWC +
    stats.totalSmoke +
    stats.totalFree;

  return (
    <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:chart-pie" className="text-xl text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Tagesstatistik</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {statisticsData.map((stat) => (
          <div key={stat.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon={getActivityIcon(stat.type)}
                  className="text-sm text-gray-400"
                />
                <span className="text-sm text-gray-300">{stat.label}</span>
              </div>
              <span className="text-sm text-white font-medium">
                {formatDuration(stat.duration)}
              </span>
            </div>
            <Progress
              value={
                stat.duration > 0
                  ? Math.min((stat.duration / (8 * 60 * 60 * 1000)) * 100, 100)
                  : 0
              }
              color={getActivityColor(stat.type)}
              size="sm"
              className="max-w-full"
            />
          </div>
        ))}

        <Divider className="bg-gray-600" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Gesamtaktivitäten</span>
            <span className="text-white font-bold">
              {stats.totalActivities}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Gesamtzeit</span>
            <span className="text-white font-bold">
              {formatDuration(totalTime)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DailyStatistics;
