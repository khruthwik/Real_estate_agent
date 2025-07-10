import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Car,
  X,
  Calendar,
  Phone,
  Mail,
  Share2,
  Calculator,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  Trees,
  Camera,
  FileText,
  Star,
  DollarSign,
  Map,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';


const PropertyDetailsModal = ({ property, onClose, onPropertyAction, sidebarOpen}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'gallery', label: 'Gallery', icon: Camera }
  ];

  const images = property.images || [property.imageUrl || ''].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSaveProperty = async () => {
    if (onPropertyAction) {
    await onPropertyAction('save', property);
  }
  setIsSaving(true);
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      alert("Please login first to save properties.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/properties/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id || user.email,
        property: property
      })
    });

    if (response.ok) {
      setIsSaved(true);
      alert("Property saved successfully!");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to save property.");
    }
  } catch (error) {
    console.error('Error saving property:', error);
    alert("An error occurred while saving the property.");
  } finally {
    setIsSaving(false);
  }
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div className="space-y-4">
                <h3 className="text-xl font-thin text-white mb-3">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center text-purple-300 mb-2">
                      <Bed className="w-5 h-5 mr-2" />
                      <span className="font-medium">Bedrooms</span>
                    </div>
                    <p className="text-2xl font-thin text-white">{property.bedrooms}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center text-teal-300 mb-2">
                      <Bath className="w-5 h-5 mr-2" />
                      <span className="font-medium">Bathrooms</span>
                    </div>
                    <p className="text-2xl font-thin text-white">{property.bathrooms}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center text-yellow-300 mb-2">
                      <Square className="w-5 h-5 mr-2" />
                      <span className="font-medium">Square Feet</span>
                    </div>
                    <p className="text-2xl font-thin text-white">{property.sqft || '2,400'}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center text-pink-300 mb-2">
                      <Home className="w-5 h-5 mr-2" />
                      <span className="font-medium">Property Type</span>
                    </div>
                    <p className="text-lg font-thin text-white">{property.type}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-thin text-white mb-3">Property Information</h3>
                <div className="bg-black/40 p-4 rounded-lg space-y-3 border border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year Built:</span>
                    <span className="text-white">{property.yearBuilt || '2018'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lot Size:</span>
                    <span className="text-white">{property.lotSize || '0.25 acres'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Days on Market:</span>
                    <span className="text-white">{property.daysOnMarket || '14'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property ID:</span>
                    <span className="text-white">{property.id || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-thin text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {property.description || 'This beautiful property offers modern living with exceptional amenities. Located in a desirable neighborhood with easy access to shopping, dining, and entertainment. The home features updated fixtures, spacious rooms, and a well-maintained exterior. Perfect for families or professionals seeking comfort and convenience.'}
              </p>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-thin text-white mb-4">Interior Features</h3>
                <div className="space-y-3">
                  {[
                    'Hardwood floors throughout',
                    'Updated kitchen with granite countertops',
                    'Stainless steel appliances',
                    'Master suite with walk-in closet',
                    'Fireplace in living room',
                    'Central air conditioning',
                    'In-unit laundry',
                    'High ceilings'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-thin text-white mb-4">Exterior Features</h3>
                <div className="space-y-3">
                  {[
                    'Private backyard',
                    'Covered patio',
                    'Two-car garage',
                    'Landscaped front yard',
                    'Sprinkler system',
                    'Deck/Balcony',
                    'Storage shed',
                    'Fence/Privacy'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-thin text-white mb-4">Amenities & Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Heart, label: 'Pet Friendly', active: property.features?.petFriendly },
                  { icon: Car, label: 'Parking', active: property.features?.parking },
                  { icon: Shield, label: 'Security', active: true },
                  { icon: Zap, label: 'High Speed Internet', active: true },
                  { icon: Trees, label: 'Garden/Yard', active: true },
                  { icon: Clock, label: '24/7 Maintenance', active: true }
                ].map((amenity, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    amenity.active 
                      ? 'border-indigo-500 bg-indigo-900/20 text-indigo-300' 
                      : 'border-gray-700 bg-gray-800/20 text-gray-500'
                  }`}>
                    <amenity.icon className="w-6 h-6 mb-2" />
                    <p className="text-sm font-medium">{amenity.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="bg-black/40 p-6 rounded-lg">
              <h3 className="text-xl font-thin text-white mb-4">Address & Location</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <p className="text-lg text-white">{property.address || property.location || 'Unknown Location'}</p>
                  <p className="text-gray-400">Neighborhood: Downtown District</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                <div className="text-2xl font-thin text-emerald-400 mb-2 ">92</div>
                <div className="text-sm text-gray-400">Walk Score</div>
              </div>
              <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                <div className="text-2xl font-thin text-blue-400 mb-2">85</div>
                <div className="text-sm text-gray-400">Transit Score</div>
              </div>
              <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                <div className="text-2xl font-thin text-purple-400 mb-2">78</div>
                <div className="text-sm text-gray-400">Bike Score</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-thin text-white mb-4">Nearby Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-indigo-300 mb-3">Shopping & Dining</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Whole Foods Market</span>
                      <span className="text-gray-500">0.3 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Starbucks</span>
                      <span className="text-gray-500">0.1 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Central Mall</span>
                      <span className="text-gray-500">0.8 mi</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-300 mb-3">Schools & Education</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Elementary School</span>
                      <span className="text-gray-500">0.4 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High School</span>
                      <span className="text-gray-500">0.7 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Public Library</span>
                      <span className="text-gray-500">0.5 mi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-thin text-white mb-4">Purchase Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">List Price:</span>
                    <span className="text-2xl font-thin text-white">${property.price?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per Sq Ft:</span>
                    <span className="text-white">${Math.round((property.price || 450000) / (property.sqft || 2400))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property Taxes:</span>
                    <span className="text-white">${Math.round((property.price || 450000) * 0.012 / 12).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">HOA Fees:</span>
                    <span className="text-white">${property.hoaFees || '150'}/mo</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-thin text-white mb-4">Estimated Monthly Payment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Principal & Interest:</span>
                    <span className="text-white">${Math.round((property.price || 450000) * 0.006).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property Taxes:</span>
                    <span className="text-white">${Math.round((property.price || 450000) * 0.012 / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Insurance:</span>
                    <span className="text-white">${Math.round((property.price || 450000) * 0.004 / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">HOA:</span>
                    <span className="text-white">${property.hoaFees || '150'}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-thin text-white">Total Monthly:</span>
                      <span className="text-xl font-thin text-indigo-400">
                        ${Math.round((property.price || 450000) * 0.0074 + (parseInt(property.hoaFees) || 150)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-thin text-white mb-4">Market Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-lg font-thin text-white">+5.2%</div>
                  <div className="text-sm text-gray-400">YoY Appreciation</div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                  <Calculator className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-thin text-white">${Math.round((property.price || 450000) * 0.08 / 12).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Est. Rental/mo</div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg text-center border border-gray-700">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-thin text-white">32</div>
                  <div className="text-sm text-gray-400">Avg Days on Market</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img 
                    src={images[currentImageIndex]} 
                    alt={`Property view ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-24 h-24 text-gray-600" />
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 8).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-indigo-500' : 'border-gray-700'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-indigo-600/60 hover:bg-indigo-700/60 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Virtual Tour
              </button>
              <button className="bg-gray-700/60 hover:bg-gray-600/60 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Floor Plans
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
<div
  className={`fixed top-0 right-0 bottom-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${
    sidebarOpen ? 'left-80' : 'left-0'
  } lg:left-0`}
>      <div className={`bg-black/60 rounded-3xl left-0 w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800 ${sidebarOpen ? 'ml-80' : 'mr-32 ml-32'} transition-all duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-thin text-white">{property.title || 'Property Details'}</h2>
            <p className="text-gray-400 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.address || property.location || 'Unknown Location'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-thin text-white">${property.price?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-400">List Price</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-4 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-indigo-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-280px)] overflow-y-auto ">
          {renderTabContent()}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-800 bg-black/40">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-indigo-600/60 hover:bg-indigo-700/60 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              <span>Schedule Viewing</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-700/60 hover:bg-gray-600/60 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Phone className="w-5 h-5" />
              <span>Contact Agent</span>
            </button>
            <button 
  onClick={handleSaveProperty}
  disabled={isSaving}
  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
    isSaved 
      ? 'bg-emerald-600/60 hover:bg-emerald-700/60 text-white' 
      : 'bg-gray-700/60 hover:bg-gray-600/60 text-white'
  } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
  <span>{isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}</span>
</button>
            <button className="flex items-center space-x-2 bg-gray-700/60 hover:bg-gray-600/60 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyCard = ({ property, readOnly = false, onEdit, onDelete, onPropertyAction, sidebarOpen }) => {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-3xl overflow-hidden border border-gray-800 transition-transform duration-300 hover:-translate-y-1 hover:shadow-4xl cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Image */}
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
            ${property.price?.toLocaleString() || 'N/A'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2 text-gray-300 text-sm font-thin">
          <h3 className="text-lg font-medium text-white">{property.title || 'Untitled Property'}</h3>

          {/* Address */}
          <div className="flex items-center text-indigo-400">
            <MapPin className="w-4 h-4 mr-1" />
            {property.address || property.location || 'Unknown Location'}
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-purple-300" /> {property.bedrooms} Bed
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-teal-300" /> {property.bathrooms} Bath
            </div>
            {property.sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1 text-yellow-300" /> {property.sqft} Sqft
              </div>
            )}
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1 text-pink-300" /> {property.type}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mt-1">
            {property.features?.petFriendly && (
              <span className="flex items-center text-emerald-300 bg-emerald-900/30 text-xs px-2 py-1 rounded-md">
                <Heart className="w-3 h-3 mr-1" /> Pet Friendly
              </span>
            )}
            {property.features?.parking && (
              <span className="flex items-center text-blue-300 bg-blue-900/30 text-xs px-2 py-1 rounded-md">
                <Car className="w-3 h-3 mr-1" /> Parking
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            {property.description || 'No description provided.'}
          </p>

          {/* Actions (optional) */}
          {!readOnly && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property);
                }}
                className="flex-1 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property.id);
                }}
                className="flex-1 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <PropertyDetailsModal
    property={property}
    onClose={() => setShowDetails(false)}
    onPropertyAction={onPropertyAction}
    sidebarOpen= {sidebarOpen}
  />
      )}
    </>
  );
};

export default PropertyCard;