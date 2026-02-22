import Link from 'next/link';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 italic font-medium">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">FleetIQ</div>
        <div className="flex items-center space-x-8 text-gray-600 font-semibold">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#" className="hover:text-blue-600 transition">Pricing</a>
          <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center group">
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 py-20 lg:py-32 text-center">
        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
          Revolutionize Your Fleet
        </div>
        <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
          Manage your fleet with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Zero Friction.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          The all-in-one logistics operating system. Track trips, monitor drivers, and automate maintenance with real-time Odoo integration.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
            Start Managing Now
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
            Book a Demo
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={Truck}
              title="Real-time Tracking"
              desc="Monitor your entire fleet status at a glance with sub-second Odoo synchronization."
            />
            <FeatureCard
              icon={Shield}
              title="Driver Safety"
              desc="Integrated safety scores and license expiry alerts keep your operations compliant."
            />
            <FeatureCard
              icon={Clock}
              title="Automated Trips"
              desc="Dispatch and complete trips with a single click. Auto-update vehicle availability."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
      <div className="p-4 bg-blue-50 w-fit rounded-2xl mb-8">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
