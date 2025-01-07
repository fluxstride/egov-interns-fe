"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getProfileByUsername } from "@/api/profile";
import UserProfile from "@/components/UserProfile";
import { useMemo } from "react";

export default function Page({ params }: { params: { username: string } }) {
  const { user } = useAuth();

  const shouldFetchUser = useMemo(() => {
    return params.username !== user?.username;
  }, [params.username, user]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", params.username],
    queryFn: async () => {
      if (shouldFetchUser) {
        const response = await getProfileByUsername(params.username);
        return response.profile;
      }

      return user;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (shouldFetchUser && isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if ((error as any).response.status === 404) {
      return <div>User does not exist</div>;
    }
    return <div>Error fetching user data</div>;
  }

  const profileData = shouldFetchUser ? data : user;

  return <UserProfile profileData={profileData} />;
}
