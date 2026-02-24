import { Link } from "react-router-dom";
import { Shield, BarChart3, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-blue-100 font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <CtaSection />
      </main>
      <Footer />
    </div>);

}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">FleetIQ</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">Features</Link>
          <Link to="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">Pricing</Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">Login</Link>
          <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Get Started
          </Link>
        </div>
      </div>
    </nav>);

}

function HeroSection() {
  return (
    <section className="relative px-6 md:px-12 lg:px-20 py-[120px] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-[900px] mx-auto flex flex-col items-center gap-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight">
          Manage your fleet with <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Zero Friction.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
          The next-generation logistics operating system. Unified tracking, automated dispatching, and maintenance at scale with sub-second synchronization.
        </p>

        <div className="flex flex-row items-center justify-center gap-4 mt-4">
          <Link to="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Go to Dashboard
          </Link>
          <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Watch Demo
          </button>
        </div>
      </div>
    </section>);

}

function FeatureSection() {
  return (
    <section id="features" className="px-6 md:px-12 lg:px-20 py-[120px] bg-white border-y border-gray-100">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Built for the heavy lifters.</h2>
          <p className="text-lg text-gray-600">Everything you need to run a high-performance fleet operation in one unified command center.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="Real-time Dispatch"
            description="Instant synchronization with Odoo. Your drivers get trip details the second you click dispatch." />
          
          <FeatureCard
            icon={Shield}
            title="Compliance Guard"
            description="Automatic license expiry alerts and safety score tracking. Stay compliant without the paperwork." />
          
          <FeatureCard
            icon={BarChart3}
            title="Predictive Analytics"
            description="Gain deep insights into fuel efficiency and ROI per vehicle using verified operational data." />
          
        </div>
      </div>
    </section>);

}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white border border-gray-200 rounded-[20px] shadow-sm hover:-translate-y-1 transition-transform duration-200 h-full">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>);

}

function CtaSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto relative rounded-[24px] overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 pointer-events-none" />
        <div className="relative px-6 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Ready to move with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">Zero Friction?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl">
            Join hundreds of fleet operators who have simplified their logistics workflow today.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
            <Link to="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Launch FleetIQ
            </Link>
            <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-12 bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">F</div>
          <span className="font-semibold text-gray-900 text-sm">FleetIQ</span>
        </div>
        <p className="text-sm text-gray-500">© 2026 FleetIQ SaaS. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy</a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms</a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact</a>
        </div>
      </div>
    </footer>);

}