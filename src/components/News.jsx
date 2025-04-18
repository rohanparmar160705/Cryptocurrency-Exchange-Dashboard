import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Select,
  Avatar,
  Button,
} from "antd";
import moment from "moment";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import "./News.css";
import { Link } from "react-router-dom";
import { useGetCryptosQuery } from "../services/cryptoApi";
import Loader from "./Loader";

const { Title: AntdTitle } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");
  const {
    data: cryptoNews,
    isFetching,
    error,
    refetch,
  } = useGetCryptoNewsQuery({
    newsCategory,
    count: simplified ? 10 : 100,
  });
  const { data: cryptoData } = useGetCryptosQuery(100);

  const handleCategoryChange = (value) => {
    setNewsCategory(value);
    refetch();
  };

  if (isFetching) return <Loader />;

  if (error) {
    return (
      <Alert
        message="Error Loading News"
        description={
          <>
            <p>{error?.data?.message || "Failed to load crypto news"}</p>
            <Button
              onClick={refetch}
              type="primary"
              style={{ marginTop: "10px" }}
            >
              Try Again
            </Button>
          </>
        }
        type="error"
        showIcon
      />
    );
  }

  const newsArticles = Array.isArray(cryptoNews) ? cryptoNews : [];

  if (!newsArticles.length) {
    return (
      <Alert
        message="No News Available"
        description="Try changing the category or check back later."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div className="news-container">
      {!simplified && (
        <div className="news-header">
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={handleCategoryChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            defaultValue="Cryptocurrency"
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptoData?.data?.coins?.map((currency) => (
              <Option value={currency.name} key={currency.uuid}>
                {currency.name}
              </Option>
            ))}
          </Select>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {newsArticles.slice(0, simplified ? 10 : 100).map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card hoverable className="news-card">
              <Link
                to={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
              >
                <div className="news-image-container">
                  <img
                    src={
                      news?.image?.thumbnail?.contentUrl ||
                      "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"
                    }
                    alt={news.name}
                    className="news-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News";
                    }}
                  />
                </div>
                <div className="news-info">
                  <span className="news-tag">{newsCategory}</span>
                  <AntdTitle level={4} className="news-title">
                    {news.name}
                  </AntdTitle>
                  <div className="news-meta">
                    <div className="news-date">
                      {moment(news.datePublished).startOf("ss").fromNow()}
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default News;
