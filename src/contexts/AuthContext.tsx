"use client";
import React, { createContext, ReactNode, useState } from "react";
import { API } from "../api";
import { toast } from "@/components/ui/use-toast";
import { getUserProfile } from "../api/profile";
import { useQuery } from "@tanstack/react-query";

export type UserData = {
  id: string;
  email: string;
  password: string;
  username: string;
  bio: string;
  firstName: string;
  lastName: string;
  dob: Date;
  schoolName: string;
  schoolDepartment: string;
};

export const authContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const { isLoading: loading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await getUserProfile();
        setUser(response.profile);
        return response.profile;
      }
      return null;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (error && (error as any).response.status === 401) {
    toast({ description: (error as any).response.message });
    localStorage.removeItem("token");
    setUser(null);
  }

  if (error) {
    console.log(error);
  }

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      delete API.defaults.headers.common["Authorization"];
      setUser(null);
    } catch (error) {
      toast({
        description: "logout failed",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  return (
    <authContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
