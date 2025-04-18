/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Typography,
  Avatar,
  Input,
  Spin,
  Alert,
  Tag,
  Tooltip,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Skeleton,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  GlobalOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import millify from "millify";
import axios from "axios";
import "./Exchanges.css";
import { useGetExchangesQuery } from "../services/cryptoApi";

const { Title, Text } = Typography;

// Create separate components for different sections
const StatsCards = ({ stats }) => (
  <Row gutter={16} style={{ marginBottom: "24px" }}>
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title="Total Exchanges"
          value={stats.totalExchanges}
          prefix={<GlobalOutlined />}
        />
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title="Average Trust Score"
          value={stats.averageTrustScore}
          prefix={<SafetyCertificateOutlined />}
          suffix="/10"
        />
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title="Verified Exchanges"
          value={stats.verifiedExchanges}
          prefix={<UserOutlined />}
        />
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title="Total Trust Score"
          value={stats.totalTrustScore}
          prefix={<RiseOutlined />}
        />
      </Card>
    </Col>
  </Row>
);

const SearchInput = ({ onSearch }) => (
  <Input
    prefix={<SearchOutlined />}
    placeholder="Search exchanges..."
    onChange={onSearch}
    style={{ maxWidth: "400px", marginBottom: "20px" }}
    allowClear
    className="custom-search-input"
  />
);

const ExchangeDetails = ({ exchange }) => (
  <Row gutter={[24, 24]}>
    <Col span={24}>
      <Card title="Exchange Details" bordered={false}>
        <p>
          <strong>Description:</strong>{" "}
          {exchange.description || "No description available"}
        </p>
        <p>
          <strong>Country:</strong> {exchange.country || "Not specified"}
        </p>
        <p>
          <strong>Year Established:</strong>{" "}
          {exchange.year_established || "Not specified"}
        </p>
      </Card>
    </Col>
  </Row>
);

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: exchangesList, isFetching } = useGetExchangesQuery();
  const [filteredData, setFilteredData] = useState([]);

  // Fetch exchanges data
  const fetchExchanges = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        method: "GET",
        url: "https://coingecko.p.rapidapi.com/exchanges",
        headers: {
          "x-rapidapi-key":
            "6624af6c37mshbb21edec74d60d1p137a77jsn1c1f2372c615",
          "x-rapidapi-host": "coingecko.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      setExchanges(response.data);
    } catch (err) {
      console.error("Error fetching exchanges:", err);
      setError(err.message || "Failed to fetch exchanges data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchExchanges();
  }, []);

  // Filter exchanges based on search term
  const filteredExchanges = useMemo(
    () =>
      exchanges?.filter((exchange) =>
        exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [exchanges, searchTerm]
  );

  // Calculate statistics
  const stats = useMemo(
    () => ({
      totalExchanges: filteredExchanges.length,
      totalTrustScore: filteredExchanges.reduce(
        (acc, exchange) => acc + (exchange.trust_score || 0),
        0
      ),
      averageTrustScore:
        filteredExchanges.length > 0
          ? (
              filteredExchanges.reduce(
                (acc, exchange) => acc + (exchange.trust_score || 0),
                0
              ) / filteredExchanges.length
            ).toFixed(1)
          : 0,
      verifiedExchanges: filteredExchanges.filter(
        (exchange) => exchange.has_trading_incentive
      ).length,
    }),
    [filteredExchanges]
  );

  // Table columns configuration
  const columns = [
    {
      title: "Exchange",
      dataIndex: "name",
      key: "name",
      render: (text, exchange) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text strong>{exchange.trust_score_rank}.</Text>
          <Avatar src={exchange.image} alt={exchange.name} />
          <Text strong>{exchange.name}</Text>
          {exchange.has_trading_incentive && (
            <Tooltip title="Verified Exchange">
              <Tag color="blue">Verified</Tag>
            </Tooltip>
          )}
        </div>
      ),
      sorter: (a, b) => a.trust_score_rank - b.trust_score_rank,
      defaultSortOrder: "ascend",
    },
    {
      title: "Trust Score",
      dataIndex: "trust_score",
      key: "trust_score",
      render: (score) => (
        <Tag
          className={
            score >= 8
              ? "trust-score-high"
              : score >= 6
              ? "trust-score-medium"
              : "trust-score-low"
          }
        >
          {score}/10
        </Tag>
      ),
      sorter: (a, b) => a.trust_score - b.trust_score,
    },
    {
      title: "24h Trade Volume (BTC)",
      dataIndex: "trade_volume_24h_btc",
      key: "volume",
      render: (volume) => millify(volume || 0),
      sorter: (a, b) => a.trade_volume_24h_btc - b.trade_volume_24h_btc,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "Not specified",
      filters: Array.from(
        new Set(
          filteredExchanges.map((exchange) => exchange.country).filter(Boolean)
        )
      ).map((country) => ({ text: country, value: country })),
      onFilter: (value, record) => record.country === value,
    },
    {
      title: "Year Established",
      dataIndex: "year_established",
      key: "year",
      render: (year) => year || "Not specified",
      sorter: (a, b) => (a.year_established || 0) - (b.year_established || 0),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Error Loading Exchanges"
        description={
          <>
            <Text>{error}</Text>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchExchanges}
              type="primary"
              style={{ marginTop: "10px" }}
            >
              Retry
            </Button>
          </>
        }
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="exchange-container">
      <Title level={2} style={{ marginBottom: "24px", color: "white" }}>
        Cryptocurrency Exchanges
      </Title>

      <Suspense fallback={<Skeleton active />}>
        <StatsCards stats={stats} />
      </Suspense>

      <Suspense fallback={<Skeleton.Input active />}>
        <SearchInput onSearch={(e) => setSearchTerm(e.target.value)} />
      </Suspense>

      <Suspense
        fallback={
          <div style={{ padding: "20px" }}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        }
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredExchanges}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (exchange) => (
              <div style={{ padding: "20px" }}>
                <Suspense fallback={<Skeleton active />}>
                  <ExchangeDetails exchange={exchange} />
                </Suspense>
              </div>
            ),
          }}
        />
      </Suspense>

      {/* Disclaimer */}
      {/* <Alert
          message="Disclaimer"
        description="Data is provided by CoinGecko API. Trust scores and trading volumes are subject to change."
        type="info"
          showIcon
          style={{ marginTop: "24px" }}
      /> */}
    </div>
  );
};

export default Exchanges;
