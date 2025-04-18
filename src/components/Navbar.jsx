// import React from "react";
// import { Button, Menu, Typography, Avatar, Space } from "antd";
// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeOutlined,
//   MoneyCollectOutlined,
//   BulbOutlined,
//   FundOutlined,
//   MenuOutlined,
// } from "@ant-design/icons";

// import "../App.css";
// import icon from "../images/logo.png";

// const Navbar = () => {
//   const location = useLocation();

//   const menuItems = [
//     {
//       key: "/",
//       icon: <HomeOutlined />,
//       label: "Home",
//     },
//     {
//       key: "/cryptocurrencies",
//       icon: <FundOutlined />,
//       label: "Cryptocurrencies",
//     },
//     {
//       key: "/exchanges",
//       icon: <MoneyCollectOutlined />,
//       label: "Exchanges",
//     },
//     {
//       key: "/news",
//       icon: <BulbOutlined />,
//       label: "News",
//     },
//   ];

//   return (
//     <div className="Nav-container">
//       <div className="Logo-container">
//         <Space size={16} wrap theme="dark">
//           <Avatar src={icon} size="large" />

//           <Typography.Title level={2} className="Logo">
//             <Link to="/">Cryptoverse</Link>
//           </Typography.Title>
//           {/* <Button className="Menu-control-container"></Button> */}
//         </Space>
//       </div>

//       {/* Use new 'items' prop with defined keys */}
//       <Menu
//         theme="dark"
//         mode="horizontal"
//         // mode="vertical"
//         // mode="inline"
//         selectedKeys={[location.pathname]}
//         items={menuItems.map((item) => ({
//           ...item,
//           label: (
//             <Link
//               to={item.key}
//               className={`nav-link ${
//                 location.pathname === item.key ? "active-link" : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           ),
//         }))}
//       />
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import { Menu, Typography, Avatar, Space, Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  FundOutlined,
} from "@ant-design/icons";

import "../App.css";
import icon from "../images/logo.png";

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/cryptocurrencies",
      icon: <FundOutlined />,
      label: "Cryptocurrencies",
    },
    {
      key: "/exchanges",
      icon: <MoneyCollectOutlined />,
      label: "Exchanges",
    },
    {
      key: "/news",
      icon: <BulbOutlined />,
      label: "News",
    },
  ];

  return (
    <div className="navbar-wrapper">
      <Row className="nav-container" align="middle">
        <Col className="logo-menu-item">
          <Link to="/">
            <Space size={16}>
              <Avatar src={icon} size="large" className="logo-image" />
              <Typography.Title
                level={2}
                className="logo"
                // style={{ margin: 0, color: "white" }}
              >
                Cryptoverse
              </Typography.Title>
            </Space>
          </Link>
        </Col>

        <Col flex="auto">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="nav-menu"
            // style={{ justifyContent: "flex-end", border: "none" }}
            items={menuItems.map((item) => ({
              ...item,
              label: (
                <Link
                  to={item.key}
                  className={`nav-link ${
                    location.pathname === item.key ? "active-link" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ),
            }))}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
