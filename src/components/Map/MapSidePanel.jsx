import React from 'react';
import './MapSidePanel.css'; // This will use the updated CSS

const MapSidePanel = () => {
  return (
    <div className="map-side-panel">
      <h2>সরাসরি প্রকল্পের মানচিত্র</h2>
      <p>শহর জুড়ে বিভিন্ন সংস্থার চলমান এবং পরিকল্পিত কাজগুলি দেখুন।</p>
      
     
      <ul className="map-legend">
        <li><span className="color-dot planned"></span>পরিকল্পিত (Planned)</li>
        <li><span className="color-dot ongoing"></span>চলমান (Ongoing)</li>
        <li><span className="color-dot completed"></span>সম্পন্ন (Completed)</li>
      </ul>

      <div className="map-panel-footer">
        <p>যেকোনো চিহ্নিত রাস্তায় ক্লিক করে প্রকল্পের বিস্তারিত তথ্য দেখুন।</p>
      </div>
    </div>
  );
};

export default MapSidePanel;