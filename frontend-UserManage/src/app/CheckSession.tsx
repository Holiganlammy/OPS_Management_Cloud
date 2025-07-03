"use client"

import { useSession } from "next-auth/react";
import PageLoading from "../components/PageLoading";

interface CheckSessionProps {
  children: React.ReactNode;
  mustCheck: boolean;
}

export const CheckSession = ({ children, mustCheck }: Readonly<CheckSessionProps>) => {
  const { data: session } = useSession();


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