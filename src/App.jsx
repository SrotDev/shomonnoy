import './App.css';
import MapView from './components/Map/map';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <div className="z-20">
        <Navbar state="authority_logged_in"/>
      </div>
      

      <div className="map-wrapper">
        <div style={{ width: '100%', height: '800px' }}>
          <MapView center={[23.7806, 90.4070]} zoom={13} />
          
        </div>
      </div>

      <footer>
        <h3>Additional Content</h3>
        
      </footer>
    </div>
  );
}

export default App;
