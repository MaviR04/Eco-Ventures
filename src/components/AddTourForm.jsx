import React, { useState } from "react";
import axios from "axios";

function AddTourForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    available_slots: "",
    price: "",
    category_id: "",
    images: [],
    itineraries: [{ day_number: 1, day_title: "", day_description: "" }],
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItineraries = [...formData.itineraries];
    newItineraries[index][field] = value;
    setFormData({ ...formData, itineraries: newItineraries });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itineraries: [
        ...formData.itineraries,
        {
          day_number: formData.itineraries.length + 1,
          day_title: "",
          day_description: "",
        },
      ],
    });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Upload images
      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        const uploadForm = new FormData();
        imageFiles.forEach((file) => uploadForm.append("images", file));

        const res = await axios.post("http://localhost:3000/api/tours/upload", uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedUrls = res.data.imageUrls; // e.g. ["/images/abc.jpg"]
      }

      // Step 2: Create tour
      const payload = {
        ...formData,
        available_slots: parseInt(formData.available_slots),
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        images: uploadedUrls,
      };

      await axios.post("http://localhost:3000/api/tours", payload);

      alert("Tour created successfully!");
      setFormData({
        title: "",
        description: "",
        available_slots: "",
        price: "",
        category_id: "",
        images: [],
        itineraries: [{ day_number: 1, day_title: "", day_description: "" }],
      });
      setImageFiles([]);
    } catch (err) {
      console.error("Failed to create tour:", err);
      alert("Failed to create tour. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6  shadow-md dark:shadow-2xl mt-10 rounded-2xl space-y-5 font-dmsans"
    >
      <h2 className="text-2xl font-bold mb-4 ">Add New Tour</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Tour Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows="4"
          required
        />
      </div>

      {/* Available slots */}
      <div>
        <label className="block text-sm font-medium mb-1">Available Slots</label>
        <input
          type="number"
          name="available_slots"
          value={formData.available_slots}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        >
          <option value="">Select Category</option>
          <option value="1">Hiking</option>
          <option value="2">Cycling</option>
          <option value="3">Nature Walks</option>
        </select>
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Itineraries */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Itineraries</h3>
        {formData.itineraries.map((itinerary, idx) => (
          <div key={idx} className="border border-gray-200 p-4 rounded-xl space-y-2 mb-3 ">
            <div>
              <label className="block text-sm font-medium mb-1">Day Title</label>
              <input
                type="text"
                value={itinerary.day_title}
                onChange={(e) =>
                  handleItineraryChange(idx, "day_title", e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Day Description</label>
              <textarea
                value={itinerary.day_description}
                onChange={(e) =>
                  handleItineraryChange(idx, "day_description", e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows="3"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItineraryDay}
          className="px-4 py-2 bg-blue-200 rounded-xl mt-2 hover:bg-blue-300 text-black"
        >
          + Add Day
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
      >
        Create Tour
      </button>
    </form>
  );
}

export default AddTourForm;
