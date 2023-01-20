import { useState } from "react";
import { Text, VStack, Container, Link } from "@chakra-ui/react";
import { Header } from "components/Header";
import { AuthSparkleImage } from "@cartridge/ui/components/icons/auth";
import { motion } from "framer-motion";
import Content from "components/Content";

const Continue = () => {
  return (
    <Content
      w="full"
      h="100%"
      position="fixed"
      top="0"
      left="0"
      zIndex="overlay"
      bgColor="gray.400"
    >
      <Header muted />
      <VStack boxSize="full" pt="120px" color="gray.200" spacing="36px">
        <AuthSparkleImage />
        <VStack spacing="18px">
          <Text fontSize="17px" fontWeight="bold" color="inherit">
            Continue Signup...
          </Text>
          <Text fontSize="12px" color="inherit">
            Please continue with signup in the new window
          </Text>
        </VStack>
        <Link variant="outline" fontSize="11px">
          Read More
        </Link>
      </VStack>
    </Content>
  );
};

export default Continue;
