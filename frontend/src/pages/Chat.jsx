import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Home, Mic, MapPin, DollarSign, Bed,X,Mail,Clock, Calendar,UserIcon, TrendingUp,Trash,Trash2, Filter, Heart,CrossIcon, Cross,BanIcon, Delete, Phone} from 'lucide-react'; // Added Heart icon
import { Menu as MenuIcon } from 'lucide-react';
import PropertyCard from '../pages/propertycard'; // Assuming PropertyCard is in the same directory or adjust path

export default function SearchBroker() {
  const [profile, setProfile] = useState(null);
  const [msgLog, setMsgLog] = useState([
    { from: 'bot', text: '👋 Hi, I\'m your AI real-estate broker. How can I help you today?' }
  ]);
  const [inbox, setInbox] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [pendingProfile, setPendingProfile] = useState(null);
  const [isConfirmingProfile, setIsConfirmingProfile] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

   const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || 'User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone'
      });
    } else {
      setUserInfo(null);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgLog]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (e) => {
      console.error("Speech Recognition Error:", e.error);
      setIsRecording(false);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInbox(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // Generate contextual suggestions based on the conversation
  const generateSuggestions = (botMessage, hasMatches) => {
    const msg = botMessage.toLowerCase();
    
    // Initial greeting suggestions
    if (msg.includes('how can i help')) {
      return [
        { text: "I'm looking for a 2-bedroom apartment", icon: Bed },
        { text: "Show me properties under $500k", icon: DollarSign },
        { text: "What's the market like in downtown?", icon: TrendingUp },
        { text: "I need help with financing options", icon: Calendar }
      ];
    }
    
    // Property search results suggestions
    if (hasMatches) {
      return [
        { text: "Tell me more about the neighborhood", icon: MapPin },
        { text: "What are the financing options?", icon: DollarSign },
        { text: "Schedule a viewing", icon: Calendar },
        { text: "Show me similar properties", icon: Filter }
      ];
    }
    
    // Location-based suggestions
    if (msg.includes('neighborhood') || msg.includes('area') || msg.includes('location')) {
      return [
        { text: "What are the schools like?", icon: MapPin },
        { text: "How's the commute to downtown?", icon: TrendingUp },
        { text: "Show me properties in this area", icon: Home },
        { text: "What's the average rent here?", icon: DollarSign }
      ];
    }
    
    // Price/budget related suggestions
    if (msg.includes('price') || msg.includes('budget') || msg.includes('cost') || msg.includes('$')) {
      return [
        { text: "What can I afford with my budget?", icon: DollarSign },
        { text: "Show me financing options", icon: Calendar },
        { text: "Compare prices in different areas", icon: TrendingUp },
        { text: "What are the additional costs?", icon: Filter }
      ];
    }
    
    // Market/trends suggestions
    if (msg.includes('market') || msg.includes('trend') || msg.includes('investment')) {
      return [
        { text: "Is now a good time to buy?", icon: TrendingUp },
        { text: "Show me price trends", icon: DollarSign },
        { text: "What about rental yields?", icon: Calendar },
        { text: "Compare different neighborhoods", icon: MapPin }
      ];
    }
    
    // Default suggestions for other responses
    return [
      { text: "Show me more options", icon: Home },
      { text: "Tell me about the area", icon: MapPin },
      { text: "What's my budget range?", icon: DollarSign },
      { text: "Schedule a consultation", icon: Calendar }
    ];
  };

  

  const send = async (messageText = null) => {
    const userMsg = messageText || inbox;
    if (!userMsg.trim() || isLoading) return;

   setMsgLog(prevLog => [...prevLog, { from: 'user', text: userMsg }]);

    setInbox('');
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const chatRes = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, user })
      });

      if (!chatRes.ok) {
        throw new Error(await chatRes.text());
      }

      const { reply, profile, matches } = await chatRes.json();
      setMsgLog(log => [...log, { from: 'bot', text: reply, matches: matches || [] }]);
      setProfile(profile);
      console.log('Profile:', profile);
      if (matches && matches.length > 0) {
  setRecentlyViewed(prev => {
    // Flatten prev in case it contains nested arrays
    const flatPrev = prev.flat();
    
    // Create a Set to track seen property IDs
    const seenIds = new Set();
    
    // Filter out duplicates from existing + new matches
    const allProperties = [...flatPrev, ...matches];
    const uniqueProperties = allProperties.filter(property => {
      const id = property.Uniqueid;
      console.log('Checking property ID:', id);
      if (seenIds.has(id)) {
        return false;
      }
      seenIds.add(id);
      return true;
    });
    
    return uniqueProperties; // Keep last 10 unique properties
  });
}
    } catch (err) {
      console.error('Chat error:', err.message);
      setMsgLog(log => [...log, { from: 'bot', text: '❌ Something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleUnsaveProperty = async (propertyId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch('http://localhost:5000/api/properties/unsave', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, propertyId })
    });
    
    if (res.ok) {
      setSavedProperties(prev => prev.filter(item => item.property._id !== propertyId));
      setMsgLog(log => [...log, { from: 'bot', text: '✅ Property removed from saved list.' }]);
    }
  } catch (err) {
    console.error('Error unsaving property:', err);
  }
};

  const handleSeeSavedPropertiesClick = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setMsgLog(log => [...log, { from: 'bot', text: '❌ Please log in to view saved properties.' }]);
      return;
    }

    const res = await fetch(`http://localhost:5000/api/properties/saved/${user.email}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error('Failed to fetch saved properties');
    
    const data = await res.json();
    console.log('Saved properties:', data);
    setSavedProperties(data.savedProperties || []);
    setShowSavedModal(true);
  } catch (err) {
    console.error('Error fetching saved properties:', err);
    setMsgLog(log => [...log, { from: 'bot', text: '❌ Failed to load saved properties. Please try again.' }]);
  }
};

  const confirmLeaseRequest = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return console.log("User not logged in.");
    setPendingProfile({ ...profile, name: user.name, email: user.email, phone: user.phone });
    setIsConfirmingProfile(true);

    setTimeout(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 100);
  };

  const handleProfileEdit = (field, value) => {
    setPendingProfile(prev => ({ ...prev, [field]: value }));
  };


  const submitLeaseRequest = async () => {
  if (!pendingProfile) return;

  try {
    const res = await fetch('http://localhost:5000/api/leases/save-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingProfile)
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    console.log('Lease request submitted:', data);

    setMsgLog(log => [
      ...log,
      { from: 'bot', text: 'Your lease request has been submitted successfully!' }
    ]);

    setProfile(null); 
  } catch (err) {
    console.error('Lease submission error:', err.message);
    setMsgLog(log => [
      ...log,
      { from: 'bot', text: '❌ Failed to submit lease request. Please try again later.' }
    ]);
  } finally {
    
    setIsConfirmingProfile(false);
    setPendingProfile(null);
  }
};


  const handleSuggestionClick = (suggestion) => {
    send(suggestion.text);
  };
  
  const handleSaveProperty = async (property) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch('http://localhost:5000/api/properties/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, property })
    });
    
    if (res.ok) {
      setMsgLog(log => [...log, { from: 'bot', text: '✅ Property saved successfully!' }]);
    }
  } catch (err) {
    console.error('Error saving property:', err);
    setMsgLog(log => [...log, { from: 'bot', text: '❌ Failed to save property. Please try again.' }]);
  }
};



  return (
    <div className="h-screen w-screen bg-gray-950 font-['Outfit',_sans-serif] relative overflow-hidden flex">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

<div
  className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transition-transform transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
><div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-800 bg-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-thin text-gray-100">Navigation</h2>
             
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800 bg-black/40 backdrop-blur-xl">
            {userInfo ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{userInfo.name || 'User'}</h3>
                    <p className="text-gray-400 text-sm">Active User</p>
                  </div>
                </div>
                
                <div className="space-y-2 space-x-2">
                  <div className="flex items-center space-x-2 text-gray-300 gap-3 ml-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{userInfo.email || 'No email'}</span>
                  </div>
                  {userInfo.phone && (
                    <div className="flex items-center space-x-2 text-gray-300 gap-3 ml-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{userInfo.phone || 'No Phone'}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">Not logged in</p>
                <p className="text-sm text-gray-500 mt-2">Please log in to view profile</p>
              </div>
            )}
          </div>

          {/* Recently Viewed Properties */}
         <div className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-xl border-t border-gray-800">
  <div className="p-6">
    <div className="flex items-center space-x-2 mb-4">
      <Clock className="w-5 h-5 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-100">Recently Viewed</h3>
    </div>
    
    {recentlyViewed.length > 0 ? (
      <div className="space-y-3">
        {recentlyViewed.map((property, idx) => (
          <div key={idx} className="bg-black/50 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors cursor-pointer">
            <div className="flex">
              {/* Property Image */}
              <div className="w-20 h-24 my-auto mx-auto flex-shrink-0 rounded-l-lg overflow-hidden">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.title || 'Property'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-16 h-16 text-gray-600" />
                              </div>
                )}
              </div>
              
              {/* Property Details */}
              <div className="flex-1 p-3 min-w-0">
                <h4 className="text-white text-sm font-medium mb-1 truncate">{property.title || 'Property'}</h4>
                <p className="text-xs mb-2 text-indigo-400 truncate">{property.address || 'Location'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 text-sm font-semibold">{`$ ${property.price}/m` || '$0'}</span>
                  <span className="text-gray-500 text-xs">{property.bedrooms || 0}bed • {property.bathrooms || 0}bath</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    ) : (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p className="text-gray-400 text-sm">No recently viewed properties</p>
        <p className="text-gray-500 text-xs mt-1">Properties you view will appear here</p>
      </div>
    )}
  </div>
</div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={handleSeeSavedPropertiesClick}
              className="w-full bg-black/40 border border-gray-600 text-white px-4 py-2 rounded-lg transition-all font-thin shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Saved Properties</span>
            </button>
          </div>
        </div>
      </div>


<div
  className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
    sidebarOpen ? 'ml-80' : 'ml-0'
  }`}
