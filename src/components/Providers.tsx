"use client";

import { ReactNode } from "react";
import { AdminProvider } from "@/context/AdminContext";
import { DataProvider } from "@/context/DataContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <DataProvider>{children}</DataProvider>
    </AdminProvider>
  );
}
