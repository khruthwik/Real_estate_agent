import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, Clock, MapPin, User, FileText, Phone, Mail, Home, DollarSign,
  Calendar as CalendarIcon, Users, Star, AlertTriangle, AlertCircle, Info, Maximize2
} from 'lucide-react';

const EventPopover = ({ event, onClose, position }) => {
  const popoverRef = useRef(null);
  const contentRef = useRef(null);
  const [calculatedStyle, setCalculatedStyle] = useState({});

  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getPriorityIcon = useCallback((priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  }, []);

 useLayoutEffect(() => {
  if (!popoverRef.current || !position || !event) {
    setCalculatedStyle({});
    return;
  }

  const { top: eventTop, left: eventLeft, width: eventWidth, height: eventHeight } = position;
  const popoverElement = popoverRef.current;

  const popoverActualWidth = popoverElement.offsetWidth;
  const popoverActualHeight = popoverElement.offsetHeight;

  const margin = 10; // Margin from the edge of the *effective viewport*

  const parentElement = popoverElement.offsetParent || document.documentElement;
  const viewportWidth = parentElement.clientWidth;
  const viewportHeight = parentElement.clientHeight;

  let finalTop = eventTop;
  let finalLeft = eventLeft; // Start with eventLeft, then adjust

  // --- Horizontal Adjustment: Prefer popping to the left ---
  // Calculate potential left position if placed to the left of the event
  let potentialLeft = eventLeft - popoverActualWidth - margin;

  // Check if popping to the left fits within the viewport
  if (potentialLeft >= margin) {
    // If there's enough space to the left, place it there
    finalLeft = potentialLeft;
  } else {
    // If it overflows to the left, try to place it to the right
    potentialLeft = eventLeft + eventWidth + margin;
    // If placing to the right also overflows, clamp to the right edge
    if (potentialLeft + popoverActualWidth > viewportWidth - margin) {
      finalLeft = viewportWidth - popoverActualWidth - margin;
    } else {
      // Otherwise, place it to the right
      finalLeft = potentialLeft;
    }
  }

  // --- Vertical Adjustment (same as before) ---
  // If popover overflows downwards, try to place it above the event
  if (finalTop + popoverActualHeight > viewportHeight - margin) {
    finalTop = eventTop - popoverActualHeight - margin;
  }
  // If popover overflows upwards (or initial position is too far up), shift it down
  if (finalTop < margin) {
    finalTop = margin;
  }

  // Calculate transform origin for animation (scaling from the event's center)
  // These calculations need to be relative to the popover's final position.
  const eventCenterX = eventLeft + eventWidth / 2;
  const eventCenterY = eventTop + eventHeight / 2;

  // Convert event center coordinates to be relative to the popover's top-left corner
  let originPixelX = eventCenterX - finalLeft;
  let originPixelY = eventCenterY - finalTop;

  // Clamp origin to be within the bounds of the popover itself (0 to popoverActualWidth/Height)
  originPixelX = Math.max(0, Math.min(popoverActualWidth, originPixelX));
  originPixelY = Math.max(0, Math.min(popoverActualHeight, originPixelY));

  // Convert pixel origins to percentage for transform-origin CSS property
  const originX = `${(originPixelX / popoverActualWidth) * 100}%`;
  const originY = `${(originPixelY / popoverActualHeight) * 100}%`;

  // Set the calculated style
  setCalculatedStyle({
    position: 'absolute',
    top: `${finalTop}px`,
    left: `${finalLeft}px`,
    minWidth: '300px',
    maxWidth: '400px',
    zIndex: 60,
    transformOrigin: `${originX} ${originY}`,
  });
}, [event, position]);

  const springTransition = {
    type: "spring",
    damping: 25,
    stiffness: 400,
    mass: 0.8
  };

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={springTransition}
      style={calculatedStyle}
      className="
        bg-white rounded-xl shadow-3xl border border-blue-200
        flex flex-col max-h-[80vh] overflow-hidden
      "
      data-event-id={event?.id?.toString()}
    >
      {/* Popover Header */}
      <div className="flex justify-between items-start p-5 pb-3 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-900 pr-8 leading-tight">{event.title}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={contentRef}
        className="p-5 flex-grow overflow-y-auto scroll-smooth custom-scrollbar"
      >
        <div className="space-y-3 text-gray-700 text-sm">
          {/* Date and Time */}
          <div className="flex items-center text-base font-medium text-blue-700">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{new Date(event.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
            {event.extendedProps.estimatedDuration && (
              <span className="ml-3 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                {event.extendedProps.estimatedDuration} min
              </span>
            )}
          </div>

          {/* Description */}
          {event.extendedProps.description && (
            <div className="flex items-start">
              <FileText className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
              <p>{event.extendedProps.description}</p>
            </div>
          )}

          {/* Priority */}
          {event.extendedProps.priority && (
            <div className="flex items-center">
              {getPriorityIcon(event.extendedProps.priority)}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityColor(event.extendedProps.priority)}`}>
                {event.extendedProps.priority} Priority
              </span>
            </div>
          )}

          {/* Client Details */}
          {(event.extendedProps.client || event.extendedProps.clientPhone || event.extendedProps.clientEmail || event.extendedProps.clientPreferences || event.extendedProps.leadSource || event.extendedProps.preApprovalStatus || event.extendedProps.urgency) && (
            <>
              <hr className="border-gray-200 my-2" />
              <h4 className="text-base font-semibold text-gray-800 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Client Details
              </h4>
              <div className="space-y-1 pl-6">
                {event.extendedProps.client && <p className="font-medium">{event.extendedProps.client}</p>}
                {event.extendedProps.clientPhone && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    <a href={`tel:${event.extendedProps.clientPhone}`} className="text-blue-600 hover:underline">
                      {event.extendedProps.clientPhone}
                    </a>
                  </p>
                )}
                {event.extendedProps.clientEmail && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    <a href={`mailto:${event.extendedProps.clientEmail}`} className="text-blue-600 hover:underline">
                      {event.extendedProps.clientEmail}
                    </a>
                  </p>
                )}
                {event.extendedProps.clientPreferences && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Preferences: {event.extendedProps.clientPreferences}
                  </p>
                )}
                {event.extendedProps.leadSource && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Lead Source: {event.extendedProps.leadSource}
                  </p>
                )}
                {event.extendedProps.preApprovalStatus && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Pre-Approval: {event.extendedProps.preApprovalStatus}
                  </p>
                )}
                {event.extendedProps.urgency && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgency: {event.extendedProps.urgency}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Property Details */}
          {event.extendedProps.propertyName && event.extendedProps.propertyName !== 'N/A - Consultation' && (
            <>
              <hr className="border-gray-200 my-2" />
              <h4 className="text-base font-semibold text-gray-800 flex items-center">
                <Home className="w-4 h-4 mr-2 text-blue-600" />
                Property Details
              </h4>
              <div className="space-y-1 pl-6">
                <p className="font-medium">{event.extendedProps.propertyName}</p>
                {event.extendedProps.propertyAddress && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.extendedProps.propertyAddress}
                  </p>
                )}
                {event.extendedProps.propertyPrice && (
                  <p className="text-base font-bold text-green-700 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {event.extendedProps.propertyPrice}
                  </p>
                )}
                {(event.extendedProps.bedrooms || event.extendedProps.bathrooms || event.extendedProps.sqft) && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Maximize2 className="w-3 h-3 mr-1" />
                    {event.extendedProps.bedrooms && `${event.extendedProps.bedrooms} Beds `}
                    {event.extendedProps.bathrooms && `${event.extendedProps.bathrooms} Baths `}
                    {event.extendedProps.sqft && `${event.extendedProps.sqft} sqft`}
                  </p>
                )}
                {event.extendedProps.propertyType && (
                  <p className="text-sm text-gray-600">
                    Type: {event.extendedProps.propertyType}
                  </p>
                )}
                {event.extendedProps.listingAgent && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Listing Agent: {event.extendedProps.listingAgent}
                  </p>
                )}
                {event.extendedProps.commission && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Commission: {event.extendedProps.commission}
                  </p>
                )}
                {event.extendedProps.listingPotential && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Listing Potential: {event.extendedProps.listingPotential}
                  </p>
                )}
                {event.extendedProps.competitorAnalysis && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Competitors: {event.extendedProps.competitorAnalysis}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Other Details */}
          {(event.extendedProps.appointmentType || event.extendedProps.meetingLocation || event.extendedProps.closingDate || event.extendedProps.followUpRequired !== undefined) && (
            <>
              <hr className="border-gray-200 my-2" />
              <h4 className="text-base font-semibold text-gray-800 flex items-center">
                <Info className="w-4 h-4 mr-2 text-blue-600" />
                Additional Info
              </h4>
              <div className="space-y-1 pl-6">
                {event.extendedProps.appointmentType && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Type: {event.extendedProps.appointmentType}
                  </p>
                )}
                {event.extendedProps.meetingLocation && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location: {event.extendedProps.meetingLocation}
                  </p>
                )}
                {event.extendedProps.closingDate && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Closing Date: {new Date(event.extendedProps.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
                {event.extendedProps.followUpRequired !== undefined && (
                  <p className="text-sm text-gray-600 flex items-center">
                    {event.extendedProps.followUpRequired ? (
                      <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                    ) : (
                      <Star className="w-3 h-3 mr-1 text-green-500" />
                    )}
                    Follow-up: {event.extendedProps.followUpRequired ? 'Required' : 'Not Required'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Popover Footer */}
      <div className="p-5 pt-3 border-t border-gray-100 flex justify-end flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default EventPopover;