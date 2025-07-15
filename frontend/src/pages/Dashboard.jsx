import React, { useState, useEffect } from 'react';
import {
  Home,
  FilePlus,
  ClipboardList,
  Search,
  Grid,
  List,
  User,
  Mail,
  MessageCircle,
  MapPin,
  Star,
  Phone,
  Calendar,
  Building,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X // Ensure X is imported if any sub-component uses it (like image removal)
} from 'lucide-react';

// Import ALL your actual page components
import AddProperty from './Addproperties'; // The actual AddProperty form component
import PropertyPortfolioSection from './Apartments'; // The actual Property Portfolio page component
import Brokercall from './Brokercal'; // The actual Calendar page component


// --- Placeholder for other pages (you'll replace these with your actual page components) ---
const MarketAnalyticsSection = () => (
  <div className="flex-1 p-8 overflow-auto bg-gray-950 text-gray-100 font-['Outfit',_sans-serif']">
    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-10 shadow-3xl text-center">
      <h2 className="text-4xl font-extrabold text-gray-50 mb-4">Market Analytics</h2>
      <p className="text-gray-400 text-lg">Insights and data will appear here.</p>
      <Grid className="w-24 h-24 mx-auto mt-8 text-gray-600"/>
    </div>
  </div>
);

const RevenueReportsSection = () => (
  <div className="flex-1 p-8 overflow-auto bg-gray-950 text-gray-100 font-['Outfit',_sans-serif']">
    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-10 shadow-3xl text-center">
      <h2 className="text-4xl font-extrabold text-gray-50 mb-4">Revenue Reports</h2>
      <p className="text-gray-400 text-lg">Detailed financial reports coming soon!</p>
      <TrendingUp className="w-24 h-24 mx-auto mt-8 text-gray-600"/>
    </div>
  </div>
);
// --- End Placeholder for other pages ---





// Helper function to map paths to section names (component names)
const getSectionFromPath = (path) => {
  switch (path) {
    case '/':
      return 'Leasing Requests';
    case '/add-property':
      return 'Manage Properties';
    case '/property-portfolio':
      return 'Property Portfolio';
    case '/market-analytics':
      return 'Market Analytics';
    case '/revenue-reports':
      return 'Revenue Reports';
    default:
      return 'Leasing Requests'; // Default to dashboard if path is unrecognized
  }
};

