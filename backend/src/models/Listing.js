import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // e.g. "NOR-014"
    price: { type: Number, required: true }, // per night, in USD
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    guests: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    host: {
      type: String,
      required: true,
    },
    hostSince: { type: Number, required: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, required: true },
    amenities: [{ type: String }],
  },
  { timestamps: true },
);

listingSchema.index({ title: "text", location: "text" });

export default mongoose.model("Listing", listingSchema);