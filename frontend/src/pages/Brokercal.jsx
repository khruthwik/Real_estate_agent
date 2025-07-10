import React, { useState, useEffect } from 'react';
 import { Calendar, ChevronLeft, ChevronRight, List, Grid3x3, AlertCircle, Loader2, X, Clock, MapPin, User, FileText, Phone, Mail, Home, DollarSign, Calendar as CalendarIcon, Users, Star, AlertTriangle } from 'lucide-react';
 import EventPopover from './EventPopover'; // Import the new component
 import { AnimatePresence } from 'framer-motion';
 import { motion, useSpring, useTransform } from 'framer-motion';
 
 function BrokerCalendar() {
   const [currentView, setCurrentView] = useState('week');
   const [currentDate, setCurrentDate] = useState(new Date());
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedEvent, setSelectedEvent] = useState(null);
   const [popoverPosition, setPopoverPosition] = useState(null);
   const [isNavigating, setIsNavigating] = useState(false);
   const [viewDirection, setViewDirection] = useState(0);
 
   const API_ENDPOINT = 'http://localhost:5000/api/events';
   const fetchEvents = async () => {
     try {
       setLoading(true);
       setError(null);
 
       const response = await fetch(API_ENDPOINT, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         },
       });
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
 
       const transformedEvents = data.map(event => ({
         ...event,
         start: new Date(event.start),
         end: new Date(event.end),
         type: event.type || 'booking',
         description: event.description || '',
       }));
 
       setEvents(transformedEvents);
     } catch (err) {
       console.error('Error fetching events:', err);
       setError(err.message);
       // Sample data fallback if API fails
       const sampleEvents = [
         {
           id: 1,
           title: 'Property Showing - Luxury',
           start: new Date(2025, 5, 27, 10, 0),
           end: new Date(2025, 5, 27, 11, 30),
           type: 'booking',
           description: 'Luxury waterfront condo viewing with potential buyers.',
           client: 'John & Sarah Martinez',
           clientPhone: '+1 (555) 123-4567',
           clientEmail: 'john.martinez@email.com',
           propertyName: 'Oceanview Luxury Condos',
           propertyAddress: '1234 Oceanfront Blvd, Unit 2405, Miami, FL 33139',
           propertyPrice: '$1,250,000',
           propertyType: 'Luxury Condo',
           bedrooms: 3,
           bathrooms: 2.5,
           sqft: 2100,
           listingAgent: 'Maria Rodriguez',
           commission: '3%',
           priority: 'high',
           notes: 'Clients are pre-approved for $1.5M. Very motivated buyers. Bring property brochures and comparable sales data.',
           leadSource: 'Referral from previous client',
           appointmentType: 'Property Showing',
           meetingLocation: 'Property Lobby',
           clientPreferences: 'Waterfront view, modern amenities, parking for 2 cars',
           followUpRequired: true,
           estimatedDuration: 90
         },
         {
           id: 2,
           title: 'Open Slot - Available',
           start: new Date(2025, 5, 27, 14, 0),
           end: new Date(2025, 5, 27, 15, 30),
           type: 'open_slot',
           description: 'Available for client calls, property viewings, or administrative tasks.',
           notes: 'Perfect time for prospecting calls or follow-up with recent leads.',
           appointmentType: 'Available Time',
           priority: 'low'
         },
         {
           id: 3,
           title: 'Closing Meeting - Suburban Home',
           start: new Date(2025, 5, 28, 9, 30),
           end: new Date(2025, 5, 28, 11, 0),
           type: 'booking',
           description: 'Final walkthrough and closing for suburban family home.',
           client: 'David & Jennifer Thompson',
           clientPhone: '+1 (555) 987-6543',
           clientEmail: 'david.thompson@email.com',
           propertyName: 'Maple Grove Family Home',
           propertyAddress: '456 Maple Street, Suburb Heights, FL 33156',
           propertyPrice: '$485,000',
           propertyType: 'Single Family Home',
           bedrooms: 4,
           bathrooms: 3,
           sqft: 2850,
           listingAgent: 'Self',
           commission: '6%',
           priority: 'high',
           notes: 'Final walkthrough before closing. Check all repairs completed. Bring closing documents and keys.',
           leadSource: 'Online listing',
           appointmentType: 'Closing',
           meetingLocation: 'Title Company Office',
           closingDate: new Date(2025, 5, 28),
           followUpRequired: false,
           estimatedDuration: 90
         },
         {
           id: 4,
           title: 'First-Time Buyer Consultation',
           start: new Date(2025, 5, 29, 11, 0),
           end: new Date(2025, 5, 29, 12, 30),
           type: 'booking',
           description: 'Initial consultation with first-time home buyers.',
           client: 'Michael & Lisa Chen',
           clientPhone: '+1 (555) 456-7890',
           clientEmail: 'michael.chen@email.com',
           propertyName: 'N/A - Consultation',
           propertyAddress: 'Office Meeting',
           propertyPrice: '$200,000 - $350,000 (Budget Range)',
           propertyType: 'TBD',
           priority: 'medium',
           notes: 'Young couple, first-time buyers. Need education on process, financing options, and market conditions.',
           leadSource: 'Google Ads',
           appointmentType: 'Buyer Consultation',
           meetingLocation: 'Real Estate Office',
           clientPreferences: 'Safe neighborhood, good schools, 2-3 bedrooms, move-in ready',
           followUpRequired: true,
           estimatedDuration: 90,
           preApprovalStatus: 'Pending',
           urgency: 'Looking to buy within 3 months'
         },
         {
           id: 5,
           title: 'Market Analysis Presentation',
           start: new Date(2025, 5, 30, 10, 0),
           end: new Date(2025, 5, 30, 11, 0),
           type: 'booking',
           description: 'Present CMA for potential listing client.',
           client: 'Robert & Patricia Williams',
           clientPhone: '+1 (555) 234-5678',
           clientEmail: 'robert.williams@email.com',
           propertyName: 'Williams Family Estate',
           propertyAddress: '789 Executive Drive, Prestigious Hills, FL 33149',
           propertyPrice: '$850,000 (Estimated)',
           propertyType: 'Executive Home',
           bedrooms: 5,
           bathrooms: 4,
           sqft: 4200,
           priority: 'high',
           notes: 'Potential high-value listing. Present detailed CMA, marketing strategy, and recent comparable sales.',
           leadSource: 'Neighborhood farming',
           appointmentType: 'Listing Presentation',
           meetingLocation: 'Client\'s Home',
           followUpRequired: true,
           estimatedDuration: 60,
           listingPotential: 'High',
           competitorAnalysis: 'Two other agents presenting this week'
         },
         {
           id: 6,
           title: 'Team Strategy Meeting',
           start: new Date(2025, 5, 30, 15, 0),
           end: new Date(2025, 5, 30, 16, 0),
           type: 'booking',
           description: 'Weekly team meeting to discuss market trends and strategies.',
           appointmentType: 'Team Meeting',
           meetingLocation: 'Conference Room A',
           priority: 'medium',
           notes: 'Review weekly performance, discuss new marketing strategies, and plan upcoming open houses.',
           followUpRequired: false,
           estimatedDuration: 60
         }
       ];
       setEvents(sampleEvents);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchEvents();
   }, []);
 
   const refreshEvents = () => {
     fetchEvents();
   };
 
   const handleEventClick = (event, domEvent) => {
     const rect = domEvent.currentTarget.getBoundingClientRect();
     setSelectedEvent(event);
     setPopoverPosition({
       top: rect.top + window.scrollY,
       left: rect.left + window.scrollX,
       width: rect.width,
       height: rect.height,
     });
   };
 
   const closeEventPopover = () => {
     setSelectedEvent(null);
     setPopoverPosition(null);
   };
 
   const getWeekDays = (date) => {
     const week = [];
     const startDate = new Date(date);
     const day = startDate.getDay();
     const diff = startDate.getDate() - day;
 
     for (let i = 0; i < 7; i++) {
       const day = new Date(startDate);
       day.setDate(diff + i);
       week.push(day);
     }
     return week;
   };
 
   const getMonthDays = (date) => {
     const year = date.getFullYear();
     const month = date.getMonth();
     const firstDay = new Date(year, month, 1);
     const lastDay = new Date(year, month + 1, 0);
     const daysInMonth = lastDay.getDate();
     const startingDayOfWeek = firstDay.getDay();
 
     const days = [];
 
     for (let i = 0; i < startingDayOfWeek; i++) {
       days.push(null);
     }
 
     for (let day = 1; day <= daysInMonth; day++) {
       days.push(new Date(year, month, day));
     }
 
     return days;
   };
 
   const formatTime = (date) => {
     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   };
 
   const isToday = (date) => {
     const today = new Date();
     return date.toDateString() === today.toDateString();
   };
 
   const getEventsForDay = (date) => {
     return events.filter(event => {
       const eventDate = new Date(event.start);
       return eventDate.toDateString() === date.toDateString();
     });
   };
 
   const getEventsForWeek = (weekDays) => {
     return events.filter(event => {
       const eventDate = new Date(event.start);
       return weekDays.some(day => day.toDateString() === eventDate.toDateString());
     });
   };
 
   const navigateDate = async (direction) => {
  setIsNavigating(true);
  setViewDirection(direction);
  
  const newDate = new Date(currentDate);
  if (currentView === 'week') {
    newDate.setDate(currentDate.getDate() + (direction * 7));
  } else {
    newDate.setMonth(currentDate.getMonth() + direction);
  }
  
  // Small delay for smooth transition
  setTimeout(() => {
    setCurrentDate(newDate);
    setIsNavigating(false);
  }, 150);
};

const switchView = (newView) => {
  if (newView !== currentView) {
    setCurrentView(newView);
  }
};
 
   const goToToday = () => {
     setCurrentDate(new Date());
   };
 
   const getPriorityColor = (priority) => {
     switch (priority) {
       case 'high': return 'text-red-300 bg-red-900';
       case 'medium': return 'text-yellow-400 bg-yellow-900';
       case 'low': return 'text-green-400 bg-green-900';
       default: return 'text-gray-400 bg-gray-900';
     }
   };
 
   const getPriorityIcon = (priority) => {
     switch (priority) {
       case 'high': return <AlertTriangle className="w-4 h-4" />;
       case 'medium': return <AlertCircle className="w-4 h-4" />;
       default: return <Star className="w-4 h-4" />;
     }
   };
 
   const renderMonthView = () => {
     const monthDays = getMonthDays(currentDate);
     const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
 
     const handleDateClick = (day, dayEvents, e) => {
       setCurrentDate(day);
       if (dayEvents.length === 1) {
         handleEventClick(dayEvents[0], e);
       }
     };
 
     return (
       <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 shadow-3xl">
         <h2 className="text-2xl font-extrabold text-gray-50 mb-6 pb-4 border-b-2 border-gray-800 flex items-center">
           <Calendar className="w-6 h-6 text-indigo-400"/>
           <span className="text-gray-50 font-thin mx-auto">
  <span className="drop-cap">M</span>onthly <span className="drop-cap">O</span>verview
</span>
         </h2>
 
         <div className="text-center mb-4">
           <h3 className="text-lg font-serif text-gray-100">{monthName}</h3>
         </div>
 
         <div className="grid grid-cols-7 gap-1 mb-2">
           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
             <div key={day} className="text-center text-sm font-medium text-gray-400 p-2 ">
               {day}
             </div>
           ))}
         </div>
 
         <div className="grid grid-cols-7 gap-1">
           {monthDays.map((day, index) => {
             if (!day) return <div key={index} className="h-10"></div>;
 
             const dayEvents = getEventsForDay(day);
             const today = isToday(day);
             const isSelected = day.toDateString() === currentDate.toDateString();
             const hasHighPriority = dayEvents.some(event => event.priority === 'high');
 
             return (
               <div
                 key={day.toISOString()}
                 className={`
                   h-10 flex items-center justify-center border border-gray-700 text-sm rounded-lg cursor-pointer relative
                   transition-all duration-300 ease-in-out transform hover:scale-105
                   ${today ? 'bg-indigo-600 text-white font-thin shadow-lg' :
                     isSelected ? 'bg-gray-700 text-white font-thin shadow-md' :
                     'text-gray-200 hover:bg-gray-800 hover:text-gray-50'}
                 `}
                 onClick={(e) => handleDateClick(day, dayEvents, e)}
               >
                 {day.getDate()}
                 {dayEvents.length > 0 && (
                   <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                     hasHighPriority ? 'bg-red-500' : 'bg-emerald-500'
                   }`}></div>
                 )}
               </div>
             );
           })}
         </div>
       </div>
     );
   };
 
   const renderWeekView = () => {
     const weekDays = getWeekDays(currentDate);
     const weekEvents = getEventsForWeek(weekDays);
     const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
 
     return (
       // Added flex-1 and flex-col to allow inner content to take height
       <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-800 shadow-3xl flex flex-col h-2/5">
         <div className="grid grid-cols-8 gap-4 mb-4">
           <div className="text-sm font-thin text-gray-400"></div>
           {weekDays.map(day => {
             const today = isToday(day);
             const isCurrentDate = day.toDateString() === currentDate.toDateString();
 
             return (
               <div key={day.toISOString()} className="text-center">
                 <div className={`font-thin text-base ${
                   today ? 'text-indigo-400' :
                   isCurrentDate ? 'text-indigo-300' :
                   'text-gray-100'
                 }`}>
                   {day.toLocaleDateString('en-US', { weekday: 'short' })}
                 </div>
                 <div className={`text-lg font-thin rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                   today ? 'text-white bg-indigo-600 font-thin' :
                   isCurrentDate ? 'text-white bg-gray-700' :
                   'text-gray-300'
                 }`}>
                   {day.getDate()}
                 </div>
               </div>
             );
           })}
         </div>
 
         {/* This is the part that scrolls */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
           {hours.map(hour => (
             <div key={hour} className="grid grid-cols-8 gap-4 border-b border-gray-800 py-2">
               <div className="text-sm text-gray-400 text-right pr-2">
                 {hour}:00
               </div>
               {weekDays.map(day => {
                 const dayEvents = events.filter(event => {
                   const eventDate = new Date(event.start);
                   const eventHour = eventDate.getHours();
                   return eventDate.toDateString() === day.toDateString() && eventHour === hour;
                 });
 
                 return (
                   <div key={`${day.toISOString()}-${hour}`} className=" min-h-20 relative">
                     {dayEvents.map(event => (
                       <div
                         key={event.id}
                         className={`
                           absolute inset-x-0 p-2 text-xs rounded-lg shadow-md cursor-pointer
                           transition-all duration-300 ease-in-out transform hover:scale-105 hover:z-10
                           ${selectedEvent && selectedEvent.id === event.id ? 'z-40 ring-2 ring-indigo-500' : ''}
                           ${event.extendedProps.type === 'booking'
                             ? event.extendedProps.priority === 'high'
                               ? 'bg-gradient-to-br from-red-700 to-red-800 text-white'
                               : 'bg-gradient-to-br from-indigo-700 to-indigo-800 text-white'
                             : 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white'
                           }
                         `}
                         style={{
                           top: `${((event.start.getMinutes() / 60) * 100)}%`,
                           height: `${((event.end - event.start) / (1000 * 60 * 60)) * 100}%`
                         }}
                         onClick={(e) => handleEventClick(event, e)}
                       >
                         <div className="flex items-center justify-between mt-0 gap-1">
                           {event.extendedProps.priority && (
                             <div className="">
                               {getPriorityIcon(event.extendedProps.priority)}
                             </div>
                           )}
                           <p className="text-xs opacity-80 text-white">
                           {formatTime(event.start)} - {formatTime(event.end)}
                         </p>
                         </div>
                         
                         {event.propertyPrice && (
                           <p className="text-xs opacity-90 font-thin text-emerald-300">{event.extendedProps.propertyPrice}</p>
                         )}
                       </div>
                     ))}
                   </div>
                 );
               })}
             </div>
           ))}
         </div>
       </div>
     );
   };
 
   const renderListView = () => {
     const weekDays = getWeekDays(currentDate);
     const weekEvents = getEventsForWeek(weekDays).sort((a, b) => a.start - b.start);
 
     return (
       // Added flex-1 and flex-col to allow inner content to take height
       <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-800 shadow-3xl overflow-y-auto h-5/6">
         {/* This is the part that scrolls */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="space-y-4">
             {weekEvents.map(event => (
               <div
                 key={event.id}
                 className={`
                   flex items-center p-4 rounded-xl shadow-lg bg-gray-900 hover:bg-gray-800/60
                   transition-all duration-300 border border-gray-800 cursor-pointer
                   transform hover:scale-[1.01] hover:shadow-xl
                   ${selectedEvent && selectedEvent.id === event.id ? 'ring-2 ring-indigo-500' : ''}
                 `}
                 onClick={(e) => handleEventClick(event, e)}
               >
                 <div
                   className={`w-3 h-3 rounded-full mr-3 ${
                     event.type === 'booking'
                       ? event.priority === 'high' ? 'bg-red-600' : 'bg-indigo-600'
                       : 'bg-emerald-500'
                   }`}
                 ></div>
                 <div className="flex-1">
                   <div className="flex items-center space-x-2 mb-1">
                     <p className="font-thin text-base text-gray-50">{event.title}</p>
                     {event.priority && (
                       <div className={`px-2 py-1 rounded-full text-xs font-thin flex items-center space-x-1 ${getPriorityColor(event.priority)}`}>
                         {getPriorityIcon(event.priority)}
                         <span className="capitalize">{event.priority}</span>
                       </div>
                     )}
                   </div>
                   <p className="text-sm text-gray-300 mt-1">{event.client || event.description}</p>
                   {event.propertyName && event.propertyName !== 'N/A - Consultation' && (
                     <p className="text-sm text-gray-400 mt-1">{event.propertyName}</p>
                   )}
                   {event.propertyPrice && (
                     <p className="text-sm font-medium text-emerald-300 mt-1">{event.propertyPrice}</p>
                   )}
                   <p className="text-sm text-gray-400 mt-1">
                     {event.start.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                   </p>
                 </div>
                 <div className="text-sm text-gray-400 ml-4 text-right">
                   <div>{formatTime(event.start)} - {formatTime(event.end)}</div>
                   {event.estimatedDuration && (
                     <div className="text-xs text-gray-500 mt-1">{event.estimatedDuration} min</div>
                   )}
                 </div>
               </div>
             ))}
             {weekEvents.length === 0 && (
               <div className="text-center py-8 text-gray-500">
                 No events scheduled for this week
               </div>
             )}
           </div>
         </div>
       </div>
     );
   };
 
   // Loading state (no changes, already occupies full screen)
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 font-['Outfit',_sans-serif'] relative">
      {/* Background gradient/noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <motion.div 
        className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-3xl border border-gray-800 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <motion.span 
            className="text-lg font-thin text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading calendar events...
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
 
   return (
    <div className="h-screen bg-gray-950 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col font-['Outfit',_sans-serif'] relative overflow-hidden">
       {/* Background gradient/noise */}
       <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
         <div className="absolute inset-0 opacity-10" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
         }}></div>
       </div>
 
       {/* Error Alert */}
       {error && (
         <div className="fixed top-4 right-4 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
           <div className="flex items-center">
             <AlertCircle className="w-5 h-5 mr-2" />
             <div>
               <strong className="font-medium">Connection Error:</strong>
               <p className="text-sm mt-1">{error}</p>
               <p className="text-sm mt-1">Using sample data instead.</p>
             </div>
           </div>
         </div>
       )}
 
       {/* Header Controls - fixed height automatically */}
       {/* Header Controls - fixed height automatically */}
<motion.div 
  className="bg-black/40 backdrop-blur-xl shadow-3xl rounded-3xl p-4 mb-6 border border-gray-800 relative z-10"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center space-x-2">
      <motion.button
        onClick={() => navigateDate(-1)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 transition-all duration-200 shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={isNavigating}
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
      <motion.button
        onClick={() => navigateDate(1)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 transition-all duration-200 shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={isNavigating}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
      <motion.h2 
        className="text-xl text-gray-50 ml-4 font-thin"
        key={currentDate.toString() + currentView}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'week'
          ? `${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDays(currentDate)[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </motion.h2>
    </div>
    <div className="flex items-center space-x-3">
      <motion.button
        onClick={goToToday}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-thin transition-all duration-200 shadow-md"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
        whileTap={{ scale: 0.98 }}
      >
        Today
      </motion.button>
      <motion.button
        onClick={refreshEvents}
        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-thin transition-all duration-200 shadow-md flex items-center space-x-2"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(75, 85, 99, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
      >
        <motion.div
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <Loader2 className="w-4 h-4" />
        </motion.div>
        <span>Sync</span>
      </motion.button>
      <div className="flex bg-gray-800 rounded-lg p-1 shadow-inner-lg">
        {['week', 'month', 'list'].map((view) => (
          <motion.button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`px-4 py-2 rounded-md text-sm font-thin transition-colors duration-200 flex items-center space-x-2 relative
              ${currentView === view ? 'text-white' : 'text-gray-300 hover:bg-gray-600'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentView === view && (
              <motion.div
                className="absolute inset-0 bg-gray-700 rounded-md shadow-md"
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center space-x-2">
              {view === 'week' && <Grid3x3 className="w-4 h-4" />}
              {view === 'month' && <Calendar className="w-4 h-4" />}
              {view === 'list' && <List className="w-4 h-4" />}
              <span className="capitalize">{view}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
</motion.div> 

     {/* Main content area: Calendar views and Monthly Overview (takes remaining vertical space) */}
     {/* Main content area: Calendar views and Monthly Overview (takes remaining vertical space) */}
<motion.div 
  className="flex-1 relative z-10 flex flex-col lg:flex-row lg:space-x-8 overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Main: Week/List View (Left side) */}
  <motion.main 
    className="flex-1 h-full flex flex-col"
    key={currentView}
    initial={{ opacity: 0, x: viewDirection * 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <AnimatePresence mode="wait">
      {currentView === 'week' && (
        <motion.div
          key="week"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {renderWeekView()}
        </motion.div>
      )}
      {currentView === 'month' && (
        <motion.div
          key="month"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {renderMonthView()}
        </motion.div>
      )}
      {currentView === 'list' && (
        <motion.div
          key="list"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {renderListView()}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.main>

  {/* Right Sidebar: Monthly Overview */}
  <motion.aside 
    className="w-full lg:w-80 mt-6 lg:mt-0 flex-shrink-0"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
  >
    {renderMonthView()}
  </motion.aside>
</motion.div>
 
       {/* Event Popover */}
       <AnimatePresence>
         {selectedEvent && popoverPosition && (
           <EventPopover
             event={selectedEvent}
             onClose={closeEventPopover}
             position={popoverPosition}
           />
         )}
       </AnimatePresence>
       
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
 
 export default BrokerCalendar;