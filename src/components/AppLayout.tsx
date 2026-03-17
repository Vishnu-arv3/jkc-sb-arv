import AppSidebar from "@/components/AppSidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-8 pt-16 lg:px-6 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
