import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Dumbbell, Menu, X, User, LogOut, Zap } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#equipment', label: 'Equipment' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#trainers', label: 'Trainers' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#120a08]/90 backdrop-blur-xl border-b border-[#ff6b35]/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#ff4500] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#120a08]" />
            </div>
            <span className="font-bold text-lg text-[#f5f5f0]">Body Tone</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-3 py-2 text-sm text-[#a89f9b] hover:text-[#ff6b35] transition-colors rounded-lg hover:bg-[#ff6b35]/10"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/workouts"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#ff6b35] border border-[#ff6b35]/30 rounded-xl hover:bg-[#ff6b35]/10 transition-all"
            >
              <Zap className="w-4 h-4" />
              Track Workout
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c1412]">
                  <User className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-sm text-[#f5f5f0]">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-[#a89f9b] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-[#120a08] rounded-xl hover:shadow-lg hover:shadow-[#ff6b35]/30 transition-all"
              >
                Join Now
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[#f5f5f0]"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#120a08]/95 backdrop-blur-xl border-t border-[#ff6b35]/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-3 text-[#a89f9b] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10 rounded-xl transition-all"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/workouts"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-[#ff6b35] hover:bg-[#ff6b35]/10 rounded-xl transition-all"
            >
              <Zap className="w-4 h-4" />
              Track Workout
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-[#a89f9b] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3 font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-[#120a08] rounded-xl"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
