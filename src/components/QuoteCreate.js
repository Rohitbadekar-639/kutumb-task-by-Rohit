// src/components/QuoteCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadMedia, createQuote } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QuoteCreate = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an image');
      return;
    }

    try {
      const mediaUrl = await uploadMedia(file);
      await createQuote(token, text, mediaUrl);
      navigate('/quotes');
    } catch (err) {
      setError('Failed to create quote');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Quote</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              placeholder="Write your quote..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg h-24"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {previewUrl && (
            <div className="mb-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Create Quote
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteCreate;