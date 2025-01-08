"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { HomeIcon, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showFallbackImage, setShowFallbackImage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      return router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-2xl mx-auto border min-h-screen relative">
      <div className="w-15 md:w-36 p-1 border">
        <div className="rounded-lg p-1 w-full mx-auto flex flex-col gap-2">
          <Link
            href="/home"
            className={`flex items-center md:gap-2 p-2 rounded-md ${
              pathname === "/home"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <p className="hidden md:block text-sm">Home</p>
          </Link>

          <Link
            href={`/${user.username}`}
            className={`flex items-center md:gap-2 p-2 rounded-md ${
              pathname === `/${user.username}`
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }`}
          >
            {/* <User className="w-5 h-5" /> */}
            <div className="w-6 h-6 block rounded-full overflow-hidden">
              {showFallbackImage ? (
                <div className="grid place-items-center w-full h-full">
                  <span>
                    {`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}
                  </span>
                  <span className="sr-only">Profile Image</span>
                </div>
              ) : (
                <Image
                  src={user.profileImage ?? "/"}
                  alt="Profile Image"
                  width={300}
                  height={300}
                  className="object-cover object-center w-full h-full"
                  onError={() => setShowFallbackImage(true)}
                  onLoad={() => setShowFallbackImage(false)}
                />
              )}
            </div>
            <p className="hidden md:block text-sm">Profile</p>
          </Link>
        </div>
      </div>
      <div className="flex-grow"> {children}</div>
    </div>
  );
};

export default Layout;
