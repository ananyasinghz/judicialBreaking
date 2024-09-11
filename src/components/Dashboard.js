import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  useMediaQuery,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
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
  FaTasks,
} from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useInView } from 'react-intersection-observer';

// Import separate components (assuming they exist)
import BailCalculator from './BailCalculator';
import BondAI from './BondAI';
import CaseHistory from './CaseHistory';
import EligibilityChecker from './EligibilityChecker';
import FAQ from './FAQ';
import ContactUs from './ContactUs';
import CompareCases from './CompareCases';
import GenerateBailApplication from './GenerateBailApplication';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend);

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
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1, opacity: 1 });
    }
  }, [controls, inView]);

  return (
    <MotionBox
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={controls}
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
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1, opacity: 1 });
    }
  }, [controls, inView]);

  return (
    <MotionBox
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={controls}
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

  const menuItems = [
    { name: 'Home', icon: FaHome, view: 'home' },
    { name: 'Eligibility Assessment', icon: FaBalanceScale, view: 'eligibility' },
    { name: 'Bail Calculator', icon: FaCalculator, view: 'calculator' },
    { name: 'Case History', icon: FaHistory, view: 'casehistory' },
    { name: 'Bond AI Assistant', icon: FaRobot, view: 'bondai' },
    { name: 'Compare Cases', icon: FaExchangeAlt, view: 'comparecases' },
    { name: 'Generate Bail Application', icon: FaFileAlt, view: 'generatebail' },
    { name: 'Task Management', icon: FaTasks, view: 'tasks' },
    { name: 'Insights Dashboard', icon: FaChartLine, view: 'insights' },
    { name: 'FAQ', icon: FaQuestionCircle, view: 'faq' },
    { name: 'Contact Us', icon: FaEnvelope, view: 'contact' },
  ];

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
            {menuItems.map((item) => (
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

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Case Files', status: 'In Progress', dueDate: '2024-09-15' },
    { id: 2, title: 'Client Meeting', status: 'Pending', dueDate: '2024-09-20' },
    { id: 3, title: 'File Bail Application', status: 'Completed', dueDate: '2024-09-10' },
  ]);

  const addTask = (newTask) => {
    setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const taskBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Box>
      <Heading size="lg" mb={6}>Task Management</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {['Pending', 'In Progress', 'Completed'].map(status => (
          <Box key={status} bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>{status}</Heading>
            <VStack align="stretch" spacing={4}>
              {tasks.filter(task => task.status === status).map(task => (
                <Box key={task.id} p={3} bg={taskBg} borderRadius="md">
                  <Text fontWeight="bold">{task.title}</Text>
                  <Text fontSize="sm">Due: {task.dueDate}</Text>
                  <Select
                    mt={2}
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </Box>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      <Button mt={6} onClick={() => {/* Open modal to add new task */}}>Add New Task</Button>
    </Box>
  );
};

const InsightsDashboard = () => {
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Cases Filed',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const barChartData = {
    labels: ['Robbery', 'Assault', 'Fraud', 'DUI', 'Drug Possession'],
    datasets: [
      {
        label: 'Number of Cases',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box>
      <Heading size="lg" mb={6}>Insights Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Cases Filed Over Time</Heading>
          <Line data={lineChartData} />
        </Box>
        <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Case Types Distribution</Heading>
          <Bar data={barChartData} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('home');
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

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
              <Flex justify="space-between" align="center" wrap="wrap">
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

              <Grid templateColumns={isLargerThan768 ? "repeat(4, 1fr)" : "repeat(2, 1fr)"} gap={6}>
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
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Flex align="center" justify="space-between" bg={activityBg} p={4} borderRadius="lg" boxShadow="md">
                        <HStack>
                          <Badge colorScheme={activity.type} p={2} borderRadius="md">{activity.type}</Badge>
                          <Text fontWeight="medium">{activity.title}</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">{activity.time}</Text>
                      </Flex>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>

              <Box>
                <Heading as="h3" size="lg" mb={4}>Upcoming Deadlines</Heading>
                <Accordion allowMultiple>
                  {[
                    { title: "File Motion for Case #1234", date: "2024-09-15", urgency: "High" },
                    { title: "Client Meeting for Case #5678", date: "2024-09-18", urgency: "Medium" },
                    { title: "Submit Bail Application for Case #9101", date: "2024-09-20", urgency: "Low" },
                  ].map((deadline, index) => (
                    <AccordionItem key={index}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">{deadline.title}</Text>
                            <Text fontSize="sm" color="gray.500">Due: {deadline.date}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Text>Urgency: {deadline.urgency}</Text>
                        <Progress mt={2} value={(new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24)} max={7} colorScheme={deadline.urgency === "High" ? "red" : deadline.urgency === "Medium" ? "yellow" : "green"} />
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
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
      case 'tasks':
        return <TaskManagement />;
      case 'insights':
        return <InsightsDashboard />;
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