import React, { useState } from 'react';
import { useHistory, Route, Switch } from 'react-router-dom';
import {
  ChakraProvider,
  extendTheme,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorMode,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import {
  FaMoon,
  FaSearch,
  FaUserFriends,
  FaCalendarAlt,
  FaChartLine,
  FaGavel,
  FaComments,
  FaBars,
  FaHome,
  FaFileAlt,
  FaBalanceScale,
  FaHistory,
  FaPowerOff,
  FaCog,
} from 'react-icons/fa';

import CaseAssignment from './case-assignment-component';
import CourtCalendar from './court-calendar';

// Custom theme for typography
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
});

// StatCard component
const StatCard = ({ icon, label, value, change }) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      textAlign="left"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Icon as={icon} boxSize={6} color="blue.500" mb={2} />
      <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
      <Text fontSize="2xl" fontWeight="bold">{value}</Text>
      <Text fontSize="xs" color={change >= 0 ? "green.500" : "red.500"}>
        {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
      </Text>
    </Box>
  );
};

// Sidebar component
const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Button leftIcon={<FaHome />} onClick={() => onNavigate('/judicial-dashboard')}>Home</Button>
              <Button leftIcon={<FaGavel />} onClick={() => onNavigate('/case-assignment')}>Case Assignment</Button>
              <Button leftIcon={<FaCalendarAlt />} onClick={() => onNavigate('/court-calendar')}>Court Calendar</Button>
              <Button leftIcon={<FaUserFriends />} onClick={() => onNavigate('/defendant-records')}>Defendant Records</Button>
              <Button leftIcon={<FaFileAlt />} onClick={() => onNavigate('/document-management')}>Document Management</Button>
              <Button leftIcon={<FaBalanceScale />} onClick={() => onNavigate('/legal-research')}>Legal Research</Button>
              <Button leftIcon={<FaHistory />} onClick={() => onNavigate('/case-history')}>Case History</Button>
              <Button leftIcon={<FaCog />} onClick={() => onNavigate('/settings')}>Settings</Button>
              <Button leftIcon={<FaPowerOff />} onClick={() => onNavigate('/')}>Logout</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

// FeatureCard component
const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
      onClick={onClick}
    >
      <Icon as={icon} boxSize={8} color="blue.500" mb={4} />
      <Heading as="h3" size="md" mb={2}>{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  );
};

// Dashboard Content
const DashboardContent = ({ onNavigate }) => {
  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Heading as="h2" size="xl" color="blue.600">Welcome, Judge Smith</Heading>
        <Avatar name="Judge Smith" src="https://bit.ly/sage-adebayo" />
      </Flex>
      
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.300" />
        </InputLeftElement>
        <Input type="text" placeholder="Search cases, defendants, or documents..." focusBorderColor="blue.500" />
      </InputGroup>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard icon={FaCalendarAlt} label="Total Past Cases" value="5,678" change={2.5} />
        <StatCard icon={FaUserFriends} label="Active Cases" value="42" change={-1.8} />
        <StatCard icon={FaChartLine} label="Case Clearance Rate" value="95%" change={0.7} />
        <StatCard icon={FaGavel} label="Avg. Case Duration" value="45 days" change={-3.2} />
      </SimpleGrid>

      <Box>
        <Heading as="h3" size="lg" mb={4}>Judicial Functions</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <FeatureCard
            icon={FaGavel}
            title="Case Assignment"
            description="View and manage case assignments"
            onClick={() => onNavigate('/case-assignment')}
          />
          <FeatureCard
            icon={FaCalendarAlt}
            title="Court Calendar"
            description="Access and update your court schedule"
            onClick={() => onNavigate('/court-calendar')}
          />
          <FeatureCard
            icon={FaUserFriends}
            title="Defendant Records"
            description="Review defendant histories and case details"
            onClick={() => onNavigate('/defendant-records')}
          />
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

// Main Dashboard Component
export default function JudicialDashboard() {
  const history = useHistory();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  const [isOpen, setIsOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsOpen(true);
  };

  const handleSidebarClose = () => {
    setIsOpen(false);
  };

  const handleNavigate = (path) => {
    history.push(path);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box bg={bgColor} color={textColor} minH="100vh">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1rem"
          bg="white"
          boxShadow="md"
        >
          <Heading as="h1" size="lg" color="blue.600">Judicial Dashboard</Heading>
          <HStack spacing={4}>
            <Button onClick={toggleColorMode} variant="ghost">
              <Icon as={FaMoon} />
            </Button>
            <Button onClick={handleSidebarOpen} variant="ghost">
              <Icon as={FaBars} boxSize={6} />
            </Button>
          </HStack>
        </Flex>

        <Sidebar isOpen={isOpen} onClose={handleSidebarClose} onNavigate={handleNavigate} />

        <Container maxW="container.xl" py={8}>
          <Switch>
            <Route exact path="/judicial-login">
              <DashboardContent onNavigate={handleNavigate} />
            </Route>
            <Route path="/case-assignment">
              <CaseAssignment />
            </Route>
            <Route path="/court-calendar">
              <CourtCalendar />
            </Route>
            <Route path="/defendant-records">
              <CourtCalendar />
            </Route>
          </Switch>
        </Container>

        <Button
          position="fixed"
          bottom="4"
          right="4"
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          boxShadow="lg"
        >
          <Icon as={FaComments} />
        </Button>
      </Box>
      <Box as="footer" textAlign="center" py={4} borderTop="1px" borderColor="gray.200">
        © 2024 Judicial System. All rights reserved.
      </Box>
    </ChakraProvider>
  );
}
