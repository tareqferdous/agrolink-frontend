"use client";

import dynamic from "next/dynamic";

const DashboardNavbar = dynamic(() => import("./DashboardNavbar"), {
  ssr: false,
});

export default function DashboardNavbarClient() {
  return <DashboardNavbar />;
}
