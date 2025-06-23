import { Spinner } from "@heroui/react";

const Loader = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <Spinner
        size="lg"
        label="Loading..."
        variant="gradient"
        classNames={{
          label: "text-white font-semibold",
        }}
      />
    </div>
  );
};

export default Loader;
