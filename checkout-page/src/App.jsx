import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        {/* Fallback to checkout if root is accessed with params */}
        <Route path="/" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}