import Listing from '../models/Listing.js'
import cloudinary from '../config/cloudinary.js'

// GET /api/listings?query=oaxaca&tag=Superhost
export async function getListings(req, res) {
  try {
    const { query, tag } = req.query

    const filter = {}

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ]
    }

    if (tag && tag !== 'All stays') {
      filter.tags = tag
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 })

    res.json({ listings })
  } catch (error) {
    console.error('Get listings error:', error)

    res.status(500).json({
      message: 'Failed to fetch listings.',
    })
  }
}

// GET /api/listings/:id
export async function getListingById(req, res) {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({
        message: 'That listing has moved on.',
      })
    }

    res.json({ listing })
  } catch (error) {
    console.error('Get listing error:', error)

    res.status(500).json({
      message: 'Failed to fetch listing.',
    })
  }
}

// POST /api/listings
export async function createListing(req, res) {
  try {
    const {
      title,
      location,
      code,
      price,
      guests,
      beds,
      baths,
      hostSince,
      description,
    } = req.body

    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: 'Property image is required.',
      })
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'wayfare/listings',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('FULL CLOUDINARY ERROR:', error)
            console.error('Cloudinary error keys:', Object.keys(error))
            console.error('Cloudinary response:', error.response)
            console.error('Cloudinary http code:', error.http_code)
            console.error('Cloudinary message:', error.message)

            reject(error)
          } else {
            resolve(result)
          }
        }
      )

      uploadStream.end(req.file.buffer)
    })

    // Save listing in MongoDB
    const listing = await Listing.create({
      title,
      location,
      code,
      price: Number(price),
      guests: Number(guests),
      beds: Number(beds),
      baths: Number(baths),
      host: req.user?.name || 'Wayfare host',
      hostSince: Number(hostSince),
      description,

      // Cloudinary image URL
      images: [result.secure_url],

      // Optional fields
      rating: 4.8,
      reviews: 0,
      tags: [],
      amenities: [],
    })

    res.status(201).json({
      message: 'Property added successfully.',
      listing,
    })
  } catch (error) {
    console.error('Create listing error:', error)

    res.status(500).json({
      message: error.message || 'Failed to create property.',
    })
  }
}