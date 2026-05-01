import { Phone, Instagram, MapPin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0d0705] border-t border-[#2a201c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-[#f5f5f0] mb-4">
              Body <span className="text-gradient">Tone</span>
            </h3>
            <p className="text-sm text-[#a89f9b] mb-4 leading-relaxed">
              Hubballi's premier fitness destination. 3 floors of premium equipment, expert coaches, and an unmatched training atmosphere.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/918660169891"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-all"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35] hover:bg-[#ff6b35]/30 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#f5f5f0] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Features', 'Equipment', 'Pricing', 'Schedule', 'Trainers'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-[#a89f9b] hover:text-[#ff6b35] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/workouts" className="text-sm text-[#a89f9b] hover:text-[#ff6b35] transition-colors">
                  Workout Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Memberships */}
          <div>
            <h4 className="font-bold text-[#f5f5f0] mb-4">Memberships</h4>
            <ul className="space-y-2">
              {[
                { name: 'Starter - ₹1,999/mo', href: 'https://wa.me/918660169891?text=Hi!%20I\'m%20interested%20in%20the%20Starter%20plan' },
                { name: 'Pro - ₹4,999/3mo', href: 'https://wa.me/918660169891?text=Hi!%20I\'m%20interested%20in%20the%20Pro%20plan' },
                { name: 'Elite - ₹8,999/6mo', href: 'https://wa.me/918660169891?text=Hi!%20I\'m%20interested%20in%20the%20Elite%20plan' },
                { name: 'Legend - ₹14,999/yr', href: 'https://wa.me/918660169891?text=Hi!%20I\'m%20interested%20in%20the%20Legend%20plan' },
              ].map((plan) => (
                <li key={plan.name}>
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#a89f9b] hover:text-[#ff6b35] transition-colors"
                  >
                    {plan.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[#f5f5f0] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#a89f9b]">
                <MapPin className="w-4 h-4 text-[#ff6b35] mt-0.5 shrink-0" />
                4th Floor, Arihant Elite Complex, Vidya Nagar, Hubballi, 580031
              </li>
              <li>
                <a href="tel:+918660169891" className="flex items-center gap-2 text-sm text-[#a89f9b] hover:text-[#ff6b35] transition-colors">
                  <Phone className="w-4 h-4 text-[#ff6b35]" />
                  +91 86601 69891
                </a>
              </li>
              <li className="text-sm text-[#a89f9b]">
                Open 7 days: 5:00 AM - 10:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a201c] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#a89f9b]">
            © 2026 Body Tone Fitness. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-[#ff6b35] hover:text-[#ff9f1c] transition-colors"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
