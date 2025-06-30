const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

// Define your MongoDB connection URI (it's good practice to use an environment variable here)
const mongoURI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const events = [
  {
    title: 'Property Showing - Luxury Condo',
    start: new Date('2025-07-01T10:00:00'),
    end: new Date('2025-07-01T11:30:00'),
    extendedProps: {
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
  },
  {
    title: 'Open Slot - Available',
    start: new Date('2025-07-01T14:00:00'),
    end: new Date('2025-07-01T15:30:00'),
    extendedProps: {
      type: 'open_slot',
      description: 'Available for client calls, property viewings, or administrative tasks.',
      notes: 'Perfect time for prospecting calls or follow-up with recent leads.',
      appointmentType: 'Available Time',
      priority: 'low'
    },
  },
  {
    title: 'Closing Meeting - Suburban Home',
    start: new Date('2025-07-02T09:30:00'),
    end: new Date('2025-07-02T11:00:00'),
    extendedProps: {
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
      closingDate: new Date('2025-07-02'),
      followUpRequired: false,
      estimatedDuration: 90
    },
  },
  {
    title: 'First-Time Buyer Consultation',
    start: new Date('2025-07-03T11:00:00'),
    end: new Date('2025-07-03T12:30:00'),
    extendedProps: {
      type: 'booking',
      description: 'Initial consultation with first-time home buyers.',
      client: 'Michael & Lisa Chen',
      clientPhone: '+1 (555) 456-7890',
      clientEmail: 'michael.chen@email.com',
      propertyName: 'N/A - Consultation', // Indicate it's a consultation, not a specific property showing
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
  },
  {
    title: 'Market Analysis Presentation',
    start: new Date('2025-07-04T10:00:00'),
    end: new Date('2025-07-04T11:00:00'),
    extendedProps: {
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
  },
  {
    title: 'Team Strategy Meeting',
    start: new Date('2025-07-04T15:00:00'),
    end: new Date('2025-07-04T16:00:00'),
    extendedProps: {
      type: 'booking',
      description: 'Weekly team meeting to discuss market trends and strategies.',
      appointmentType: 'Team Meeting',
      meetingLocation: 'Conference Room A',
      priority: 'medium',
      notes: 'Review weekly performance, discuss new marketing strategies, and plan upcoming open houses.',
      followUpRequired: false,
      estimatedDuration: 60
    },
  },
  {
    title: 'Property Showing - Downtown Loft',
    start: new Date('2025-07-07T14:30:00'), // Next week from today (July 7th is a Monday)
    end: new Date('2025-07-07T16:00:00'),
    extendedProps: {
      type: 'booking',
      description: 'Showing modern loft to young professionals, keen on city living.',
      client: 'Alex & Chloe Smith',
      clientPhone: '+1 (555) 321-9876',
      clientEmail: 'smith.a.c@email.com',
      propertyName: 'The Urban Residences',
      propertyAddress: '567 Metropolis Ave, Apt 12A, Cityville, FL 33101',
      propertyPrice: '$750,000',
      propertyType: 'Loft Condo',
      bedrooms: 1,
      bathrooms: 1.5,
      sqft: 950,
      listingAgent: 'Self',
      commission: '2.5%',
      priority: 'high',
      notes: 'Clients prefer high-floor units with city views. Follow up with building amenities brochure.',
      leadSource: 'Zillow lead',
      appointmentType: 'Property Showing',
      meetingLocation: 'Building Lobby',
      clientPreferences: 'Gym, rooftop access, pet-friendly',
      followUpRequired: true,
      estimatedDuration: 90
    },
  },
  {
    title: 'Loan Approval Follow-up',
    start: new Date('2025-07-08T09:00:00'),
    end: new Date('2025-07-08T09:45:00'),
    extendedProps: {
      type: 'booking',
      description: 'Check status of pre-approval for upcoming closing.',
      client: 'Sarah Johnson',
      clientPhone: '+1 (555) 777-1111',
      clientEmail: 's.johnson@email.com',
      propertyName: 'N/A - Financial',
      priority: 'medium',
      notes: 'Lender to provide update on final loan approval for 888 Lakeview Dr.',
      appointmentType: 'Follow-up Call',
      followUpRequired: false,
      estimatedDuration: 45
    },
  },
  {
    title: 'Vacation - Out of Office',
    start: new Date('2025-07-10T00:00:00'),
    end: new Date('2025-07-13T23:59:59'), // Spans multiple days
    allDay: true,
    extendedProps: {
      type: 'open_slot', // Using open_slot to represent unavailability
      description: 'Vacation leave. Emergency contacts available.',
      notes: 'Forward calls to assistant. Auto-responder active.',
      priority: 'low',
      appointmentType: 'Out of Office'
    },
  },
  {
    title: 'Inspection - Historic Townhouse',
    start: new Date('2025-07-14T13:00:00'),
    end: new Date('2025-07-14T16:00:00'),
    extendedProps: {
      type: 'booking',
      description: 'Property inspection for 333 Heritage Lane.',
      client: 'Mr. & Mrs. Patel',
      clientPhone: '+1 (555) 222-3333',
      clientEmail: 'patel.family@email.com',
      propertyName: 'The Heritage Place',
      propertyAddress: '333 Heritage Lane, Old Town, FL 33130',
      propertyPrice: '$620,000',
      propertyType: 'Historic Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      listingAgent: 'Self',
      priority: 'high',
      notes: 'Meet inspector on site. Follow up with repair requests after report.',
      appointmentType: 'Property Inspection',
      meetingLocation: 'Property Site',
      followUpRequired: true,
      estimatedDuration: 180
    },
  },
  {
    title: 'Brokerage Training Session',
    start: new Date('2025-07-15T09:00:00'),
    end: new Date('2025-07-15T12:00:00'),
    extendedProps: {
      type: 'booking',
      description: 'Mandatory training on new CRM software.',
      appointmentType: 'Training',
      meetingLocation: 'Brokerage Conference Room',
      priority: 'medium',
      notes: 'Bring laptops. Coffee and refreshments provided.',
      followUpRequired: false,
      estimatedDuration: 180
    },
  }
];


async function seedDatabase() {
  try {
    // Clear existing events (optional, remove if you want to append)
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    await Event.insertMany(events);
    console.log('Successfully seeded events');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();