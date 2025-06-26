import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProperty() {
  const [form, setForm] = useState({
    title: '',
    address: '',
    price: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    imageUrl: '',
    description: '',
    petFriendly: false,
    parking: false
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        address: form.address,
        price: Number(form.price),
        type: form.type,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        imageUrl: form.imageUrl,
        description: form.description,
        features: {
          petFriendly: form.petFriendly,
          parking: form.parking
        }
      })
    });

    if (res.ok) {
      toast.success('Property added successfully!');
      navigate('/');
    } else {
      console.error(await res.json());
      alert('Error saving property');
    }
  };

//   is git working.

  const fields = [
    { label: 'Title', name: 'title', type: 'text' },
    { label: 'Address', name: 'address', type: 'text' },
    { label: 'Price ($/mo)', name: 'price', type: 'number' },
    { label: 'Type', name: 'type', type: 'text' },
    { label: 'Bedrooms', name: 'bedrooms', type: 'number' },
    { label: 'Bathrooms', name: 'bathrooms', type: 'number' },
    { label: 'Image URL', name: 'imageUrl', type: 'text' }
  ];

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-950">
      <ToastContainer />
      <div className="bg-black/40 p-10 rounded-3xl max-w-3xl mx-auto animate-float-in">
        <h2 className="text-3xl font-bold text-gray-50 mb-8">
          Add New Property
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-300 mb-1">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                type={type}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100"
                required
              />
            </div>
          ))}

          {/* Feature Checkboxes */}
          <div className="flex gap-8">
            <label className="text-gray-300 flex items-center gap-2">
              <input
                type="checkbox"
                name="petFriendly"
                checked={form.petFriendly}
                onChange={handleChange}
                className="accent-green-500"
              />
              Pet Friendly
            </label>
            <label className="text-gray-300 flex items-center gap-2">
              <input
                type="checkbox"
                name="parking"
                checked={form.parking}
                onChange={handleChange}
                className="accent-blue-500"
              />
              Parking Available
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100"
              placeholder="Describe features..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl"
          >
            Save Property
          </button>
        </form>
      </div>
    </div>
  );
}
