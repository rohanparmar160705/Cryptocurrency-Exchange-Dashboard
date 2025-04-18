import React, { useState } from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./Search.css";

const { Option } = Select;

const Search = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSort = (value) => {
    onSort(value);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Input
          className="search-input"
          placeholder="Search Cryptocurrency"
          prefix={<SearchOutlined className="search-icon" />}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchTerm}
          allowClear
        />
        <Select
          className="sort-select"
          defaultValue="market_cap_desc"
          onChange={handleSort}
        >
          <Option value="market_cap_desc">Market Cap: High to Low</Option>
          <Option value="market_cap_asc">Market Cap: Low to High</Option>
          <Option value="price_desc">Price: High to Low</Option>
          <Option value="price_asc">Price: Low to High</Option>
          <Option value="volume_desc">Volume: High to Low</Option>
          <Option value="volume_asc">Volume: Low to High</Option>
        </Select>
      </div>
    </div>
  );
};

export default Search;
