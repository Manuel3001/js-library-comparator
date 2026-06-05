import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import ComparePage from './ComparePage';
import DiscoveryPage from './DiscoveryPage';
export default function App() {
  return (
    <BrowserRouter>
    {/* a simple navigation bar for testing */}
        <nav>
            <Link to="/">Discovery</Link>
            <Link to="/compare">Compare</Link>
        </nav>

        {/* Define the routes */}
        <Routes>
            <Route path="/" element={<DiscoveryPage />} />
            <Route path="/compare" element={<ComparePage />} />
        </Routes>
    </BrowserRouter>
  );
}