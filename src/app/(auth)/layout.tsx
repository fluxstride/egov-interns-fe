"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { toast } from "@/components/ui/use-toast";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      return router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return <Loader />;
  }

  // return children;
  return (
    <div className="flex max-w-lg mx-auto border min-h-screen">
      {/* <div className="bg-red-400">sidebar</div> */}
      <div className="flex-grow"> {children}</div>
    </div>
  );
};

export default Layout;
