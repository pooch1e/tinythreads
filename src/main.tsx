import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import WardrobePage from './pages/WardrobePage';
import BuildOutfitPage from './pages/BuildOutfitPage';
import OutfitsPage from './pages/OutfitsPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/wardrobe" replace />} />
          <Route path="wardrobe" element={<WardrobePage />} />
          <Route path="build" element={<BuildOutfitPage />} />
          <Route path="outfits" element={<OutfitsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
