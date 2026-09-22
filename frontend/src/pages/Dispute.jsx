
function Dispute(){

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

      formData.append("subject", form.subject);
      formData.append("describe", form.describe);
      formData.append("file", form.file);

      // IMPORTANT: must match upload.single('image')
      formData.append("image", image);

      const token = localStorage.getItem("wayfare_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/disputes`,
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
        throw new Error(data.message || "Failed to add Issue");
      }

      console.log("Property created:", data.listing);

      alert("Issue added successfully!");
    } catch (error) {
      console.error("Add Issue error:", error);
      alert(error.message);
    }
  }


  return(
<div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-ink/50 mb-3">
          Issue Section
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-line rounded-3xl p-8 bg-parchment"
      >
        <div>
          <label className="block text-sm mb-2">
            Issue Subject
          </label>

          <textarea
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            rows="1"
            placeholder="Subject of the issue"
            className="w-full px-4 py-3 rounded-xl border border-line bg-white outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">
            Describe the issue you faced while staying on a property
          </label>

          <textarea
            name="describe"
            value={form.describe}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Where are you located and what is the issue you faced?"
            className="w-full px-4 py-3 rounded-xl border border-line bg-white outline-none focus:border-ink"
          />
        </div>

          {/* PROPERTY IMAGE */}
        <div>
            <label className="block text-sm font-medium mb-2">
              Image: Proof of the dispute
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-teal text-parchment hover:bg-teal-light transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Issue'}
        </button>
      </form>
    </div>
  );
}

export default Dispute;