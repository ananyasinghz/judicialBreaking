import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCube, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cube';
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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  useToast,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
} from '@chakra-ui/react';
import { 
  FaSun, 
  FaMoon, 
  FaHome, 
  FaCalculator, 
  FaHistory, 
  FaRobot, 
  FaQuestionCircle, 
  FaEnvelope,
  FaBars,
  FaChartLine,
  FaUserFriends,
  FaCalendarAlt,
  FaBell,
  FaSearch,
  FaFileAlt,
  FaBalanceScale,
  FaExchangeAlt,
} from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';

// Import separate components
import BailCalculator from './BailCalculator';
import BondAI from './BondAI';
import CaseHistory from './CaseHistory';
import EligibilityChecker from './EligibilityChecker';
import FAQ from './FAQ';
import ContactUs from './ContactUs';
import CompareCases from './CompareCases';
import GenerateBailApplication from './GenerateBailApplication';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'full',
      },
    },
  },
});

const MotionBox = motion(Box);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatCard = ({ icon, label, value, change }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      bg={cardBg}
      p={6}
      borderRadius="2xl"
      boxShadow="xl"
      transition={{ duration: 0.3 }}
    >
      <Stat>
        <Flex align="center" mb={3}>
          <Icon as={icon} boxSize={8} color="blue.500" mr={3} />
          <StatLabel fontSize="xl" fontWeight="semibold" color={textColor}>
            {label}
          </StatLabel>
        </Flex>
        <StatNumber fontSize="3xl" fontWeight="bold">
          {value}
        </StatNumber>
        <StatHelpText>
          <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
          {Math.abs(change)}%
        </StatHelpText>
      </Stat>
    </MotionBox>
  );
};

const FeatureCard = ({ icon, title, description, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      bg={cardBg}
      p={6}
      borderRadius="2xl"
      boxShadow="xl"
      transition={{ duration: 0.3 }}
      onClick={onClick}
      cursor="pointer"
    >
      <VStack spacing={4} align="start">
        <Icon as={icon} boxSize={10} color="blue.500" />
        <Heading as="h3" size="md">{title}</Heading>
        <Text color={textColor}>{description}</Text>
      </VStack>
    </MotionBox>
  );
};

