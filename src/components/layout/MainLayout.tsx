import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Main content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;