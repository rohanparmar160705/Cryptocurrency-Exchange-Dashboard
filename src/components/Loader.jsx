import React from "react";
import { Flex, Spinner } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Flex
      justify="center"
      align="center"
      height="100vh"
      width="100%"
      position="fixed"
      top={0}
      left={0}
      bg="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
    >
      <Spinner
        thickness="5px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
    </Flex>
  );
};

export default Loader;
