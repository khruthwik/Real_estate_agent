const mongoose = require('mongoose');
const Event = require('./models/Event');
const Les = require('./models/Property'); // Assuming you have a Leasing model defined
require('dotenv').config();

// Define your MongoDB connection URI (it's good practice to use an environment variable here)
const mongoURI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const properties = [
  {
    title: "Cozy 2BHK Apartment in Midtown",
    location: "Midtown Heights",
    price: 1600,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    year_built: 2015,
    studio: false,
    independent_home_type: false,
    pets_allowed: true,
    furnished: true,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: true,
    utilities_included: false,
    outdoor_space: true,
    controlled_access: true,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Modern apartment with appliances and balcony in Midtown.",
    imageUrl: "https://source.unsplash.com/featured/?apartment,midtown",
    info_vector: [],
  },
  {
    title: "Studio Flat in Tech Park",
    location: "Tech Park",
    price: 1400,
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 490,
    year_built: 2021,
    studio: true,
    independent_home_type: false,
    pets_allowed: false,
    furnished: true,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: false,
    in_house_laundry: false,
    elevator: true,
    utilities_included: true,
    outdoor_space: false,
    controlled_access: true,
    features: {
      petFriendly: false,
      parking: false
    },
    info_text: "Minimalist smart studio perfect for professionals.",
    imageUrl: "https://source.unsplash.com/featured/?studio,apartment",
    info_vector: [],
  },
  {
    title: "4BHK Independent Home in Maple Estates",
    location: "Maple Estates",
    price: 2800,
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2100,
    year_built: 2005,
    studio: false,
    independent_home_type: true,
    pets_allowed: true,
    furnished: true,
    ac_available: true,
    pool_available: true,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: false,
    utilities_included: false,
    outdoor_space: true,
    controlled_access: false,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Large family home near park with private pool.",
    imageUrl: "https://source.unsplash.com/featured/?house,estate",
    info_vector: [],
  },
  {
    title: "Luxury Condo in Seaside Village",
    location: "Seaside Village",
    price: 2200,
    type: "condo",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    year_built: 2020,
    studio: false,
    independent_home_type: false,
    pets_allowed: true,
    furnished: true,
    ac_available: true,
    pool_available: true,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: true,
    utilities_included: false,
    outdoor_space: true,
    controlled_access: true,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Spacious condo with ocean views and modern design.",
    imageUrl: "https://source.unsplash.com/featured/?condo,seaside",
    info_vector: [],
  },
  {
    title: "Affordable Studio Near University",
    location: "College District",
    price: 1200,
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 400,
    year_built: 2014,
    studio: true,
    independent_home_type: false,
    pets_allowed: false,
    furnished: true,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: false,
    in_house_laundry: false,
    elevator: false,
    utilities_included: true,
    outdoor_space: false,
    controlled_access: false,
    features: {
      petFriendly: false,
      parking: false
    },
    info_text: "Compact and efficient student studio apartment.",
    imageUrl: "https://source.unsplash.com/featured/?student,studio",
    info_vector: [],
  },
  {
    title: "Pet-Friendly Riverfront Apartment",
    location: "Riverbend",
    price: 2000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    year_built: 2018,
    studio: false,
    independent_home_type: false,
    pets_allowed: true,
    furnished: false,
    ac_available: true,
    pool_available: true,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: true,
    utilities_included: false,
    outdoor_space: true,
    controlled_access: true,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Corner unit with beautiful river views and balcony.",
    imageUrl: "https://source.unsplash.com/featured/?river,apartment",
    info_vector: [],
  },
  {
    title: "Family Duplex with Yard",
    location: "Hillside Ridge",
    price: 2450,
    type: "duplex",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    year_built: 2016,
    studio: false,
    independent_home_type: true,
    pets_allowed: true,
    furnished: false,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: false,
    utilities_included: true,
    outdoor_space: true,
    controlled_access: false,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Modern duplex with fenced yard and solar panels.",
    imageUrl: "https://source.unsplash.com/featured/?duplex,house",
    info_vector: [],
  },
  {
    title: "Townhome with Garage & Deck",
    location: "Northgate",
    price: 2300,
    type: "townhouse",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1450,
    year_built: 2010,
    studio: false,
    independent_home_type: true,
    pets_allowed: true,
    furnished: false,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: false,
    utilities_included: false,
    outdoor_space: true,
    controlled_access: false,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Townhouse with garage, split-level plan and deck.",
    imageUrl: "https://source.unsplash.com/featured/?townhouse,home",
    info_vector: [],
  },
  {
    title: "Eco-Friendly Smart Flat",
    location: "Innovation Park",
    price: 1950,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    year_built: 2022,
    studio: false,
    independent_home_type: false,
    pets_allowed: true,
    furnished: true,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: true,
    in_house_laundry: true,
    elevator: true,
    utilities_included: true,
    outdoor_space: false,
    controlled_access: true,
    features: {
      petFriendly: true,
      parking: true
    },
    info_text: "Eco-smart apartment with voice control & solar roof.",
    imageUrl: "https://source.unsplash.com/featured/?smart,apartment",
    info_vector: [],
  },
  {
    title: "Classic Brownstone Renovation",
    location: "Historic Row",
    price: 1700,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 940,
    year_built: 1905,
    studio: false,
    independent_home_type: false,
    pets_allowed: true,
    furnished: false,
    ac_available: true,
    pool_available: false,
    dedicated_parking_type: false,
    in_house_laundry: true,
    elevator: false,
    utilities_included: true,
    outdoor_space: true,
    controlled_access: false,
    features: {
      petFriendly: true,
      parking: false
    },
    info_text: "Vintage charm with modern interior in prime location.",
    imageUrl: "https://source.unsplash.com/featured/?brownstone,home",
    info_vector: [],
  }
  // You can duplicate and vary these 10 more times to complete 20
];



// You can use this array in your component's state initialization:
// const [properties, setProperties] = useState(exampleProperties);
// const [filteredProperties, setFilteredProperties] = useState(exampleProperties);


async function seedDatabase() {
  try {
    // Clear existing events (optional, remove if you want to append)
    await Les.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    await Les.insertMany(properties);
    console.log('Successfully seeded events');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();