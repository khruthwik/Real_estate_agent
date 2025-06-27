import React, { useRef } from 'react';

export default function AddProperty() {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const payload = {
      title: data.get('title'),
      address: data.get('address'),
      price: Number(data.get('price')),
      type: data.get('type'),
      bedrooms: Number(data.get('bedrooms')),
      bathrooms: Number(data.get('bathrooms')),
      features: {
        petFriendly: form.elements.petFriendly.checked,
        parking: form.elements.parking.checked,
      },
      description: data.get('description'),
      imageUrl: data.get('imageUrl'),
      info_vector: [], // populate if needed
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Property added successfully!');
        form.reset();
      } else {
        const err = await res.json();
        console.error(err);
        alert('Error saving property: ' + (err.error || res.statusText));
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Property</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Price ($/mo)', name: 'price', type: 'number' },
            { label: 'Type', name: 'type', type: 'text' },
            { label: 'Bedrooms', name: 'bedrooms', type: 'number' },
            { label: 'Bathrooms', name: 'bathrooms', type: 'number' },
            { label: 'Image URL', name: 'imageUrl', type: 'url' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 mb-1">{label}</label>
              <input
                name={name}
                type={type}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input type="checkbox" name="petFriendly" className="form-checkbox h-5 w-5 text-green-500" />
              <span className="ml-2 text-gray-700">Pet Friendly</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="parking" className="form-checkbox h-5 w-5 text-blue-500" />
              <span className="ml-2 text-gray-700">Parking Available</span>
            </label>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe features..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition"
          >
            Save Property
          </button>
        </form>
      </div>
    </div>
  );
}
