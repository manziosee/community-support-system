import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart, Users, MapPin, CheckCircle, ArrowRight, Shield,
  Award, Globe, Sparkles, TrendingUp, HandHeart,
  FileText, Star, Clock,
} from 'lucide-react';
import Logo from '../components/common/Logo';
import { AVAILABLE_LANGUAGES } from '../contexts/LanguageContext';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      'This platform connected me with an amazing volunteer in Kigali within hours. I couldn\'t believe how fast I got help—it truly felt like community care in action.',
    name: 'Amara Mutesi',
    role: 'Citizen, Kigali',
    initials: 'AM',
    gradient: 'from-[#0d9488] to-[#0f766e]',
  },
  {
    quote:
      'As a volunteer I\'ve used my tech skills to help over 30 families. The platform makes finding requests and tracking my impact effortlessly simple.',
    name: 'Jean-Paul Nkurunziza',
    role: 'Volunteer, Huye',
    initials: 'JN',
    gradient: 'from-[#6366f1] to-[#4f46e5]',
  },
  {
    quote:
      'Our district\'s response time improved by 60 % after adopting this system. Managing volunteers and tracking requests across all sectors has never been this clear.',
    name: 'Christine Uwase',
    role: 'Community Admin, Musanze',
    initials: 'CU',
    gradient: 'from-[#f59e0b] to-[#6366f1]',
  },
];

const steps = [
  {
    step: '01',
    icon: Users,
    titleKey: 'landing_step1_title',
    descKey: 'landing_step1_desc',
    gradient: 'from-[#0d9488] to-[#0f766e]',
  },
  {
    step: '02',
    icon: FileText,
    titleKey: 'landing_step2_title',
    descKey: 'landing_step2_desc',
    gradient: 'from-[#6366f1] to-[#4f46e5]',
  },
  {
    step: '03',
    icon: Heart,
    titleKey: 'landing_step3_title',
    descKey: 'landing_step3_desc',
    gradient: 'from-[#f59e0b] to-[#d97706]',
  },
];

const roles = [
  {
    badge: 'For Citizens',
    icon: Users,
    gradient: 'from-[#0d9488] to-[#0f766e]',
    bg: 'bg-gray-50 dark:bg-neutral-900',
    border: 'border-gray-200 dark:border-neutral-700',
    iconBg: 'bg-[#eff6ff] dark:bg-neutral-800',
    iconColor: 'text-[#2563eb] dark:text-[#93c5fd]',
    badgeColor: 'bg-[#eff6ff] dark:bg-neutral-800 text-[#1d4ed8] dark:text-[#93c5fd]',
    title: 'Get the Help You Need',
    description:
      'Post requests for any kind of assistance and get matched with skilled volunteers in your local area.',
    features: ['Quick request posting', 'Location-based matching', 'Real-time status tracking', 'Instant notifications'],
    cta: 'Request Help',
  },
  {
    badge: 'For Volunteers',
    icon: Heart,
    gradient: 'from-[#6366f1] to-[#4f46e5]',
    bg: 'bg-gray-50 dark:bg-neutral-900',
    border: 'border-gray-200 dark:border-neutral-700',
    iconBg: 'bg-[#faf5ff] dark:bg-neutral-800',
    iconColor: 'text-[#7c3aed] dark:text-[#c4b5fd]',
    badgeColor: 'bg-[#faf5ff] dark:bg-neutral-800 text-[#7c3aed] dark:text-[#c4b5fd]',
    title: 'Make a Real Impact',
    description:
      'Browse requests that match your skills and schedule. Help your neighbors and build a stronger, more connected community.',
    features: ['Skill-based matching', 'Flexible scheduling', 'Track your impact', 'Build community reputation'],
    cta: 'Start Volunteering',
  },
  {
    badge: 'For Admins',
    icon: Award,
    gradient: 'from-gray-700 to-gray-900',
    bg: 'bg-gray-50 dark:bg-neutral-900',
    border: 'border-gray-200 dark:border-neutral-700',
    iconBg: 'bg-gray-100 dark:bg-neutral-800',
    iconColor: 'text-gray-600 dark:text-gray-300',
    badgeColor: 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300',
    title: 'Manage with Clarity',
    description:
      'Full visibility into your community\'s support network. Manage users, monitor requests, and view analytics from one dashboard.',
    features: ['Full system analytics', 'User management', 'Request oversight', 'Location management'],
    cta: 'Learn More',
  },
];

