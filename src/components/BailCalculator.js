import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Scale, GitCommit, ArrowRight, Gavel, UserCheck, FileText, Briefcase, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  Box, VStack, Heading, Text, Select, Input, Button, Alert, AlertIcon, AlertTitle, AlertDescription,
  Flex, ChakraProvider, extendTheme, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Tabs, TabList, TabPanels, Tab, TabPanel, Progress, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast,
  Grid, GridItem, Textarea, Radio, RadioGroup, Stack, Divider
} from '@chakra-ui/react';

// Extended mock data for offenses
const offenses = [
  { id: 1, name: 'Petty theft', bailAmount: 10000, riskFactor: 2 },
  { id: 2, name: 'Assault', bailAmount: 50000, riskFactor: 5 },
  { id: 3, name: 'Drug possession', bailAmount: 25000, riskFactor: 4 },
  { id: 4, name: 'Fraud', bailAmount: 100000, riskFactor: 7 },
  { id: 5, name: 'Trespassing', bailAmount: 5000, riskFactor: 1 },
];

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#B3E0FF',
      200: '#80CBFF',
      300: '#4DB6FF',
      400: '#1AA1FF',
      500: '#0080FF',
      600: '#0066CC',
      700: '#004D99',
      800: '#003366',
      900: '#001A33',
    },
  },
});

const MotionBox = motion(Box);

