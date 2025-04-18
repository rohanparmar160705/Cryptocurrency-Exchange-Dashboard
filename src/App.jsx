import React from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Typography, Space } from 'antd'

import {
  Navbar,
  Exchanges,
  HomePage,
  Cryptocurrencies,
  CryptoDetails,
  News,
} from "./components";
import './App.css'

const App = () => {
  return (
    <div className="App">
      <div className="Navbar">
        <Navbar />
      </div>
      <div className="Main">
        <Layout>
          <div className="Routes">
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route path="/crypto/:coinId" element={<CryptoDetails/>} />
              <Route path="/news" element={<News />} />
            </Routes>
          </div>
        </Layout>
      </div>
      <div className="Footer">
        <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>
          CryptoVerse <br /> All rights reserved by Rohan Parmar ©
        </Typography.Title>
        <Space>
          <Link className="footer-links" to="/">Home</Link>
          <Link className="footer-links" to="/exchanges">Exchanges</Link>
          <Link className="footer-links" to="/news">News</Link>
          <Link className="footer-links" to="/cryptocurrencies">Cryptocurrencies</Link>
        </Space>
      </div>
    </div>
  );
}

export default App