const services = [
  { name: 'Grocery Shopping', emoji: '🛒' },
  { name: 'Transportation', emoji: '🚗' },
  { name: 'Tech Support', emoji: '💻' },
  { name: 'Tutoring', emoji: '📚' },
  { name: 'Healthcare', emoji: '🏥' },
  { name: 'Delivery', emoji: '📦' },
  { name: 'Home Repairs', emoji: '🔧' },
  { name: 'Agriculture', emoji: '🌾' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                {t('landing_how_it_works')}
              </a>
              <a href="#services" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                {t('landing_features')}
              </a>
              <a href="#community" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                {t('section_community')}
              </a>
            </nav>
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  title={t('common_language')}
                >
                  <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-2 z-50">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setShowLangMenu(false); }}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700 ${lang.code === i18n.language ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/login">
                <button className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800">
                  {t('action_login')}
                </button>
              </Link>
              <Link to="/register">
                <button className="text-sm font-bold bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-soft">
                  {t('action_get_started')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Clean monochrome background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white dark:bg-black" />
          <div className="absolute -top-20 left-1/4 w-[700px] h-[700px] bg-gray-100 dark:bg-gray-900 rounded-full filter blur-[140px] animate-pulse-slow opacity-60" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-gray-100 dark:bg-gray-900 rounded-full filter blur-[120px] animate-pulse-slow opacity-40" style={{ animationDelay: '1.5s' }} />
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Content ── */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-slide-down">
                <Sparkles className="w-4 h-4" />
                Rwanda's #1 Community Support Platform
              </div>

              {/* Heading */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 animate-slide-up text-gray-900 dark:text-white">
                {t('landing_hero_title')}
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-neutral-600 mb-10 leading-relaxed max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {t('landing_hero_subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/register">
                  <button className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-xl text-lg font-bold shadow-soft transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5">
                    {t('landing_for_volunteers')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/register">
                  <button className="inline-flex items-center justify-center gap-2 bg-white dark:bg-transparent text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-bold shadow-sm transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5">
                    {t('landing_for_citizens')}
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-neutral-600 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: CheckCircle, label: 'Verified Volunteers' },
                  { icon: Shield, label: 'Secure Platform' },
                  { icon: Globe, label: 'All 30 Districts' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Visual hub + floating stat cards ── */}
            <div className="relative hidden lg:flex items-center justify-center min-h-[540px]">
              {/* Central brand illustration */}
              <div className="relative w-64 h-64 z-10">
                <div className="absolute inset-0 bg-gray-100 rounded-3xl -rotate-6 scale-105" />
                <div className="absolute inset-0 bg-gray-900 rounded-3xl flex items-center justify-center shadow-glow rotate-3 hover:rotate-0 transition-transform duration-700 group">
                  <HandHeart className="w-28 h-28 text-white opacity-90 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* Floating Card: Active Volunteers */}
              <div className="absolute top-6 right-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-neutral-700 p-4 flex items-center gap-3 animate-float z-20">
                <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 leading-tight">500+</p>
                  <p className="text-xs text-gray-500">{t('landing_active_volunteers')}</p>
                </div>
              </div>

              {/* Floating Card: Requests Completed */}
              <div className="absolute bottom-8 right-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-neutral-700 p-4 flex items-center gap-3 z-20" style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
                <div className="w-10 h-10 bg-[#0d9488] rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 leading-tight">2,000+</p>
                  <p className="text-xs text-gray-500">{t('landing_requests_completed')}</p>
                </div>
              </div>

              {/* Floating Card: Districts */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-neutral-700 p-4 flex items-center gap-3 z-20" style={{ animation: 'float 6s ease-in-out 1s infinite' }}>
                <div className="w-10 h-10 bg-[#f0fdf4] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 leading-tight">30</p>
                  <p className="text-xs text-gray-500">{t('landing_districts_covered')}</p>
                </div>
              </div>

              {/* Floating Card: Active Users */}
              <div className="absolute top-4 left-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-neutral-700 p-4 flex items-center gap-3 z-20" style={{ animation: 'float 6s ease-in-out 3s infinite' }}>
                <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 leading-tight">1,000+</p>
                  <p className="text-xs text-neutral-500">{t('landing_active_users')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-400 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 bg-neutral-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS STRIP (Dark)
      ═══════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 bg-gray-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-neutral-800">
            {[
              { value: '1,000+', label: t('landing_stats_users'), color: 'text-gray-200', icon: Users },
              { value: '500+', label: t('landing_stats_volunteers'), color: 'text-gray-300', icon: Award },
              { value: '2,000+', label: t('landing_stats_requests'), color: 'text-white', icon: CheckCircle },
              { value: '30', label: t('nav_locations'), color: 'text-gray-200', icon: MapPin },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center px-4 ${statsVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3 opacity-70`} />
                <div className={`font-display text-4xl md:text-5xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-neutral-400 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-gray-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('landing_how_it_works')}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Get started in minutes. Connect with your community effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-[3.5rem] left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-soft hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-display text-6xl font-black text-neutral-100 dark:text-neutral-700 leading-none select-none">{step.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{t(step.titleKey)}</h3>
                  <p className="text-neutral-600 leading-relaxed">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOR EVERYONE (Role Cards)
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-gray-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              For Everyone
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Your Role
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Whether you need help or want to give it, we have everything you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, i) => (
              <div key={i} className={`${role.bg} border ${role.border} rounded-2xl p-8 hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group flex flex-col`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 ${role.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className={`w-6 h-6 ${role.iconColor}`} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${role.badgeColor}`}>{role.badge}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed flex-1">{role.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {role.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-neutral-700">
                      <CheckCircle className={`w-4 h-4 ${role.iconColor} flex-shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className={`w-full bg-gradient-to-r ${role.gradient} text-white font-bold py-3.5 rounded-xl hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2`}>
                    {role.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════ */}
      <section id="services" className="py-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-gray-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              What We Support
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('landing_features')}
            </h2>
            <p className="text-xl text-neutral-600">
              Wide range of community assistance available across Rwanda
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-soft hover:-translate-y-1 hover:border-gray-300 dark:hover:border-neutral-500 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.emoji}</div>
                <p className="font-semibold text-gray-800 text-sm">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section id="community" className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-gray-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Community Voices
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Rwandans
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Real stories from citizens, volunteers, and community leaders across Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Stars */}
                <div className="flex mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-neutral-700 leading-relaxed mb-6 italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                  <div className={`w-10 h-10 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-28 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full filter blur-[120px]" />
          <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-white/5 rounded-full filter blur-[100px]" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.04 }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
            <Star className="w-4 h-4 text-gray-300 fill-gray-300" />
            Join 1,000+ Rwandans Making a Difference
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {t('landing_cta_title')}
          </h2>
          <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
            {t('landing_cta_subtitle')}
          </p>
          <Link to="/register">
            <button className="inline-flex items-center gap-3 bg-white hover:bg-neutral-100 text-[#111827] px-10 py-5 rounded-xl text-lg font-black shadow-lg hover:shadow-xl transition-all duration-300">
              {t('action_get_started')}
              <ArrowRight className="w-6 h-6 text-[#111827]" />
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <Logo size="md" variant="white" />
              <p className="text-neutral-400 leading-relaxed max-w-md mt-6 mb-6">
                {t('landing_footer_desc')}
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{t('landing_footer_serving')}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-5">{t('landing_footer_platform')}</h3>
              <ul className="space-y-3">
                <li><Link to="/register" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_join_volunteer')}</Link></li>
                <li><Link to="/register" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_request_help')}</Link></li>
                <li><Link to="/login" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_sign_in')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-5">{t('landing_footer_support')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_help_center')}</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_contact')}</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">{t('landing_footer_privacy')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Community Support System. Built for Rwanda with{' '}
              <Heart className="inline w-4 h-4 text-gray-400 fill-current" />
            </p>
            <p className="text-neutral-600 text-xs">{t('landing_footer_tagline')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
