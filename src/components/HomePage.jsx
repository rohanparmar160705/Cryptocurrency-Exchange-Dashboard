import React, { Suspense, lazy } from "react";
import { Typography, Row, Col, Statistic, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useGetCryptosQuery } from "../services/cryptoApi";
import millify from "millify";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Lazy load components
const Cryptocurrencies = lazy(() => import("./Cryptocurrencies"));
const News = lazy(() => import("./News"));

// Create separate components for better code organization
const GlobalStats = ({ stats }) => (
  <Row className="stats-container">
    <Row className="stats-row">
      <Col span={8}>
        <Statistic
          title="Total Cryptocurrencies"
          value={stats.total}
          className="ant-statistic"
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Total Exchanges"
          value={millify(stats.totalExchanges)}
          className="ant-statistic"
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Total Market Cap"
          value={millify(stats.totalMarketCap)}
          className="ant-statistic"
        />
      </Col>
    </Row>
    <Row className="stats-row">
      <Col span={8}>
        <Statistic
          title="Total 24h Volume"
          value={millify(stats.total24hVolume)}
          className="ant-statistic"
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Total Markets"
          value={millify(stats.totalMarkets)}
          className="ant-statistic"
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Total Coins"
          value={millify(stats.totalCoins)}
          className="ant-statistic"
        />
      </Col>
    </Row>
  </Row>
);

const StatsSkeleton = () => (
  <Row className="stats-container">
    <Row className="stats-row">
      {[...Array(3)].map((_, i) => (
        <Col span={8} key={i}>
          <Skeleton active paragraph={{ rows: 1 }} />
        </Col>
      ))}
    </Row>
    <Row className="stats-row">
      {[...Array(3)].map((_, i) => (
        <Col span={8} key={i}>
          <Skeleton active paragraph={{ rows: 1 }} />
        </Col>
      ))}
    </Row>
  </Row>
);

const HomePage = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const globalStats = data?.data?.stats;

  return (
    <>
      <Title level={2} className="heading">
        Global Crypto Stats
      </Title>

      {isFetching ? <StatsSkeleton /> : <GlobalStats stats={globalStats} />}

      <div className="home-heading-container">
        <Title level={2} className="home-title" style={{ color: "white" }}>
          Top 10 Cryptocurrencies in the world
        </Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show More</Link>
        </Title>
      </div>

      <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
        <Cryptocurrencies simplified />
      </Suspense>

      <div className="home-heading-container">
        <Title level={2} className="home-title" style={{ color: "white" }}>
          Latest Crypto News
        </Title>
        <Title level={3} className="show-more">
          <Link to="/news">Show More</Link>
        </Title>
      </div>

      <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
        <News simplified />
      </Suspense>
    </>
  );
};

export default HomePage;