const GlassmorphicSidebar = ({ isOpen, onClose, setCurrentView }) => {
  const sidebarBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent
        bg={sidebarBg}
        backdropFilter="blur(10px)"
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {[
              { name: 'Home', icon: FaHome, view: 'home' },
              { name: 'Eligibility Assessment', icon: FaBalanceScale, view: 'eligibility' },
              { name: 'Bail Calculator', icon: FaCalculator, view: 'calculator' },
              { name: 'Case History', icon: FaHistory, view: 'casehistory' },
              { name: 'Bond AI Assistant', icon: FaRobot, view: 'bondai' },
              { name: 'Compare Cases', icon: FaExchangeAlt, view: 'comparecases' },
              { name: 'Generate Bail Application', icon: FaFileAlt, view: 'generatebail' },
              { name: 'FAQ', icon: FaQuestionCircle, view: 'faq' },
              { name: 'Contact Us', icon: FaEnvelope, view: 'contact' },
            ].map((item) => (
              <Button
                key={item.name}
                leftIcon={<Icon as={item.icon} />}
                onClick={() => {
                  setCurrentView(item.view);
                  onClose();
                }}
                variant="ghost"
                justifyContent="flex-start"
                color={textColor}
                _hover={{ bg: hoverBg }}
              >
                {item.name}
              </Button>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('home');
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerBg = useColorModeValue('white', 'gray.800');
  const activityBg = useColorModeValue('white', 'gray.700');

  const notifyUser = () => {
    toast({
      title: "New notification",
      description: "You have a new message from the Bond AI Assistant.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return (
          <MotionBox
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={8} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="xl" mb={4}>Welcome, Ayush Upadhyay</Heading>
                <AvatarGroup size="md" max={3}>
                  <Avatar name="John Doe" src="https://bit.ly/dan-abramov" />
                  <Avatar name="Jane Smith" src="https://bit.ly/kent-c-dodds" />
                  <Avatar name="Bob Johnson" src="https://bit.ly/ryan-florence" />
                </AvatarGroup>
              </Flex>
              
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input type="text" placeholder="Search cases, clients, or documents..." />
              </InputGroup>

              <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                <StatCard icon={FaUserFriends} label="Total Clients" value="1,234" change={5.4} />
                <StatCard icon={FaCalendarAlt} label="Active Cases" value="42" change={-2.3} />
                <StatCard icon={FaChartLine} label="Success Rate" value="87%" change={1.2} />
                <StatCard icon={FaCalculator} label="Avg. Bail Amount" value="Rs.25,000" change={3.7} />
              </Grid>

              <Box>
                <Heading as="h3" size="lg" mb={4}>Quick Actions</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <FeatureCard
                    icon={FaBalanceScale}
                    title="Eligibility Assessment"
                    description="Get instant AI-driven bail eligibility results"
                    onClick={() => setCurrentView('eligibility')}
                  />
                  <FeatureCard
                    icon={FaCalculator}
                    title="Bail Calculator"
                    description="Calculate bail amounts based on multiple factors"
                    onClick={() => setCurrentView('calculator')}
                  />
                  <FeatureCard
                    icon={FaRobot}
                    title="Bond AI Assistant"
                    description="Get AI-powered assistance for your case"
                    onClick={() => setCurrentView('bondai')}
                  />
                  <FeatureCard
                    icon={FaHistory}
                    title="Case History"
                    description="Access and analyze your case history"
                    onClick={() => setCurrentView('casehistory')}
                  />
                  <FeatureCard
                    icon={FaExchangeAlt}
                    title="Compare Cases"
                    description="Compare similar cases for better insights"
                    onClick={() => setCurrentView('comparecases')}
                  />
                  <FeatureCard
                    icon={FaFileAlt}
                    title="Generate Bail Application"
                    description="Quickly generate bail application documents"
                    onClick={() => setCurrentView('generatebail')}
                  />
                </SimpleGrid>
              </Box>

              <Box>
                <Heading as="h3" size="lg" mb={4}>Recent Activity</Heading>
                <VStack align="stretch" spacing={4}>
                  {[
                    { title: "New case added", time: "2 hours ago", type: "info" },
                    { title: "Bail amount updated", time: "5 hours ago", type: "warning" },
                    { title: "Client meeting scheduled", time: "1 day ago", type: "success" },
                  ].map((activity, index) => (
                    <Flex key={index} align="center" justify="space-between" bg={activityBg} p={4} borderRadius="lg" boxShadow="md">
                      <HStack>
                        <Badge colorScheme={activity.type} p={2} borderRadius="md">{activity.type}</Badge>
                        <Text fontWeight="medium">{activity.title}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">{activity.time}</Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </MotionBox>
        );
      case 'eligibility':
        return <EligibilityChecker />;
      case 'calculator':
        return <BailCalculator />;
      case 'casehistory':
        return <CaseHistory />;
      case 'bondai':
        return <BondAI />;
      case 'comparecases':
        return <CompareCases />;
      case 'generatebail':
        return <GenerateBailApplication />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Box>View not found</Box>;
    }
  };

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 10 },
  });

  return (
    <ChakraProvider theme={theme}>
      <animated.div style={springProps}>
        <Flex direction="column" minH="100vh" bg={bgColor} color={textColor}>
          <Flex as="header" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={headerBg} color={textColor} boxShadow="lg">
            <Flex align="center" mr={5}>
              <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                Breaking Bonds
              </Heading>
            </Flex>

            <HStack spacing={4}>
              <Tooltip label="Notifications">
                <Button onClick={notifyUser} variant="ghost">
                  <Icon as={FaBell} />
                </Button>
              </Tooltip>
              <Tooltip label="Toggle color mode">
                <Button onClick={toggleColorMode} variant="ghost">
                  <Icon as={colorMode === 'light' ? FaMoon : FaSun} />
                </Button>
              </Tooltip>
              <Tooltip label="Open menu">
                <Button onClick={onOpen} variant="ghost">
                  <Icon as={FaBars} />
                </Button>
              </Tooltip>
            </HStack>
          </Flex>

          <GlassmorphicSidebar isOpen={isOpen} onClose={onClose} setCurrentView={setCurrentView} />

          <Box flex={1} p={8} overflowY="auto">
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </Box>

          <Box as="footer" bg={headerBg} color={textColor} py={6} textAlign="center" boxShadow="0 -1px 6px rgba(0,0,0,0.1)">
            <VStack spacing={4}>
              <Text>&copy; 2024 Breaking Bonds. All rights reserved.</Text>
              <HStack justify="center" spacing={6}>
                <Link href="#" color="blue.500">Privacy Policy</Link>
                <Link href="#" color="blue.500">Terms of Service</Link>
                <Link href="#" color="blue.500">Contact Us</Link>
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </animated.div>
    </ChakraProvider>
  );
}