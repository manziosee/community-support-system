import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Users, MapPin, CheckCircle, ArrowRight, Zap, Shield, 
  Clock, Award, Globe, Sparkles, Star, TrendingUp
} from 'lucide-react';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-sky-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="sm" />
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 font-semibold">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-50"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 left-1/2 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-sky-100 border border-sky-300 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-slide-down">
              <Sparkles className="h-4 w-4" />
              <span>Rwanda's #1 Community Support Platform</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 bg-clip-text text-transparent">
                Build Stronger
              </span>
              <br />
              <span className="text-sky-900">Communities Together</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-sky-700 mb-10 leading-relaxed max-w-3xl mx-auto animate-slide-up">
              Connect with volunteers and citizens across Rwanda. Request help, offer support, 
              and make a real difference in your community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto px-8 py-4 text-lg bg-sky-600 hover:bg-sky-700 text-white shadow-lg font-bold">
                  Join as Volunteer
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-sky-500 hover:bg-sky-600 text-white shadow-lg font-bold">
                  Request Help
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-sky-700 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                </div>
                <span className="font-medium">Verified Volunteers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-sky-600" />
                </div>
                <span className="font-medium">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <Globe className="h-5 w-5 text-sky-600" />
                </div>
                <span className="font-medium">All 30 Districts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,000+', label: 'Active Users', gradient: 'from-sky-500 to-sky-600' },
              { value: '500+', label: 'Volunteers', gradient: 'from-sky-400 to-sky-500' },
              { value: '2,000+', label: 'Completed', gradient: 'from-sky-600 to-sky-700' },
              { value: '30', label: 'Districts', gradient: 'from-sky-500 to-sky-600' },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sky-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-sky-600 max-w-2xl mx-auto">
              Built specifically for Rwanda's communities with powerful features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'For Citizens',
                description: 'Post requests for help with daily tasks. Get matched with skilled volunteers in your district who are ready to assist you.',
                gradient: 'from-sky-400 to-sky-500',
              },
              {
                icon: Heart,
                title: 'For Volunteers',
                description: 'Share your skills and make an impact. Browse requests, accept assignments, and help build stronger communities.',
                gradient: 'from-sky-500 to-sky-600',
              },
              {
                icon: MapPin,
                title: 'Location-Based',
                description: 'Designed for Rwanda\'s structure. Connect with people in your province, district, sector, cell, and village.',
                gradient: 'from-sky-400 to-sky-500',
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-sky-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-sky-900 mb-4">{feature.title}</h3>
                  <p className="text-sky-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-6">
                Fast, Reliable, Community-Driven
              </h2>
              <p className="text-xl text-sky-600 mb-8">
                Our platform makes it easy to give and receive help within your community. 
                Built with modern technology and designed for Rwandan communities.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Clock,
                    title: 'Quick Response Time',
                    description: 'Get matched with volunteers within minutes of posting your request',
                    bgColor: 'bg-sky-100',
                    iconColor: 'text-sky-600',
                  },
                  {
                    icon: Shield,
                    title: 'Verified Volunteers',
                    description: 'All volunteers are verified to ensure safe and reliable assistance',
                    bgColor: 'bg-sky-100',
                    iconColor: 'text-sky-600',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Track Progress',
                    description: 'Monitor your requests and assignments in real-time with notifications',
                    bgColor: 'bg-sky-100',
                    iconColor: 'text-sky-600',
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`${benefit.bgColor} p-3 rounded-xl flex-shrink-0`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-900 mb-1 text-lg">{benefit.title}</h4>
                      <p className="text-sky-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: 'Top Rated', subtitle: 'Trusted by thousands', gradient: 'from-sky-400 to-sky-500' },
                { icon: Zap, title: 'Fast Setup', subtitle: 'Start in 5 minutes', gradient: 'from-sky-500 to-sky-600' },
                { icon: Globe, title: 'Nationwide', subtitle: 'All 30 districts', gradient: 'from-sky-400 to-sky-500' },
                { icon: Users, title: 'Community', subtitle: 'Growing network', gradient: 'from-sky-500 to-sky-600' },
              ].map((card, index) => (
                <div key={index} className={`bg-gradient-to-br ${card.gradient} p-8 rounded-2xl text-white shadow-lg transition-transform duration-300 ${index % 2 === 1 ? 'mt-8' : ''}`}>
                  <card.icon className="h-12 w-12 mb-4" />
                  <h4 className="text-2xl font-bold mb-2">{card.title}</h4>
                  <p className="text-white/90">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              Services We Support
            </h2>
            <p className="text-xl text-sky-600">
              Wide range of community assistance available
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Grocery Shopping', gradient: 'from-sky-400 to-sky-500' },
              { name: 'Transportation', gradient: 'from-sky-500 to-sky-600' },
              { name: 'Tech Support', gradient: 'from-sky-400 to-sky-500' },
              { name: 'Tutoring', gradient: 'from-sky-500 to-sky-600' },
              { name: 'Healthcare', gradient: 'from-sky-400 to-sky-500' },
              { name: 'Delivery', gradient: 'from-sky-500 to-sky-600' },
              { name: 'Home Repairs', gradient: 'from-sky-400 to-sky-500' },
              { name: 'Agriculture', gradient: 'from-sky-500 to-sky-600' }
            ].map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-sky-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sky-900">{service.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-6">
            <Star className="h-4 w-4" />
            <span>Join Our Growing Community</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of Rwandans building stronger communities through mutual support. 
            Whether you need help or want to volunteer, start today.
          </p>
          <Link to="/register">
            <button className="inline-flex items-center justify-center bg-white text-sky-700 px-10 py-5 text-lg shadow-lg font-bold rounded-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <Logo size="md" variant="white" />
              <p className="text-sky-200 leading-relaxed max-w-md mt-6 mb-6">
                Connecting Rwandan communities through technology. Our platform enables citizens 
                to request help and volunteers to provide assistance across all 30 districts.
              </p>
              <div className="flex items-center space-x-2 text-sm text-sky-200">
                <MapPin className="h-4 w-4" />
                <span>Serving all of Rwanda</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Platform</h3>
              <ul className="space-y-3 text-sky-200">
                <li><Link to="/register" className="hover:text-white transition-colors">Join as Volunteer</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Request Help</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-3 text-sky-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sky-800 pt-8 text-center">
            <p className="text-sky-200">
              © 2025 Community Support System. Built for Rwanda with <Heart className="inline h-4 w-4 text-sky-400" fill="currentColor" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
