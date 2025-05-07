'use client';

import { useEffect, useState } from 'react';

interface Bulletin {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function PostEventPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);

  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        const response = await fetch('/api/bulletin');
        const data = await response.json();
        setBulletins(data.bulletins || []);
      } catch (error) {
        console.error('Error fetching bulletins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBulletins();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading events...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bulletins.length > 0 ? (
          bulletins.map((bulletin) => (
            <div
              key={bulletin._id}
              className="p-4 border rounded-lg shadow-md bg-white cursor-pointer"
              onClick={() => setSelectedBulletin(bulletin)}
            >
              <h2 className="text-xl font-semibold">{bulletin.title}</h2>
              <p className="text-gray-600">{bulletin.description}</p>
              <p className="text-sm text-gray-500">📍 {bulletin.location}</p>
              <p className="text-sm text-gray-500">📅 {new Date(bulletin.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events found.</p>
        )}
      </div>
      {selectedBulletin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold">{selectedBulletin.title}</h2>
            <p className="text-gray-600 mt-2">{selectedBulletin.description}</p>
            <p className="text-sm text-gray-500 mt-2">📍 {selectedBulletin.location}</p>
            <p className="text-sm text-gray-500">📅 {new Date(selectedBulletin.date).toLocaleDateString()}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedBulletin(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