export default function StunningLeasingDashboard() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
   const [leases, setLeases] = useState([]); 
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 3;
  
  // Initialize activeSection based on current URL path on component mount
  const [activeSection, setActiveSection] = useState(() => getSectionFromPath(window.location.pathname));

  // Effect to handle browser history navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setActiveSection(getSectionFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Run only once on mount to set up the event listener

  const filtered = leases.filter(l =>
  l.name.toLowerCase().includes(search.toLowerCase()) ||
  l.email.toLowerCase().includes(search.toLowerCase()) ||
  l.location.toLowerCase().includes(search.toLowerCase())
);
 const totalPages = Math.ceil(filtered.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedLeases = filtered.slice(startIndex, startIndex + itemsPerPage);

// Reset to first page when search changes
useEffect(() => {
  setCurrentPage(1);
}, [search]);

  const getInterestColor = (rate) => {
    if (rate >= 8) return 'bg-gray-800 text-gray-50';
    if (rate >= 6) return 'bg-gray-600 text-gray-100';
    return 'bg-gray-200 text-gray-800';
  };

  const getInterestBorder = (rate) => {
    if (rate >= 8) return 'border-gray-700';
    if (rate >= 6) return 'border-gray-500';
    return 'border-gray-300';
  };

  // Define sidebar navigation items with their target paths and corresponding labels
  const navItems = [
    { icon: ClipboardList, label: 'Leasing Requests', path: '/' },
    { icon: FilePlus, label: 'Manage Properties', path: '/add-property' },
    { icon: Home, label: 'Property Portfolio', path: '/property-portfolio' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
  ];

  useEffect(() => {
  if (activeSection === 'Leasing Requests') {
    setLoading(true);
    fetch('http://localhost:5000/api/leases') // <-- Your backend API URL
      .then(res => res.json())
      .then(data => {
        setLeases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch leases:', err);
        setError('Failed to load lease data.');
        setLoading(false);
      });
  }
}, [activeSection]);

  return (
    
    <div className="flex h-screen bg-gray-950 text-gray-100 font-thin overflow-hidden relative">
      {/* Enhanced Subtle Background with Gradient and Noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-black/70 backdrop-blur-xl border-r border-gray-800 flex-shrink-0 relative z-10 shadow-2xl">
        <div className="px-6 py-6 flex items-center border-b border-gray-800">
          <div className="p-2 bg-gray-800 rounded-lg shadow-inner-xl">
            <Building className="w-10 h-10 text-gray-100" />
          </div>
          <div className="ml-4">
            <span className="text-2xl text-gray-50 tracking-tight">
              不動産管理会社
            </span>
            <p className="text-xs text-gray-400 font-thin">Premium Leasing Solutions</p>
          </div>
        </div>
        <nav className="p-6 space-y-2">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.path} // Set the actual href for semantic correctness
              onClick={(e) => {
                e.preventDefault(); // Prevent full page reload
                window.history.pushState(null, '', item.path); // Change URL in browser history
                setActiveSection(item.label); // Update component state to render the correct section
              }}
              // Determine active class based on current activeSection
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeSection === item.label // Use item.label to check for active state
                  ? 'bg-gray-800 border border-gray-700 text-gray-50 shadow-inner-lg'
                  : 'hover:bg-gray-800/60 hover:translate-x-1 text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-thin ">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header - Dynamically update title and tagline based on activeSection */}
        <header className="bg-black/60 backdrop-blur-xl border-b border-gray-800 px-8 py-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl text-gray-50 tracking-tight leading-tight font-thin">
                {activeSection} {/* Dynamic Header Title */}
              </h1>
              <p className="text-gray-400 mt-2 text-lg font-thin">
                {activeSection === 'Leasing Requests' && 'Efficiently manage all client inquiries'}
                {activeSection === 'Manage Properties' && 'List new properties with ease'}
                {activeSection === 'Property Portfolio' && 'Browse and manage your entire property catalog'}
                {activeSection === 'Calendar' && 'Efficiently manage all client appointments and view daily schedules'}
                {activeSection === 'Revenue Reports' && 'Track and analyze your leasing revenue'}
              </p>
            </div>
            {/* Show search/view toggle only for Leasing Requests */}
            
            {activeSection === 'Leasing Requests' && (

              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search clients, emails, locations..."
                    className="pl-12 pr-6 py-3 w-80 rounded-2xl bg-gray-800/80 backdrop-blur-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-300 placeholder-gray-500 text-gray-200 font-thin"
                  />
                </div>
                <div className="flex items-center bg-gray-800/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-700 shadow-inner-lg">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      view === 'grid'
                        ? 'bg-gray-700 text-white shadow-md'
                        : 'hover:bg-gray-800/60 text-gray-400'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('table')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      view === 'table'
                        ? 'bg-gray-700 text-white shadow-md'
                        : 'hover:bg-gray-800/60 text-gray-400'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Conditional Content Rendering based on activeSection */}
       <main className={`flex-1 overflow-auto ${activeSection === 'Leasing Requests' ? 'p-8' : ''}`}>
          {activeSection === 'Leasing Requests' && (
            view === 'table' ? (
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 overflow-hidden shadow-3xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800">
                      {['Client', 'Contact', 'Requirements', 'Interest Level', 'Next Action'].map(col => (
                        <th key={col} className="px-8 py-5 text-left text-sm font-thin uppercase tracking-wider text-gray-300">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filtered.map((lease, idx) => (
                      <tr
                        key={lease.id}
                        className={`hover:bg-gray-800/50 transition-all duration-300 border-l-4 ${getInterestBorder(lease.interest)}`}
                        style={{ animationDelay: `${idx * 80}ms` }}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                              <User className="w-6 h-6 text-gray-100" />
                            </div>
                            <div>
                              <p className="font-thin text-gray-50 text-lg">{lease.name}</p>
                              <p className="text-sm text-gray-400 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                                {lease.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
<span className="text-gray-300 truncate max-w-[180px] block">{lease.email}</span>                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-gray-300">{lease.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-300 leading-relaxed">{lease.summary}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-xs font-thin border border-gray-700">
                                {lease.propertyType}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getInterestColor(lease.interest).split(' ')[0]} ${getInterestColor(lease.interest).split(' ')[1]}`}
                                style={{ width: `${lease.interest * 10}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-100 font-thin">{lease.interest}/10</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-thin transition-all duration-300 transform hover:scale-105 shadow-md">
                            {lease.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-h-full">
                {paginatedLeases.map((lease, idx) => (
                  <div
                    key={lease.id}
                    className={`group bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-black/50 shadow-3xl ${getInterestBorder(lease.interest)} animate-fade-in min-w-0 flex flex-col`}
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-500/30 border border-gray-700 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                          <User className="w-9 h-9 text-gray-300 font-thin" />
                        </div>
                        <div>
                          <h3 className="text-2xl text-gray-300 leading-relaxed line-clamp-1 break-words font-extralight overflow-hidden">{lease.name}</h3>
                          <p className="text-gray-400 flex items-center text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                            {lease.location}
                          </p>
                        </div>
                      </div>
                    
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6 border-b border-gray-800 pb-6">
                      <div className="flex items-center text-base">
                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-gray-300">{lease.email}</span>
                      </div>
                      <div className="flex items-center text-base">
                        <Phone className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-gray-300">{lease.phone}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6 flex-1 min-h-0">
                      <div className="flex items-start mb-3">
                        <MessageCircle className="w-6 h-6 text-gray-500 mr-3 mt-1 flex-shrink-0" />
<p className="text-base text-gray-300 leading-relaxed line-clamp-2 break-words overflow-hidden">{lease.summary}</p>                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center justify-between mb-6 border-t border-gray-800 pt-6">
                      <span className="px-4 py-2 bg-gray-800 text-gray-200 rounded-2xl text-sm font-thin border border-gray-700 shadow-inner">
                        {lease.propertyType}
                      </span>
                      <span className="text-gray-200 font-thin text-xl">{lease.budget}</span>
                    </div>

                    {/* Interest Level */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-thin text-gray-400">Client Interest</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-100 font-thin">{lease.interest}/10</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-3">
                        <div
                          className={`h-3 bg-gray-300 rounded-full ${getInterestColor(lease.interest).split(' ')[0]} transition-all duration-1000`}
                          style={{ width: `${lease.interest * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-4 bg-black/40 border border-gray-800 hover:bg-gray-600 text-white rounded-2xl font-thin transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center mt-auto flex-shrink-0">
  <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
  <span className="truncate max-w-[150px]">{lease.action}</span>
</button>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
    <div className="flex items-center justify-center mt-8 space-x-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 bg-black/40 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-thin transition-all duration-300 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>
      
      <div className="flex items-center space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-xl font-thin transition-all duration-300 ${
              currentPage === i + 1
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 '
                : 'bg-black/40 border border-gray-800 text-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-thin transition-all duration-300 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  )}
</div>
            )
          )}

          {/* Render the correct component based on activeSection */}
          {activeSection === 'Manage Properties' && <AddProperty />} {/* Renders the actual AddProperty component */}
          {activeSection === 'Property Portfolio' && <PropertyPortfolioSection />} {/* Renders the actual PropertyPortfolioSection */}
          {activeSection === 'Market Analytics' && <MarketAnalyticsSection />}
          <div>
            {activeSection === 'Calendar' && (
             <div className="">
              <Brokercall />
            </div>
          )}
          </div>
          
        </main>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        /* Custom shadow styles (from dashboard) */
        .shadow-inner-xl {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.6), inset 0 -2px 4px 0 rgba(255, 255, 255, 0.05);
        }
        .shadow-inner-lg {
          box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.03);
        }
        .shadow-3xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
