import {Routes, Route, Link} from 'react-router-dom';
import ComparePage from './pages/ComparePage';
import DiscoveryPage from './pages/DiscoveryPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <>
    {/* a simple navigation bar for testing */}
        <nav style={{ display: 'flex', gap: '20px', padding: '10px', backgroundColor: '#ff00ff'}}>
            <Link style={{ color: '#ffffff', textDecoration: 'none' }} to="/discovery">Discovery</Link>
            <Link style={{ color: '#ffffff', textDecoration: 'none' }} to="/compare">Compare</Link>
            <Link style={{ color: '#ffffff', textDecoration: 'none' }} to="/">Home</Link>
        </nav>
          <h1>JS Library Comparator</h1>
        {/* Define the routes */}
        <Routes>
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
        </>  );
}