>
      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-gray-800 bg-black/40 backdrop-blur-xl">
      
        <div className="max-w-6xl mx-auto flex items-center space-x-3">
           <button
  onClick={() => setSidebarOpen((prev) => !prev)}
  className="text-gray-300 hover:text-white transition-colors"
>
  {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
</button>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            
            <h1 className="text-xl font-thin text-gray-100">AI Property Broker</h1>
            <p className="text-xs text-gray-400">Your intelligent real estate assistant</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto space-y-6 px-2 py-4 custom-scrollbar min-h-0">
          {msgLog.map((m, i) => (
            <div key={i} className="space-y-4">
              <div className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                <div className={`flex items-start space-x-2 max-w-2xl ${m.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.from === 'bot' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    {m.from === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm shadow-lg transition-all hover:shadow-xl ${
                    m.from === 'bot'
                      ? 'bg-gray-800/80 text-gray-200 border border-gray-700/50 backdrop-blur-sm'
                      : 'bg-indigo-600/90 text-white border border-indigo-500/50 backdrop-blur-sm'}`}>
                    {m.text}
                  </div>
                </div>
              </div>

              {m.matches?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                  {m.matches.map((property, idx) => (
                    <PropertyCard key={idx} property={property} sidebarOpen={sidebarOpen} readOnly />
                  ))}
                </div>
              )}

              {/* Suggestions - only show for bot messages */}
              {m.from === 'bot' && i === msgLog.length - 1 && !isLoading && (
                <div className="animate-fadeIn">
                  <p className="text-xs text-gray-500 mb-2 ml-10">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2 ml-10">
                    {generateSuggestions(m.text, m.matches?.length > 0).map((suggestion, idx) => {
                      const IconComponent = suggestion.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm hover:scale-105"
                        >
                          <IconComponent className="w-3 h-3" />
                          <span>{suggestion.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start space-x-2 max-w-2xl">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-gray-800/80 text-gray-200 border border-gray-700/50 backdrop-blur-sm rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isConfirmingProfile && pendingProfile && (
          <div className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-xl p-4 my-4 text-sm text-gray-100">
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Confirm Lease Request</h3>
            <div className="grid gap-3 mb-4">
              {Object.entries(pendingProfile).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs text-gray-400 capitalize">{key}</label>
                  <input
                    value={value}
                    onChange={(e) => handleProfileEdit(key, e.target.value)}
                    className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={submitLeaseRequest} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Confirm & Send</button>
              <button onClick={() => { setIsConfirmingProfile(false); setPendingProfile(null); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 py-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 mt-4">
          <div className="flex space-x-3 px-4">
            {/* Mic Button */}
            <button
              type="button"
              onClick={() => {
                if (!recognitionRef.current) return;
                isRecording ? recognitionRef.current.stop() : recognitionRef.current.start();
              }}
              className={`px-4 py-3 rounded-xl transition-all duration-200 shadow-md border flex items-center justify-center ${
                isRecording ? 'bg-red-600 border-red-500 text-white animate-mic-pulse' : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inbox}
              onChange={e => setInbox(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about properties, neighborhoods, market trends..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-700/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-thin backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Send Button */}
            <button
              onClick={() => send()}
              disabled={!inbox.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-thin shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        {profile && (
          <div className="flex-shrink-0 mt-4 pb-4 flex justify-between space-x-4"> {/* Added flex and justify-between */}
            <button
              onClick={confirmLeaseRequest}
className="flex-1 bg-black/20 border border-gray-800 text-white px-6 py-3 rounded-xl transition-all font-thin shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 hover:bg-slate-800"            >
              <span>Submit My Inquiry to Broker</span>
            </button>
            {/* NEW: See Saved Properties Button */}
            <button
              onClick={handleSeeSavedPropertiesClick} // Placeholder click handler
              className="flex-1 bg-black/20 border border-gray-800 text-white px-6 py-3 rounded-xl transition-all font-thin shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 hover:bg-slate-800"
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar of Broker </span>
            </button>
          </div>
        )}
      </div>

      </div>

      {/* Saved Properties Modal */}
{showSavedModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 className="text-2xl font-thin text-gray-100">Saved Properties</h2>
        <button
          onClick={() => setShowSavedModal(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        {savedProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No saved properties yet</p>
            <p className="text-sm mt-2">Properties you save will appear here</p>
          </div>
        ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {savedProperties.map((savedItem, idx) => (
    <div key={idx} className="relative">
                <PropertyCard property={savedItem.property} readOnly />
                {/* Add unsave button overlay */}
                <button
                  onClick={() => handleUnsaveProperty(savedItem.property._id)}
                  className="absolute top-2 left-2 bg-red-600/40 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                  title="Remove from saved"
                >
                  <Trash className="w-4 h-4 fill-current" />
                </button>
              </div>
  ))}
</div>
        )}
      </div>
    </div>
  </div>
)}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes micPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-mic-pulse {
          animation: micPulse 1.5s infinite;
        }

        @media (max-width: 640px) {
          .max-w-2xl { max-width: 85%; }
        }
      `}</style>
    </div>
  );
}
