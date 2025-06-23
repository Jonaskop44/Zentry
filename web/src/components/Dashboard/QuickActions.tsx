import ApiClient from "@/api";
import { useEmployeeStore } from "@/data/employee-store";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const apiClient = new ApiClient();

const QuickActions = () => {
  const router = useRouter();
  const { employee } = useEmployeeStore();

  const handleExportActivities = async () => {
    if (!employee.id) {
      toast.error("No employee selected!");
      return;
    }
    await apiClient.activity.statistics
      .getStatisticsByEmployeeId(employee)
      .then((response) => {
        if (response.status) {
          toast.success("Activities exported successfully!");
        } else {
          toast.error("Failed to export activities.");
        }
      });
  };

  return (
    <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:lightning-bolt" className="text-xl text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Quick actions</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <Button
          variant="flat"
          color="primary"
          startContent={<Icon icon="mdi:file-export" width={16} />}
          className="w-full justify-start"
          onPress={handleExportActivities}
        >
          Export Activities
        </Button>
        <Button
          variant="flat"
          color="warning"
          startContent={<Icon icon="mdi:swap-horizontal" width={16} />}
          className="w-full justify-start"
          onPress={() => router.push("/select-profile")}
        >
          Change Employee
        </Button>
      </CardBody>
    </Card>
  );
};

export default QuickActions;
