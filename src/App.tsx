import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ScanPage } from './pages/ScanPage';
import { LandingPage } from './pages/LandingPage';
import { OeuvresPage } from './pages/OeuvresPage';
import OeuvreDetailPage from './pages/OeuvreDetailPage';
// import { SmoothCursor } from './components/ui/smooth-cursor';

function App() {
  return (
    <BrowserRouter>
      {/* <SmoothCursor  /> */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/oeuvres" element={<OeuvresPage />} />
            <Route path="/oeuvres/:id" element={<OeuvreDetailPage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
