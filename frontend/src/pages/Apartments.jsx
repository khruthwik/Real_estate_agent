import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, DollarSign, BedDouble, Bath,
  Building
} from 'lucide-react';

export default function PropertyPortfolioSection() {
  const [properties, setProperties] = useState([]);
  const [searchTerm,   setSearchTerm] = useState('');
  const [filterType,   setFilterType] = useState('All');
  const [sortBy,       setSortBy]     = useState('price-desc');

  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(r => r.json())
      .then(setProperties)
      .catch(console.error);
  }, []);

  const filteredAndSorted = properties
    .filter(p => {
      const t = p.title.toLowerCase();
      const a = p.address.toLowerCase();
      const s = searchTerm.toLowerCase();
      const matchSearch = t.includes(s) || a.includes(s);
      const matchType   = filterType === 'All' || p.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a,b) => {
      const num = str => parseFloat(str.replace(/[^0-9.]/g,''));
      if (sortBy==='price-asc')  return str=>num(a.price)-num(b.price);
      if (sortBy==='price-desc') return str=>num(b.price)-num(a.price);
      if (sortBy==='bedrooms-desc') return b.bedrooms - a.bedrooms;
      return 0;
    });

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-950 font-['Outfit',_sans-serif']">
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-10 max-w-5xl mx-auto shadow-3xl animate-float-in">

        {/* Controls */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-50">Property Portfolio</h2>
            <p className="text-gray-400 mt-2">Manage your complete catalog of listed properties.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="pl-12 pr-6 py-3 w-64 rounded-2xl bg-gray-800/80 border border-gray-700 placeholder-gray-500 text-gray-200"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-gray-800/80 border border-gray-700 text-gray-200"
            >
              <option>All</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Townhouse</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-gray-800/80 border border-gray-700 text-gray-200"
            >
              <option value="price-desc">Price ↓</option>
              <option value="price-asc">Price ↑</option>
              <option value="bedrooms-desc">Bedrooms ↓</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSorted.length
            ? filteredAndSorted.map((p, i) => (
              <div key={p._id} className="group bg-black/50 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition">
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs ${
                  p.status==='Available'
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {p.status}
                </div>
                <img
                  src={p.imageUrl||'https://placehold.co/400x250/2d2d2d/999999?text=No+Image'}
                  alt={p.title}
                  className="w-full h-48 object-cover border-b border-gray-800 group-hover:scale-105 transition"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-50">{p.title}</h3>
                  <p className="text-gray-400 text-sm flex items-center my-2">
                    <MapPin className="w-4 h-4 mr-1" /> {p.address}
                  </p>
                  <div className="flex justify-between items-center text-gray-300">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-1" /> {p.price}
                    </div>
                    <span className="flex items-center px-2 py-1 bg-gray-700 text-gray-200 rounded-full text-xs">
                      <Building className="w-3 h-3 mr-1" /> {p.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm mt-4">
                    <div className="flex items-center">
                      <BedDouble className="w-4 h-4 mr-1" /> {p.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" /> {p.bathrooms}
                    </div>
                  </div>
                  <button className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">
                    View Details
                  </button>
                </div>
              </div>
            ))
            : <p className="col-span-full text-center text-gray-400 py-10">No properties found.</p>
          }
        </div>
      </div>
    </div>
  );
}
