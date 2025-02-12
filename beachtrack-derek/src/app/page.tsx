"use client"; 
import { useState } from 'react';
import "../styles/homepage.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState('recent');

  const getTabContent = () => {
    switch(activeTab) {
      case 'recent':
        return <div className="no-content-message">No recent searches</div>;
      case 'openRooms':
        return <div className="no-content-message"></div>;
      case 'events':
        return <div className="no-content-message">Log in to create/join events!</div>;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      
      <div className="content-wrapper">
        <div className="left-content">
          <div className="search-wrapper">
            <div className="search-bar">
              <button className="menu-button">☰</button>
              <input type="text" placeholder="Search by building, time, date" />
              <button className="search-button">🔍</button>
            </div>
          </div>

          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
            <button 
              className={`tab-button ${activeTab === 'openRooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('openRooms')}
            >
              Open Rooms
            </button>
            <button 
              className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
          </div>

          <div className="content-area">
            {getTabContent()}
          </div>
        </div>
        <div className="right-content">
          {/* Reserved space for map */}
        </div>
      </div>
    </div>
  );
}