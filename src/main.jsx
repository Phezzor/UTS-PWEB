import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import DetailSurah from './components/DetailSurah.jsx'
import Loby from './components/Loby.jsx';
import Juzs from './components/Juzs.jsx';
import Home from './components/Home.jsx';
import JuzsList from './components/JuzsList.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
            <Routes>
                <Route path="/" element={<Loby />} />
                <Route path="/juz" element={<JuzsList />} />
                <Route path="/juz/:id" element={<Juzs />} />
                <Route path="/home" element = {<Home />} />
                <Route path="/surah/:surahId" element={<DetailSurah />} />
            </Routes>
        </Router>
    
   
  </StrictMode>,
)
