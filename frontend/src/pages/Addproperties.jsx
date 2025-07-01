import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Home, MapPin, Bed, Bath, Square, DollarSign, Heart, Car, ParkingCircle, Loader2, X, AlertCircle } from 'lucide-react'; // Added Loader2, X, AlertCircle
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion'; // For future animations, kept as a good practice


const propertyService = {
  async getAllProperties() {
    const response = await fetch('http://localhost:5000/api/properties');
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async getProperty(id) {
    const response = await fetch(`http://localhost:5000/api/properties/${id}`);
    if (!response.ok) throw new Error('Failed to fetch property');
    return response.json();
  },

  async createProperty(data) {
    const response = await fetch(`http://localhost:5000/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create property');
    }
    return response.json();
  },

  async updateProperty(id, data) {
    const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update property');
    }
    return response.json();
  },

  async deleteProperty(id) {
    const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete property');
    }
    return response.json();
  },

  async searchProperties(queryVector) {
    const response = await fetch(`http://localhost:5000/api/properties/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query_vector: queryVector }),
    });
    if (!response.ok) throw new Error('Failed to search properties');
    return response.json();
  }
};

// Property Card Component
const PropertyCard = ({ property, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
<div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl overflow-hidden border border-gray-800 transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-4xl">
      <div className="relative h-48 bg-gray-900 flex items-center justify-center">
        {property.imageUrl && !imageError ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-thin shadow-md">
          ${property.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-thin text-gray-50 mb-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-1 text-indigo-400" />
          <span className="text-sm font-thin">{property.address}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1 text-purple-400" />
            <span className=' font-thin'>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1 text-teal-400" />
            <span className=' font-thin'>{property.bathrooms} bath</span>
          </div>
          {property.sqft && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-yellow-400" />
              <span className=' font-thin'>{property.sqft} sqft</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-3">
          <span className="bg-gray-800 px-3 py-1 rounded-full">{property.type}</span>
        </div>

        {(property.features?.petFriendly || property.features?.parking) && (
          <div className="flex items-center space-x-4 mb-3">
            {property.features.petFriendly && (
              <div className="flex items-center text-emerald-400 text-xs px-2 py-1 bg-gray-800 rounded-full">
                <Heart className="w-3 h-3 mr-1" />
                <span className=' font-thin'>Pet Friendly</span>
              </div>
            )}
            {property.features.parking && (
              <div className="flex items-center text-blue-400 text-xs px-2 py-1 bg-gray-800 rounded-full">
                <Car className="w-3 h-3 mr-1" />
                <span className=' font-thin'>Parking</span>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-300 font-thin text-sm mb-4 overflow-hidden transition-all duration-700 max-h-10 hover:max-h-96">{property.description}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(property)}
            className="flex-1 bg-black/60 border text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm font-thin shadow-md"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="flex-1 border text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-thin shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Property Form Component
const AddPropertyForm = ({ property, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [features, setFeatures] = useState({
    petFriendly: false,
    parking: false,
  });

  useEffect(() => {
    if (property) {
      setTitle(property.title || '');
      setAddress(property.address || '');
      setPrice(property.price || '');
      setType(property.type || '');
      setBedrooms(property.bedrooms || '');
      setBathrooms(property.bathrooms || '');
      setSqft(property.sqft || '');
      setDescription(property.description || '');
      setImageUrl(property.imageUrl || '');
      setFeatures({
        petFriendly: property.features?.petFriendly || false,
        parking: property.features?.parking || false,
      });
    } else {
      // Reset form when adding new property
      setTitle('');
      setAddress('');
      setPrice('');
      setType('');
      setBedrooms('');
      setBathrooms('');
      setSqft('');
      setDescription('');
      setImageUrl('');
      setFeatures({ petFriendly: false, parking: false });
    }
    setError(''); // Clear error on property change
  }, [property]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      title,
      address,
      price: parseFloat(price),
      type,
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseFloat(bathrooms),
      sqft: sqft ? parseInt(sqft, 10) : null,
      description,
      imageUrl: imageUrl || null,
      features,
      info_text: description, // Ensure info_text is always set
      info_vector: [], // Ensure info_vector is present if needed by backend
      createdAt: property ? property.createdAt : new Date().toISOString(), // Preserve createdAt for edits
    };

    try {
      if (property) {
        await propertyService.updateProperty(property.id, payload); // Use service
      } else {
        await propertyService.createProperty(payload); // Use service
      }
      onSave();
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to save property: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl p-6 border border-gray-800">
      <h2 className="text-2xl font-thin text-gray-50 mb-6 flex items-center">
        <Home className="w-6 h-6 mr-2 text-indigo-400" />
        {property ? 'Edit Property' : 'Add New Property'}
      </h2>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4"> {/* Added form tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Property Title <span className="text-red-400">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="Beautiful Family Home"
            />
          </div>

          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Property Type <span className="text-red-400">*</span></label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              name="type"
              required
              className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" className="bg-gray-900 font-thin text-gray-400">Select Type</option>
              <option value="house" className="bg-gray-900 font-thin text-white">House</option>
              <option value="apartment" className="bg-gray-900 font-thin text-white">Apartment</option>
              <option value="condo" className="bg-gray-900 font-thin text-white">Condo</option>
              <option value="townhouse" className="bg-gray-900 font-thin text-white">Townhouse</option>
              <option value="studio" className="bg-gray-900 font-thin text-white">Studio</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-thin text-gray-300 mb-1">Address <span className="text-red-400">*</span></label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            name="address"
            required
            className="w-full px-3 py-2 font-thin bg-gray-900 font-thin border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            placeholder="123 Main Street, City, State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Price ($) <span className="text-red-400">*</span></label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 font-thin bg-gray-900 font-thin border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Bedrooms <span className="text-red-400">*</span></label>
            <input
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              type="number"
              name="bedrooms"
              required
              min="0"
              className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Bathrooms <span className="text-red-400">*</span></label>
            <input
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              type="number"
              name="bathrooms"
              required
              min="0"
              step="0.5"
              className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-thin text-gray-300 mb-1">Square Feet</label>
            <input
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              type="number"
              name="sqft"
              min="0"
              className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="1500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-thin text-gray-300 mb-1">Description <span className="text-red-400">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            required
            rows="4"
            className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            placeholder="Describe the property features, location, and amenities..."
          />
        </div>

        <div>
          <label className="block text-sm font-thin text-gray-300 mb-1">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            type="url"
            name="imageUrl"
            className="w-full px-3 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-thin text-gray-300">Features</label>
          <div className="flex space-x-4">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name="petFriendly"
                checked={features.petFriendly}
                onChange={(e) =>
                  setFeatures(prev => ({ ...prev, petFriendly: e.target.checked }))
                }
                className="mr-2 h-4 w-4 text-indigo-600 bg-gray-900 border-gray-700 rounded focus:ring-indigo-500"
              />
              <span className="text-sm">Pet Friendly</span>
            </label>

            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name="parking"
                checked={features.parking}
                onChange={(e) =>
                  setFeatures(prev => ({ ...prev, parking: e.target.checked }))
                }
                className="mr-2 h-4 w-4 text-indigo-600 bg-gray-900 border-gray-700 rounded focus:ring-indigo-500"
              />
              <span className="text-sm">Parking Available</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-thin shadow-md"
          >
            {isSubmitting ? 'Saving...' : property ? 'Update Property' : 'Add Property'}
          </button>
          {property && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-thin shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};




// Search Component
const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setsearchTerm] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setsearchTerm('');
    onClear();
  };
  

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 w-full sm:w-auto">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2 font-thin bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
        />
      </div>
      <button
        type="submit"
        className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-thin shadow-md"
      >
        Search
      </button>
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors font-thin shadow-md"
        >
          Clear
        </button>
      )}
    </form>
  );
};

// Main App Component
export default function PropertyManagementApp() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const gridRef = useRef(null);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
      setFilteredProperties(data);
      setError('');
    } catch (error) {
      console.error("Failed to load properties:", error);
      setError('Failed to load properties. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
  if (!searchTerm.trim()) {
    setFilteredProperties(properties);
    setError('');
    return;
  }

  const filtered = properties.filter(property =>
    (property.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (property.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (property.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (property.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  setFilteredProperties(filtered);

  if (filtered.length === 0) {
    setError('No properties found matching your search criteria. Try a different search.');
  } else {
    setError('');
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Delay ensures DOM is updated before scrolling
  }
};

  const handleClearSearch = () => {
    setFilteredProperties(properties);
    setError(''); // Clear error on clear search
  };

  const handleAddProperty = () => {
    setShowAddForm(true);
    setEditingProperty(null);
    setError(''); // Clear any previous errors
  };

  const formRef = useRef(null);

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowAddForm(true);
    setError(''); // Clear any previous errors

     setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      await loadProperties();
      setError('');
    } catch (error) {
      setError('Failed to delete property: ' + error.message);
    }
  };

  const handleFormSave = async () => {
    await loadProperties();
    setShowAddForm(false);
    setEditingProperty(null);
    setError(''); // Clear error after successful save
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingProperty(null);
    setError(''); // Clear error on cancel
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center font-['Outfit',_sans-serif'] relative overflow-hidden">
        {/* Background gradient/noise */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-3xl border border-gray-800 relative z-10">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-lg font-thin text-gray-300">Loading properties...</span>
          </div>
        </div>
      </div>
    );
  }


  return (
   
    <div className="bg-gray-950 font-['Outfit',_sans-serif'] relative overflow-auto py-8">
      {/* Background gradient/noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
       

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 shadow-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 p-6 bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <button
            onClick={handleAddProperty}
            className=" bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-2 font-thin shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={formRef}
            className="mb-8"
          >
            <AddPropertyForm
              property={editingProperty}
              onSave={handleFormSave}
              onCancel={editingProperty ? handleFormCancel : undefined}
            />
          </motion.div>
        )}

        {/* Properties Grid */}
        <AnimatePresence mode="wait">
          {filteredProperties.length === 0 ? (
            <motion.div
              key="no-properties"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl border border-gray-800 text-gray-300"
            >
              <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-thin text-gray-50 mb-2">No properties found</h3>
              <p className="text-gray-400 mb-4">
                {properties.length === 0 
                  ? "Get started by adding your first property to the database."
                  : "Try adjusting your search criteria or clear the search."
                }
              </p>
              {properties.length === 0 && (
                <button
                  onClick={handleAddProperty}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-thin shadow-md"
                >
                  Add Your First Property
                </button>
              )}
            </motion.div>
          ) : (
            
            <motion.div
              key="properties-grid"
              ref={gridRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <PropertyCard
                    property={property}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        {properties.length > 0 && (
          <div className="mt-8 bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl p-6 border border-gray-800">
            <h3 className="text-xl font-thin text-gray-50 mb-4">Portfolio Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-thin text-indigo-400">{properties.length}</div>
                <div className="text-sm text-gray-400">Total Properties</div>
              </div>
              <div>
                <div className="text-3xl font-thin text-emerald-400">
                  ${properties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
              <div>
                <div className="text-3xl font-thin text-purple-400">
                  ${Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Average Price</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        /* Custom scrollbar for dark theme */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.25);
        }

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
      `}</style>
    </div>
  );
}