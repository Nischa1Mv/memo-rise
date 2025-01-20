import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black dark:from-black dark:to-gray-900">
      {children}
    </div>
  );
}
