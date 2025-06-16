import React, { useState } from 'react';

export default function RandomImg() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const UNSPLASH_ACCESS_KEY = '0AAKBZ9-IEtaNrqcAGc_3NPg0E3-0oEjH1iCktAeYd8';

  const searchImages = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=18&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      setImages(data.results || []);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching search images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6">
        Image Search Gallery
      </h1>

      {/* Search Box */}
      <form onSubmit={searchImages} className="flex justify-center mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images (e.g., mountains, cats, food...)"
          className="w-full max-w-md p-2 border-2 border-blue-400 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {/* No Results */}
      {!loading && searched && images.length === 0 && (
        <p className="text-center text-red-500 font-semibold">
          No images found. Try a different keyword.
        </p>
      )}

      {/* Image Grid with staggered animation */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="rounded-lg overflow-hidden shadow-md bg-white cursor-pointer hover:scale-110 hover:shadow-2xl transition duration-300 animate-fadeInUp"
              onClick={() => setSelectedImg(img.urls.regular)}
              style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
            >
              <img
                src={img.urls.small}
                alt={img.alt_description || 'Image'}
                className="w-full object-cover aspect-video"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImg && (
        <div className="fixed inset-0 backdrop-blur-xl bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
          <button
            onClick={() => setSelectedImg(null)}
            className="self-start text-black text-3xl mb-4 ml-4 hover:text-zinc-400 transition"
            title="Go Back"
          >
            ←
          </button>
          <img
            src={selectedImg}
            alt="Enlarged"
            className="max-w-4xl max-h-[80vh] rounded-xl shadow-xl transition-all duration-500 ease-out transform scale-100 opacity-100 animate-fadeIn"
          />
        </div>
      )}

      {/* Custom Keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out;
          }

          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
}
