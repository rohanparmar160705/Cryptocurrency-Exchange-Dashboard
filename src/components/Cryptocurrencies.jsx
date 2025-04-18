/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import millify from "millify";
import { Link, useLocation } from "react-router-dom";
import { Card, Row, Col, Input, Typography, Spin } from "antd";
import { useGetCryptosQuery } from "../services/cryptoApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Search from "./Search";
import "./Cryptocurrencies.css";
import { debounce } from "lodash";
import PropTypes from "prop-types";

const { Title } = Typography;

class ErrorBoundary extends React.Component {
  // ... error boundary implementation
}

const Cryptocurrencies = ({ simplified }) => {
  const location = useLocation();
  const isCryptocurrenciesPage = location.pathname === "/cryptocurrencies";
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching, error } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState(cryptosList?.data?.coins);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_desc");

  useEffect(() => {
    if (cryptosList?.data?.coins) {
      setCryptos(cryptosList.data.coins);
    }
  }, [cryptosList]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  const handleSort = (value) => {
    setSortBy(value);
    const sortedCryptos = [...cryptos].sort((a, b) => {
      switch (value) {
        case "market_cap_desc":
          return b.marketCap - a.marketCap;
        case "market_cap_asc":
          return a.marketCap - b.marketCap;
        case "price_desc":
          return b.price - a.price;
        case "price_asc":
          return a.price - b.price;
        case "volume_desc":
          return b["24hVolume"] - a["24hVolume"];
        case "volume_asc":
          return a["24hVolume"] - b["24hVolume"];
        default:
          return 0;
      }
    });
    setCryptos(sortedCryptos);
  };

  const filteredCryptos = useMemo(() => {
    if (!cryptosList?.data?.coins) return [];
    let result = [...cryptosList.data.coins];

    if (searchTerm) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case "market_cap_desc":
          return b.marketCap - a.marketCap;
        case "market_cap_asc":
          return a.marketCap - b.marketCap;
        case "price_desc":
          return b.price - a.price;
        case "price_asc":
          return a.price - b.price;
        case "volume_desc":
          return b["24hVolume"] - a["24hVolume"];
        case "volume_asc":
          return a["24hVolume"] - b["24hVolume"];
        default:
          return 0;
      }
    });
  }, [cryptosList, searchTerm, sortBy]);

  const chartHeight = useMemo(() => {
    return window.innerWidth < 768 ? 80 : 100;
  }, []);

  if (error) return <div>Error loading cryptocurrencies</div>;

  if (isFetching) {
    return (
      <div
        className="cryptocurrencies-page"
        style={{ marginTop: !simplified ? "12rem" : "1rem" }}
      >
        {!simplified && (
          <div className="search-header">
            <Title level={2} className="heading">
              All Cryptocurrencies
            </Title>
            <Search
              className="search-crypto"
              onSearch={handleSearch}
              onSort={handleSort}
            />
          </div>
        )}
        <div className="loading-container">
          <Spin size="large" className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="cryptocurrencies-page">
      {!simplified && (
        <div
          className="search-header"
        >
          <Title level={2} className="heading">
            All Cryptocurrencies
          </Title>
          <Search onSearch={handleSearch} onSort={handleSort} />
        </div>
      )}
      <div style={{ marginTop: "320px" }}>
        <Row
          gutter={[32, 32]}
          className={`crypto-card-container ${
            isCryptocurrenciesPage ? "cryptocurrencies-page" : ""
          }`} 
        >
          {filteredCryptos?.map((currency) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              className="crypto-card"
              key={currency.uuid}
            >
              <Link to={`/crypto/${currency.uuid}`}>
                <Card
                  title={`${currency.rank}. ${currency.name}`}
                  extra={
                    <img
                      className="crypto-image"
                      src={currency.iconUrl}
                      alt={`${currency.name} logo`}
                      aria-label={`${currency.name} cryptocurrency`}
                    />
                  }
                  hoverable
                >
                  <div className="price-chart">
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <LineChart
                        data={
                          currency.sparkline?.map((price, index) => ({
                            price,
                            time: index,
                          })) || []
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={["auto", "auto"]} hide />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="custom-tooltip">
                                  <p className="tooltip-label">Price</p>
                                  <p className="tooltip-value">
                                    ${Number(payload[0].value).toFixed(2)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={currency.change >= 0 ? "#38a169" : "#e53e3e"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="crypto-details">
                    <p className="crypto-price">
                      Price: ${millify(currency.price || 0)}
                    </p>
                    <p className="crypto-market-cap">
                      Market Cap: ${millify(currency.marketCap || 0)}
                    </p>
                    <div className="price-changes">
                      <p
                        className={`crypto-change ${
                          currency.change >= 0 ? "positive" : "negative"
                        }`}
                      >
                        24h Change: {currency.change || 0}%
                      </p>
                      <p
                        className={`crypto-change ${
                          currency.change1h >= 0 ? "positive" : "negative"
                        }`}
                      >
                        1h Change: {currency.change1h || 0}%
                      </p>
                      <p
                        className={`crypto-change ${
                          currency.change7d >= 0 ? "positive" : "negative"
                        }`}
                      >
                        7d Change: {currency.change7d || 0}%
                      </p>
                    </div>
                    <p className="crypto-volume">
                      24h Volume: ${millify(currency["24hVolume"] || 0)}
                    </p>
                    <p className="crypto-rank">
                      Rank: {currency.rank || "N/A"}
                    </p>
                    <p className="crypto-all-time-high">
                      All Time High: $
                      {millify(
                        currency.allTimeHigh?.price || currency.ath || 0
                      )}
                    </p>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

Cryptocurrencies.propTypes = {
  simplified: PropTypes.bool,
};

export default Cryptocurrencies;
