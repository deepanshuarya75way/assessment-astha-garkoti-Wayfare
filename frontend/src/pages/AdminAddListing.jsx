import React, { useState } from "react";

export default function AdminAddListing() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    code: "",
    price: "",
    guests: "",
    beds: "",
    baths: "",
    hostSince: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select a property image.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("code", form.code);
      formData.append("price", form.price);
      formData.append("guests", form.guests);
      formData.append("beds", form.beds);
      formData.append("baths", form.baths);
      formData.append("hostSince", form.hostSince);
      formData.append("description", form.description);

      // IMPORTANT: must match upload.single('image')
      formData.append("image", image);

      const token = localStorage.getItem("wayfare_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/listings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add property");
      }

      console.log("Property created:", data.listing);

      alert("Property added successfully!");
    } catch (error) {
      console.error("Add property error:", error);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* HEADER */}
        <p className="text-xs uppercase tracking-widest text-teal mb-2">
          Administration
        </p>

        <h1 className="font-display text-4xl mb-2">Add a property</h1>

        <p className="text-ink/50 mb-10">
          Add a new hotel, villa or apartment to Wayfare.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-parchmentDim border border-line rounded-3xl p-6 md:p-8 space-y-6"
        >
          {/* PROPERTY NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property name
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Beautiful Beach Villa"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Goa, India"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* PROPERTY CODE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property code
            </label>

            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="GOA-001"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price per night
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="3500"
              min="0"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* GUESTS + BEDS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum guests
              </label>

              <input
                type="number"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                placeholder="6"
                min="1"
                className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Beds</label>

              <input
                type="number"
                name="beds"
                value={form.beds}
                onChange={handleChange}
                placeholder="3"
                min="1"
                className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
                required
              />
            </div>
          </div>

          {/* BATHROOMS */}
          <div>
            <label className="block text-sm font-medium mb-2">Bathrooms</label>

            <input
              type="number"
              name="baths"
              value={form.baths}
              onChange={handleChange}
              placeholder="2"
              min="1"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* HOST SINCE */}
          <div>
            <label className="block text-sm font-medium mb-2">Host since</label>

            <input
              type="number"
              name="hostSince"
              value={form.hostSince}
              onChange={handleChange}
              placeholder="2024"
              min="1900"
              max="2100"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal"
              required
            />
          </div>

          {/* PROPERTY IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment"
              required
            />

            {image && (
              <div className="mt-4">
                <p className="text-sm text-ink/50 mb-3">
                  Selected: {image.name}
                </p>

                <img
                  src={URL.createObjectURL(image)}
                  alt="Property preview"
                  className="w-full max-w-md h-64 object-cover rounded-2xl"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the property..."
              rows="5"
              className="w-full border border-line rounded-xl px-4 py-3 bg-parchment outline-none focus:border-teal resize-none"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-teal text-parchment py-3 rounded-full font-medium hover:bg-teal/90 transition"
          >
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}
