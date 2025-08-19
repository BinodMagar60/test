'use client'
import { IUserData } from "@/types/login";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
  userDetail: IUserData | null;
  setUserDetail: React.Dispatch<React.SetStateAction<IUserData | null>>;
}

const UserContext = createContext<IContext | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userdetailLocal = localStorage.getItem("user");
    if (userdetailLocal) {
      setUserDetail(JSON.parse(userdetailLocal));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !userDetail) {
      router.push("/");
    }
  }, [userDetail, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
};
