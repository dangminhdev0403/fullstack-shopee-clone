import { LoadingSkeleton } from "@components/Loading";
import Footer from "@layouts/Footer";
import Header from "@layouts/Header";
import ChatTest from "@websocket/ChatTest";
import { Suspense } from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<LoadingSkeleton />}>
        <Outlet />
      </Suspense>
      <ChatTest />;
      <Footer />
    </div>
  );
};

export default RootLayout;
