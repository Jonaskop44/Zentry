"use client";

import ApiClient from "@/api";
import Loader from "@/components/Common/Loader";
import { useUserStore } from "@/data/user-store";
import { FC, useEffect, useState } from "react";

interface SessionProviderProps {
  children: React.ReactNode;
}

const apiClient = new ApiClient();

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUserStore();

  useEffect(() => {
    const initializeSession = async () => {
      await apiClient.auth.helper
        .refreshToken()
        .then((response) => {
          if (response.status) {
            setUser(response.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    initializeSession();
  }, [setUser]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default SessionProvider;
