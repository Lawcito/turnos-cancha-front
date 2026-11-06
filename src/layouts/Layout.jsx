import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-platinum text-shadow-grey font-sans selection:bg-mustard selection:text-shadow-grey">
      {/* Top Navbar */}
      <Navbar />

      {/* Centered Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
