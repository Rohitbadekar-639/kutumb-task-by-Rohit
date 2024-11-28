import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuotes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusIcon } from '@heroicons/react/24/solid';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const fetchQuotes = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await getQuotes(token, 20, page * 20);
      
      // Check if response is an array
      const newQuotes = Array.isArray(response) ? response : 
                        (response.quotes ? response.quotes : []);
      
      if (newQuotes.length === 0) {
        setHasMore(false);
        return;
      }
      
      setQuotes(prev => [...prev, ...newQuotes]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Fetch quotes error:', error);
      if (error.response && error.response.status === 401) {
        logout();
        navigate('/login');
      }
    }
  }, [hasMore, page, token, logout, navigate]);

  useEffect(() => {
    if (token) {
      fetchQuotes();
    } else {
      navigate('/login');
    }
  }, [token, fetchQuotes, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.map((quote, index) => (
          <div 
            key={index} 
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img 
                src={quote.mediaUrl} 
                alt="Quote" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <p className="text-white text-center text-lg font-semibold p-4">
                  {quote.text}
                </p>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-gray-600">{quote.username}</span>
              <span className="text-gray-500 text-sm">
                {new Date(quote.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-4">
          <button 
            onClick={fetchQuotes}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
      <button 
        onClick={() => navigate('/create')}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >Quote
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default QuoteList;