import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Tag, FileText, User, Home, DollarSign, AlertTriangle,Loader2, Phone, Mail, MapPin, Info, Maximize2, Users, Star } from 'lucide-react';

const AddEventModal = ({ onClose, onEventAdded }) => {
  // State for form fields - covering all fields in your Mongoose schema
  const [title, setTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [type, setType] = useState('booking'); // 'booking', 'open_slot', 'training', 'out_of_office'
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium'); // 'high', 'medium', 'low'
  const [appointmentType, setAppointmentType] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(''); // Stored as number in schema
  const [client, setClient] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [clientPreferences, setClientPreferences] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState(''); // Stored as number in schema
  const [bathrooms, setBathrooms] = useState(''); // Stored as number in schema
  const [sqft, setSqft] = useState(''); // Stored as number in schema
  const [listingAgent, setListingAgent] = useState('');
  const [commission, setCommission] = useState('');
  const [preApprovalStatus, setPreApprovalStatus] = useState('');
  const [urgency, setUrgency] = useState('');
  const [listingPotential, setListingPotential] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [closingDate, setClosingDate] = useState(''); // Stored as Date in schema

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API endpoint from BrokerCalendar.js
  const API_ENDPOINT = 'http://localhost:5000/api/events';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Basic validation
    if (!title || !startDateTime || !endDateTime) {
      setFormError('Title, Start Date/Time, and End Date/Time are required.');
      setIsSubmitting(false);
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setFormError('Invalid Date/Time format. Please ensure both are valid.');
      setIsSubmitting(false);
      return;
    }

    if (start >= end) {
      setFormError('End Date/Time must be after Start Date/Time.');
      setIsSubmitting(false);
      return;
    }

    // Construct the new event object according to the Mongoose schema
    const newEventData = {
      title,
      start,
      end,
      allDay,
      extendedProps: {
        type,
        description: description || undefined, // Send undefined if empty to avoid empty string in DB
        notes: notes || undefined,
        priority,
        appointmentType: appointmentType || undefined,
        meetingLocation: meetingLocation || undefined,
        estimatedDuration: estimatedDuration ? Number(estimatedDuration) : undefined, // Convert to Number
        client: (type === 'booking' && client) ? client : undefined,
        clientPhone: (type === 'booking' && clientPhone) ? clientPhone : undefined,
        clientEmail: (type === 'booking' && clientEmail) ? clientEmail : undefined,
        leadSource: (type === 'booking' && leadSource) ? leadSource : undefined,
        followUpRequired: (type === 'booking') ? followUpRequired : false,
        clientPreferences: (type === 'booking' && clientPreferences) ? clientPreferences : undefined,
        propertyName: (type === 'booking' && propertyName) ? propertyName : undefined,
        propertyAddress: (type === 'booking' && propertyAddress) ? propertyAddress : undefined,
        propertyPrice: (type === 'booking' && propertyPrice) ? propertyPrice : undefined,
        propertyType: (type === 'booking' && propertyType) ? propertyType : undefined,
        bedrooms: (type === 'booking' && bedrooms) ? Number(bedrooms) : undefined, // Convert to Number
        bathrooms: (type === 'booking' && bathrooms) ? Number(bathrooms) : undefined, // Convert to Number
        sqft: (type === 'booking' && sqft) ? Number(sqft) : undefined, // Convert to Number
        listingAgent: (type === 'booking' && listingAgent) ? listingAgent : undefined,
        commission: (type === 'booking' && commission) ? commission : undefined,
        preApprovalStatus: (type === 'booking' && preApprovalStatus) ? preApprovalStatus : undefined,
        urgency: (type === 'booking' && urgency) ? urgency : undefined,
        listingPotential: (type === 'booking' && listingPotential) ? listingPotential : undefined,
        competitorAnalysis: (type === 'booking' && competitorAnalysis) ? competitorAnalysis : undefined,
        closingDate: (type === 'booking' && closingDate) ? new Date(closingDate) : undefined, // Convert to Date
      },
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        // Attempt to parse error message from backend if available
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
      }

      // const addedEvent = await response.json(); // If your API returns the new event, you can use it
      // console.log('Event added successfully:', addedEvent);
      
      onEventAdded(); // Trigger calendar refresh in parent
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error adding event:', err);
      setFormError(`Failed to add event: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 font-['Outfit',_sans-serif']"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-3xl border border-gray-800 w-full max-w-md lg:max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar-dark"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-6">
          <h2 className="text-2xl font-bold text-gray-50 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-3 text-emerald-400" />
            Add New Event
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <p className="text-sm">{formError}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-1">Event Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Property Showing, Team Meeting"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-gray-300 text-sm font-medium mb-1">Event Type</label>
            <select
              id="type"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="booking">Booking (Client Appointment)</option>
              <option value="open_slot">Open Slot / Internal Task</option>
              <option value="training">Training</option>
              <option value="out_of_office">Out of Office</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDateTime" className="block text-gray-300 text-sm font-medium mb-1">Start Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                id="startDateTime"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDateTime" className="block text-gray-300 text-sm font-medium mb-1">End Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                id="endDateTime"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
              />
            </div>
          </div>
          {/* All Day Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allDay"
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out bg-gray-700 border-gray-600 rounded"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
            <label htmlFor="allDay" className="ml-2 block text-gray-300 text-sm font-medium">All Day Event</label>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-gray-300 text-sm font-medium mb-1">Priority</label>
            <select
              id="priority"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event..."
            ></textarea>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-gray-300 text-sm font-medium mb-1">Notes</label>
            <textarea
              id="notes"
              rows="2"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes?"
            ></textarea>
          </div>

          {/* Common Details (for all types, if applicable, or only specific types) */}
          <h3 className="text-lg font-semibold text-gray-100 mt-6 flex items-center">
            <Info className="w-5 h-5 mr-2 text-indigo-400" />
            General Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointmentType" className="block text-gray-300 text-sm font-medium mb-1">Appointment Type</label>
              <input
                type="text"
                id="appointmentType"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                placeholder="e.g., Property Showing"
              />
            </div>
            <div>
              <label htmlFor="meetingLocation" className="block text-gray-300 text-sm font-medium mb-1">Meeting Location</label>
              <input
                type="text"
                id="meetingLocation"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="e.g., Client's Home, Office"
              />
            </div>
            <div>
              <label htmlFor="estimatedDuration" className="block text-gray-300 text-sm font-medium mb-1">Estimated Duration (mins)</label>
              <input
                type="number"
                id="estimatedDuration"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g., 60"
              />
            </div>
          </div>


          {/* Conditional Fields for 'booking' type */}
          {type === 'booking' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-4 border-t border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-100 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-400" />
                Client Details
              </h3>
              <div>
                <label htmlFor="client" className="block text-gray-300 text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  id="client"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g., John & Sarah Martinez"
                />
              </div>
              <div>
                <label htmlFor="clientPhone" className="block text-gray-300 text-sm font-medium mb-1">Client Phone</label>
                <input
                  type="tel"
                  id="clientPhone"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-gray-300 text-sm font-medium mb-1">Client Email</label>
                <input
                  type="email"
                  id="clientEmail"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label htmlFor="clientPreferences" className="block text-gray-300 text-sm font-medium mb-1">Client Preferences</label>
                <textarea
                  id="clientPreferences"
                  rows="2"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={clientPreferences}
                  onChange={(e) => setClientPreferences(e.target.value)}
                  placeholder="e.g., Waterfront view, modern amenities"
                ></textarea>
              </div>
              <div>
                <label htmlFor="leadSource" className="block text-gray-300 text-sm font-medium mb-1">Lead Source</label>
                <input
                  type="text"
                  id="leadSource"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  placeholder="e.g., Referral, Google Ads"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out bg-gray-700 border-gray-600 rounded"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                />
                <label htmlFor="followUpRequired" className="ml-2 block text-gray-300 text-sm font-medium">Follow-up Required</label>
              </div>

              {/* Property Details Sub-section */}
              <h3 className="text-lg font-semibold text-gray-100 mt-6 flex items-center">
                <Home className="w-5 h-5 mr-2 text-indigo-400" />
                Property Details (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="propertyName" className="block text-gray-300 text-sm font-medium mb-1">Property Name</label>
                  <input
                    type="text"
                    id="propertyName"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g., Oceanview Luxury Condos"
                  />
                </div>
                <div>
                  <label htmlFor="propertyAddress" className="block text-gray-300 text-sm font-medium mb-1">Property Address</label>
                  <input
                    type="text"
                    id="propertyAddress"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g., 123 Main St, Anytown, FL"
                  />
                </div>
                <div>
                  <label htmlFor="propertyPrice" className="block text-gray-300 text-sm font-medium mb-1">Property Price</label>
                  <input
                    type="text"
                    id="propertyPrice"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    placeholder="e.g., $1,250,000 or $200k-$300k"
                  />
                </div>
                <div>
                  <label htmlFor="propertyType" className="block text-gray-300 text-sm font-medium mb-1">Property Type</label>
                  <input
                    type="text"
                    id="propertyType"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="e.g., Luxury Condo, SFH"
                  />
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-gray-300 text-sm font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-gray-300 text-sm font-medium mb-1">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label htmlFor="sqft" className="block text-gray-300 text-sm font-medium mb-1">Sq. Ft.</label>
                  <input
                    type="number"
                    id="sqft"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    placeholder="e.g., 2100"
                  />
                </div>
                <div>
                  <label htmlFor="listingAgent" className="block text-gray-300 text-sm font-medium mb-1">Listing Agent</label>
                  <input
                    type="text"
                    id="listingAgent"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={listingAgent}
                    onChange={(e) => setListingAgent(e.target.value)}
                    placeholder="e.g., Maria Rodriguez"
                  />
                </div>
                <div>
                  <label htmlFor="commission" className="block text-gray-300 text-sm font-medium mb-1">Commission</label>
                  <input
                    type="text"
                    id="commission"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="e.g., 3%"
                  />
                </div>
              </div>

              {/* Additional Booking Status Fields */}
              <h3 className="text-lg font-semibold text-gray-100 mt-6 flex items-center">
                <Star className="w-5 h-5 mr-2 text-indigo-400" />
                Status Details (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preApprovalStatus" className="block text-gray-300 text-sm font-medium mb-1">Pre-Approval Status</label>
                  <input
                    type="text"
                    id="preApprovalStatus"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={preApprovalStatus}
                    onChange={(e) => setPreApprovalStatus(e.target.value)}
                    placeholder="e.g., Pending, Approved"
                  />
                </div>
                <div>
                  <label htmlFor="urgency" className="block text-gray-300 text-sm font-medium mb-1">Urgency</label>
                  <input
                    type="text"
                    id="urgency"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    placeholder="e.g., Looking to buy within 3 months"
                  />
                </div>
                <div>
                  <label htmlFor="listingPotential" className="block text-gray-300 text-sm font-medium mb-1">Listing Potential</label>
                  <input
                    type="text"
                    id="listingPotential"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={listingPotential}
                    onChange={(e) => setListingPotential(e.target.value)}
                    placeholder="e.g., High, Medium"
                  />
                </div>
                <div>
                  <label htmlFor="competitorAnalysis" className="block text-gray-300 text-sm font-medium mb-1">Competitor Analysis</label>
                  <input
                    type="text"
                    id="competitorAnalysis"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={competitorAnalysis}
                    onChange={(e) => setCompetitorAnalysis(e.target.value)}
                    placeholder="e.g., Two other agents presenting"
                  />
                </div>
                <div>
                  <label htmlFor="closingDate" className="block text-gray-300 text-sm font-medium mb-1">Closing Date</label>
                  <input
                    type="date" // Use type="date" for just date input
                    id="closingDate"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-md flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Event</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddEventModal;
