"use client"

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import PageLoading from "../components/PageLoading";
import { useRouter } from "next/navigation";


interface CheckSessionProps {
  children: React.ReactNode;
  mustCheck: boolean;
}

export const CheckSession = ({ children, mustCheck }: Readonly<CheckSessionProps>) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (mustCheck && status === "unauthenticated") {
      router.push("/login");
    }
  }, [mustCheck, status, router]);

  return (<>
    {!session && mustCheck ?
      <PageLoading />
      :
      <>
        {children}
      </>
    }
  </>
  )
}