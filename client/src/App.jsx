import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';
import Home from './pages/Home';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </NotesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
