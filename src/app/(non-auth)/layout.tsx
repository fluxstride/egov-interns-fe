"use client";

import { MaxWidthContainer } from "@/components/MaxWidthContainer";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      return router.push("/home");
    }
  }, [user, loading, router]);

  if (loading || (!loading && !!user)) {
    return <Loader />;
  }

  return (
    <>
      <nav className="shadow-md">
        <MaxWidthContainer className="py-2">
          <Link
            href="/"
            className="flex items-center w-fit gap-2 hover:underline"
          >
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={60}
              height={60}
              className="w-12 sm:w-14"
            />
            <span className="text-xl hidden sm:block tracking-wide font-semibold">
              E-Governance Interns
            </span>
          </Link>
        </MaxWidthContainer>
      </nav>

      <div className="mt-4 mb-8">{children}</div>
    </>
  );
};

export default Layout;