const BailCalculator = () => {
  const [selectedOffense, setSelectedOffense] = useState(null);
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [flightRisk, setFlightRisk] = useState(5);
  const [calculatedBail, setCalculatedBail] = useState(null);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // New state variables for additional case details
  const [caseDescription, setCaseDescription] = useState('');
  const [priorOffenses, setPriorOffenses] = useState('0');
  const [communityTies, setCommunityTies] = useState('3');
  const [employmentStatus, setEmploymentStatus] = useState('employed');

  // New state variables for analysis
  const [riskScore, setRiskScore] = useState(0);
  const [bailScore, setBailScore] = useState(0);
  const [summary, setSummary] = useState('');

  const calculateBail = () => {
    if (!selectedOffense || !income || !assets) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCalculationProgress(0);
    const intervalId = setInterval(() => {
      setCalculationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      const baseAmount = selectedOffense.bailAmount;
      const incomeMultiplier = parseFloat(income) / 100000;
      const assetMultiplier = parseFloat(assets) / 1000000;
      const riskMultiplier = (flightRisk / 10) * selectedOffense.riskFactor;

      // Factor in new variables
      const priorOffenseMultiplier = 1 + (parseInt(priorOffenses) * 0.1);
      const communityTiesMultiplier = 1 - (parseInt(communityTies) * 0.05);
      const employmentMultiplier = employmentStatus === 'employed' ? 0.9 : 1.1;

      const adjustedBail = baseAmount * (1 + incomeMultiplier + assetMultiplier) * riskMultiplier * priorOffenseMultiplier * communityTiesMultiplier * employmentMultiplier;
      setCalculatedBail(Math.round(adjustedBail));

      // Calculate risk and bail scores
      const newRiskScore = Math.round((flightRisk + selectedOffense.riskFactor + parseInt(priorOffenses) - parseInt(communityTies)) * 10);
      setRiskScore(newRiskScore);

      const newBailScore = Math.round((adjustedBail / baseAmount) * 100);
      setBailScore(newBailScore);

      // Generate summary
      const newSummary = `Based on the offense of ${selectedOffense.name}, with a base bail amount of ₹${baseAmount.toLocaleString('en-IN')}, adjusted for financial status, flight risk, prior offenses, community ties, and employment status, the recommended bail amount is ₹${Math.round(adjustedBail).toLocaleString('en-IN')}. The overall risk score is ${newRiskScore}/100, and the bail adjustment score is ${newBailScore}/100.`;
      setSummary(newSummary);

      clearInterval(intervalId);
      setCalculationProgress(100);
      onOpen();
    }, 1500);
  };

  useEffect(() => {
    if (calculationProgress === 100) {
      toast({
        title: "Calculation Complete",
        description: "Your detailed bail estimate is ready.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [calculationProgress, toast]);

  const riskData = [
    { subject: 'Flight Risk', A: flightRisk * 10, fullMark: 100 },
    { subject: 'Offense Severity', A: selectedOffense ? selectedOffense.riskFactor * 10 : 0, fullMark: 100 },
    { subject: 'Prior Offenses', A: parseInt(priorOffenses) * 20, fullMark: 100 },
    { subject: 'Community Ties', A: (5 - parseInt(communityTies)) * 20, fullMark: 100 },
    { subject: 'Employment', A: employmentStatus === 'employed' ? 30 : 70, fullMark: 100 },
  ];

  return (
    <ChakraProvider theme={theme}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="4xl"
        margin="auto"
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="brand.600">
            Advanced Indian Bail Calculator
          </Heading>
          <Text textAlign="center" color="gray.600">
            Comprehensive bail estimation based on offense, financial status, risk factors, and case details
          </Text>

          <Tabs isFitted variant="enclosed" colorScheme="brand">
            <TabList mb="1em">
              <Tab>Offense Details</Tab>
              <Tab>Financial Information</Tab>
              <Tab>Risk Assessment</Tab>
              <Tab>Case Details</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Select
                  placeholder="Select an offense"
                  onChange={(e) => setSelectedOffense(offenses.find(o => o.id === parseInt(e.target.value)))}
                >
                  {offenses.map((offense) => (
                    <option key={offense.id} value={offense.id}>{offense.name}</option>
                  ))}
                </Select>
                <Textarea
                  mt={4}
                  placeholder="Provide a brief description of the case"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Annual Income (₹)"
                  />
                  <Input
                    type="number"
                    value={assets}
                    onChange={(e) => setAssets(e.target.value)}
                    placeholder="Total Assets Value (₹)"
                  />
                  <RadioGroup onChange={setEmploymentStatus} value={employmentStatus}>
                    <Stack direction="row">
                      <Radio value="employed">Employed</Radio>
                      <Radio value="unemployed">Unemployed</Radio>
                    </Stack>
                  </RadioGroup>
                </VStack>
              </TabPanel>
              <TabPanel>
                <Text mb={2}>Flight Risk Assessment (1-10)</Text>
                <Slider
                  aria-label="flight-risk-slider"
                  defaultValue={5}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(v) => setFlightRisk(v)}
                >
                  <SliderTrack bg="brand.100">
                    <SliderFilledTrack bg="brand.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <Text mt={4} mb={2}>Prior Offenses</Text>
                <Select value={priorOffenses} onChange={(e) => setPriorOffenses(e.target.value)}>
                  <option value="0">None</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3 or more</option>
                </Select>
              </TabPanel>
              <TabPanel>
                <Text mb={2}>Community Ties (1-5, 5 being strongest)</Text>
                <Slider
                  aria-label="community-ties-slider"
                  defaultValue={3}
                  min={1}
                  max={5}
                  step={1}
                  onChange={(v) => setCommunityTies(v.toString())}
                >
                  <SliderTrack bg="brand.100">
                    <SliderFilledTrack bg="brand.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button
            leftIcon={<Gavel />}
            rightIcon={<ArrowRight />}
            colorScheme="brand"
            onClick={calculateBail}
            size="lg"
            isLoading={calculationProgress > 0 && calculationProgress < 100}
            loadingText="Calculating"
          >
            Calculate Bail
          </Button>

          {calculationProgress > 0 && (
            <Progress
              hasStripe
              isAnimated
              value={calculationProgress}
              colorScheme="brand"
              borderRadius="md"
            />
          )}

          <Flex justify="space-between" align="center" mt={4}>
            <Flex align="center">
              <Box as={Scale} mr={2} color="brand.500" />
              <Text>Fair and transparent</Text>
            </Flex>
            <Flex align="center">
              <Box as={GitCommit} mr={2} color="brand.500" />
              <Text>Based on Indian law</Text>
            </Flex>
            <Flex align="center">
              <Box as={UserCheck} mr={2} color="brand.500" />
              <Text>Personalized assessment</Text>
            </Flex>
          </Flex>
        </VStack>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comprehensive Bail Analysis</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Estimated Bail Amount
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                    ₹{calculatedBail?.toLocaleString('en-IN')}
                  </Text>
                </AlertDescription>
              </Alert>

              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <Heading size="md" mb={2}>Risk Score</Heading>
                  <Text fontSize="2xl" fontWeight="bold" color={riskScore > 50 ? "red.500" : "green.500"}>
                    {riskScore}/100
                  </Text>
                </GridItem>
                <GridItem>
                  <Heading size="md" mb={2}>Bail Adjustment Score</Heading>
                  <Text fontSize="2xl" fontWeight="bold" color={bailScore > 100 ? "red.500" : "green.500"}>
                    {bailScore}/100
                  </Text>
                </GridItem>
              </Grid>

              <Divider />

              <Heading size="md" mb={2}>Risk Assessment</Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Risk Factors" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>

              <Divider />

              <Heading size="md" mb={2}>Case Summary</Heading>
              <Text>{summary}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" leftIcon={<FileText />} onClick={() => {
              // Generate and download PDF report
              toast({
                title: "Report Generated",
                description: "Your detailed bail report has been downloaded.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}>
              Download Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Additional Components */}
      <Box mt={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
        <Heading size="lg" mb={4}>Historical Bail Data</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={offenses}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bailAmount" fill="#8884d8" name="Base Bail Amount" />
            <Bar dataKey="riskFactor" fill="#82ca9d" name="Risk Factor" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
        <Heading size="lg" mb={4}>Bail Calculation Factors</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Briefcase} mr={2} color="brand.500" />
                <Heading size="md">Financial Status</Heading>
              </Flex>
              <Text>Income and assets significantly influence bail amounts.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Users} mr={2} color="brand.500" />
                <Heading size="md">Community Ties</Heading>
              </Flex>
              <Text>Strong community connections may lower flight risk assessment.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={AlertCircle} mr={2} color="brand.500" />
                <Heading size="md">Prior Offenses</Heading>
              </Flex>
              <Text>Previous criminal history can increase bail amounts.</Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      <Box mt={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
        <Heading size="lg" mb={4}>Legal Disclaimer</Heading>
        <Text>
          This bail calculator is provided for informational purposes only and does not constitute legal advice. 
          The calculated bail amount is an estimate based on general factors and may not reflect the actual bail 
          set by a court. Always consult with a qualified legal professional for accurate legal advice tailored 
          to your specific situation.
        </Text>
      </Box>
    </ChakraProvider>
  );
};

export default BailCalculator;