import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          .font-roboto { font-family: 'Roboto', sans-serif; }
        `}
      </style>
      <Navbar />
      <main className="flex-1 p-2 sm:p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
