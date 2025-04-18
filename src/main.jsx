// import "@ant-design/v5-patch-for-react-19";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";
// import "@ant-design/v5-patch-for-react-19";
// import "antd/dist/reset.css";
// import { store } from "./app/store.js";
// import { Provider } from "react-redux";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// // Create a custom theme
// const theme = extendTheme({
//   config: {
//     initialColorMode: "light",
//     useSystemColorMode: false,
//   },
// });

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Provider store={store}>
//         <ChakraProvider theme={theme}>
//           <App />
//         </ChakraProvider>
//       </Provider>
//     </BrowserRouter>
//   </StrictMode>
// );

import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import App from "./App.jsx";
import { store } from "./app/store.js";

// Create a custom theme
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      500: "#3182ce",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
