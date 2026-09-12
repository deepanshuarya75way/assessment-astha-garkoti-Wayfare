import 'dotenv/config'
import { connectDB } from '../config/db.js'
import Listing from '../models/Listing.js'
import mongoose from 'mongoose'

const listings = [
  {
    title: "Luxury Beach Villa with Private Pool",
    location: "North Goa, India",
    code: "IND-GOA-001",
    price: 8500,
    rating: 4.92,
    reviews: 326,
    guests: 8,
    beds: 4,
    baths: 3,
    host: "Aarav",
    hostSince: 2019,
    tags: ["Beachfront", "Pool", "Superhost"],
    images: [
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
    ],
    description:
      "A tropical villa near Goa beaches with a private pool, outdoor dining area and easy access to cafes, nightlife and water activities.",
    amenities: [
      "Swimming pool",
      "Beach access",
      "Kitchen",
      "Wifi",
      "Air conditioning",
      "Parking"
    ]
  },

  {
    title: "Wooden Cottage Facing Himalayan Peaks",
    location: "Manali, Himachal Pradesh, India",
    code: "IND-MAN-002",
    price: 4200,
    rating: 4.89,
    reviews: 214,
    guests: 5,
    beds: 3,
    baths: 2,
    host: "Rohan",
    hostSince: 2018,
    tags: ["Mountain View", "Peaceful", "Workation"],
    images: [
      "https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=1200",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200"
    ],
    description:
      "A cozy mountain cottage surrounded by pine forests with panoramic Himalayan views. Ideal for couples and remote workers.",
    amenities: [
      "Mountain view",
      "Fireplace",
      "Kitchen",
      "Heating",
      "Wifi",
      "Parking"
    ]
  },

  {
    title: "Royal Heritage Haveli Stay",
    location: "Jaipur, Rajasthan, India",
    code: "IND-JAI-003",
    price: 5200,
    rating: 4.95,
    reviews: 187,
    guests: 4,
    beds: 2,
    baths: 2,
    host: "Rajveer",
    hostSince: 2016,
    tags: ["Heritage", "Royal", "Cultural"],
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200",
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?q=80&w=1200"
    ],
    description:
      "A restored Rajasthani haveli with traditional architecture, courtyards and easy access to Jaipur forts and markets.",
    amenities: [
      "Heritage building",
      "Breakfast",
      "Wifi",
      "Air conditioning",
      "Courtyard"
    ]
  },

  {
    title: "Lake View Palace Apartment",
    location: "Udaipur, Rajasthan, India",
    code: "IND-UDA-004",
    price: 6800,
    rating: 4.91,
    reviews: 263,
    guests: 4,
    beds: 2,
    baths: 2,
    host: "Meera",
    hostSince: 2020,
    tags: ["Lake View", "Romantic", "Luxury"],
    images: [
      "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=1200",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1200"
    ],
    description:
      "A beautiful stay overlooking Udaipur lakes with rooftop views, traditional interiors and palace-style surroundings.",
    amenities: [
      "Lake view",
      "Rooftop terrace",
      "Kitchen",
      "Wifi",
      "Breakfast"
    ]
  },

  {
    title: "Kerala Backwater Garden Villa",
    location: "Alappuzha, Kerala, India",
    code: "IND-KER-005",
    price: 7500,
    rating: 4.96,
    reviews: 298,
    guests: 6,
    beds: 3,
    baths: 2,
    host: "Ananya",
    hostSince: 2017,
    tags: ["Backwaters", "Nature", "Relaxing"],
    images: [
      "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?q=80&w=1200",
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200"
    ],
    description:
      "A peaceful Kerala villa beside the backwaters with coconut trees, local food experiences and houseboat access.",
    amenities: [
      "Garden",
      "Backwater view",
      "Kitchen",
      "Wifi",
      "Breakfast",
      "Parking"
    ]
  }

]

async function seed() {
  await connectDB()
  await Listing.deleteMany({})
  await Listing.insertMany(listings)
  console.log(`Seeded ${listings.length} listings.`)
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
