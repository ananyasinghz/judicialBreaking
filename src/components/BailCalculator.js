import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Scale, GitCommit, ArrowRight, Gavel, UserCheck, FileText, Briefcase, Users, Clock, Calendar, BadgeAlert, AlertTriangle, DollarSign, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from 'recharts';
import { jsPDF } from "jspdf";
import {
  Box, VStack, Heading, Text, Select, Input, Button, Alert, AlertIcon, AlertTitle, AlertDescription,
  Flex, ChakraProvider, extendTheme, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Tabs, TabList, TabPanels, Tab, TabPanel, Progress, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast,
  Grid, GridItem, Textarea, Radio, RadioGroup, Stack, Divider, Tooltip, FormControl, FormLabel,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Switch, Badge, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton
} from '@chakra-ui/react';

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
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          },
        }),
      },
    },
  },
});

const MotionBox = motion(Box);

const EnhancedBailCalculator = () => {
  const [offense, setOffense] = useState('');
  const [age, setAge] = useState(30);
  const [theftAmount, setTheftAmount] = useState(0);
  const [criminalHistory, setCriminalHistory] = useState(false);
  const [failureToAppear, setFailureToAppear] = useState(false);
  const [timeServed, setTimeServed] = useState(0);
  const [income, setIncome] = useState(0);
  const [assets, setAssets] = useState(0);
  const [flightRisk, setFlightRisk] = useState(5);
  const [communityTies, setCommunityTies] = useState(5);
  const [employmentStatus, setEmploymentStatus] = useState('employed');
  const [mentalHealth, setMentalHealth] = useState('stable');
  const [substanceAbuse, setSubstanceAbuse] = useState('none');
  const [calculatedBail, setCalculatedBail] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [bailScore, setBailScore] = useState(0);
  const [summary, setSummary] = useState('');
  const [calculationProgress, setCalculationProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const calculateBail = () => {
    if (!offense || !age || theftAmount === null || income === null || assets === null) {
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
      let baseBail = 50000; // Example base amount

      // Age factor (updated as per requirements)
      const ageFactor = age < 16 || age > 60 ? 2 : 1;

      // Theft amount factor (updated as per requirements)
      const theftFactor = theftAmount < 10000 ? 1.5 : 1;

      // Criminal history factor (updated as per requirements)
      const historyFactor = criminalHistory ? 0.3 : 1;

      // Failure to appear factor (updated as per requirements)
      const appearanceFactor = failureToAppear ? 0.5 : 1;

      // Time served factor (updated to consider half-sentence)
      const timeServedFactor = timeServed <= 2 ? 1.2 : (timeServed > 48 ? 0.6 : 1);

      // Income and assets factor
      const financialFactor = (income + assets) / 1000000; // Assumes income and assets are in INR

      // Flight risk factor
      const riskFactor = flightRisk / 5;

      // Community ties factor
      const communityFactor = (10 - communityTies) / 5;

      // Employment status factor
      const employmentFactor = employmentStatus === 'employed' ? 0.8 : (employmentStatus === 'student' ? 0.9 : 1.2);

      // Mental health factor
      const mentalHealthFactor = mentalHealth === 'stable' ? 1 : (mentalHealth === 'receiving_treatment' ? 1.2 : 1.5);

      // Substance abuse factor
      const substanceAbuseFactor = substanceAbuse === 'none' ? 1 : (substanceAbuse === 'past' ? 1.2 : 1.5);

      const adjustedBail = baseBail * ageFactor * theftFactor * historyFactor * appearanceFactor * timeServedFactor * (1 + financialFactor) * riskFactor * communityFactor * employmentFactor * mentalHealthFactor * substanceAbuseFactor;

      setCalculatedBail(Math.round(adjustedBail));

      // Calculate risk score
      const newRiskScore = Math.round((
        (age < 16 || age > 60 ? 20 : 0) +
        (theftAmount < 10000 ? 15 : 0) +
        (criminalHistory ? 25 : 0) +
        (failureToAppear ? 20 : 0) +
        (timeServed <= 2 ? 10 : 0) +
        (flightRisk * 2) +
        ((10 - communityTies) * 2) +
        (employmentStatus === 'unemployed' ? 10 : 0) +
        (mentalHealth === 'unstable' ? 10 : 0) +
        (substanceAbuse === 'current' ? 10 : 0)
      ));
      setRiskScore(newRiskScore);

      // Calculate bail score
      const newBailScore = Math.round((adjustedBail / baseBail) * 100);
      setBailScore(newBailScore);

      // Generate summary
      const newSummary = `Based on the offense of ${offense}, with consideration to age (${age}), theft amount (₹${theftAmount}), criminal history (${criminalHistory ? 'Yes' : 'No'}), failure to appear (${failureToAppear ? 'Yes' : 'No'}), time served (${timeServed} hours), financial status (Income: ₹${income}, Assets: ₹${assets}), flight risk (${flightRisk}/10), community ties (${communityTies}/10), employment status (${employmentStatus}), mental health (${mentalHealth}), and substance abuse (${substanceAbuse}), the recommended bail amount is ₹${Math.round(adjustedBail).toLocaleString('en-IN')}. The overall risk score is ${newRiskScore}/100, and the bail adjustment score is ${newBailScore}/100.`;
      setSummary(newSummary);

      clearInterval(intervalId);
      setCalculationProgress(100);
      onOpen();
    }, 1500);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bail Calculation Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Offense: ${offense}`, 20, 40);
    doc.text(`Calculated Bail Amount: ₹${calculatedBail.toLocaleString('en-IN')}`, 20, 50);
    doc.text(`Risk Score: ${riskScore}/100`, 20, 60);
    doc.text(`Bail Adjustment Score: ${bailScore}/100`, 20, 70);
    doc.text("Summary:", 20, 90);
    const splitSummary = doc.splitTextToSize(summary, 180);
    doc.text(splitSummary, 20, 100);
    doc.save("bail_calculation_report.pdf");
  };

  const riskData = [
    { subject: 'Age', A: age < 16 || age > 60 ? 100 : 50 },
    { subject: 'Theft Amount', A: theftAmount < 10000 ? 80 : 40 },
    { subject: 'Criminal History', A: criminalHistory ? 100 : 0 },
    { subject: 'Failure to Appear', A: failureToAppear ? 100 : 0 },
    { subject: 'Time Served', A: timeServed <= 2 ? 80 : (timeServed > 48 ? 20 : 50) },
    { subject: 'Flight Risk', A: flightRisk * 10 },
    { subject: 'Community Ties', A: (10 - communityTies) * 10 },
    { subject: 'Employment', A: employmentStatus === 'unemployed' ? 100 : (employmentStatus === 'student' ? 50 : 0) },
    { subject: 'Mental Health', A: mentalHealth === 'unstable' ? 100 : (mentalHealth === 'receiving_treatment' ? 50 : 0) },
    { subject: 'Substance Abuse', A: substanceAbuse === 'current' ? 100 : (substanceAbuse === 'past' ? 50 : 0) },
  ];

  return (
    <ChakraProvider theme={theme}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="6xl"
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
            Comprehensive bail estimation based on multiple factors and Indian legal context
          </Text>

          <Tabs isFitted variant="enclosed" colorScheme="brand">
            <TabList mb="1em">
              <Tab>Offense Details</Tab>
              <Tab>Personal Information</Tab>
              <Tab>Financial Information</Tab>
              <Tab>Risk Assessment</Tab>
              <Tab>Additional Factors</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl isRequired>
                  <FormLabel>Offense</FormLabel>
                  <Select
                    placeholder="Select an offense"
                    onChange={(e) => setOffense(e.target.value)}
                  >
                    <option value="Petty theft">Petty theft</option>
                    <option value="Assault">Assault</option>
                    <option value="Drug possession">Drug possession</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Trespassing">Trespassing</option>
                  </Select>
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Theft Amount / Damages Caused (₹)</FormLabel>
                  <NumberInput min={0} onChange={(value) => setTheftAmount(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </TabPanel>
              <TabPanel>
                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <NumberInput min={0} max={100} value={age} onChange={(value) => setAge(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Criminal History</FormLabel>
                  <Switch colorScheme="brand" onChange={(e) => setCriminalHistory(e.target.checked)} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Previous Failure to Appear</FormLabel>
                  <Switch colorScheme="brand" onChange={(e) => setFailureToAppear(e.target.checked)} />
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Time Served (hours)</FormLabel>
                  <NumberInput min={0} onChange={(value) => setTimeServed(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </TabPanel>
              <TabPanel>
                <FormControl isRequired>
                  <FormLabel>Annual Income (₹)</FormLabel>
                  <NumberInput min={0} onChange={(value) => setIncome(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Total Assets Value (₹)</FormLabel>
                  <NumberInput min={0} onChange={(value) => setAssets(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </TabPanel>
              <TabPanel>
                <FormControl isRequired>
                  <FormLabel>Flight Risk Assessment (1-10)</FormLabel>
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
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Community Ties Strength (1-10)</FormLabel>
                  <Slider
                    aria-label="community-ties-slider"
                    defaultValue={5}
                    min={1}
                    max={10}
                    step={1}
                    onChange={(v) => setCommunityTies(v)}
                  >
                    <SliderTrack bg="brand.100">
                      <SliderFilledTrack bg="brand.500" />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                </FormControl>
              </TabPanel>
              <TabPanel>
                <FormControl isRequired>
                  <FormLabel>Employment Status</FormLabel>
                  <RadioGroup defaultValue="employed" onChange={setEmploymentStatus}>
                    <Stack direction="row">
                      <Radio value="employed">Employed</Radio>
                      <Radio value="unemployed">Unemployed</Radio>
                      <Radio value="student">Student</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Mental Health Status</FormLabel>
                  <RadioGroup defaultValue="stable" onChange={setMentalHealth}>
                    <Stack direction="row">
                      <Radio value="stable">Stable</Radio>
                      <Radio value="receiving_treatment">Receiving Treatment</Radio>
                      <Radio value="unstable">Unstable</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Substance Abuse History</FormLabel>
                  <RadioGroup defaultValue="none" onChange={setSubstanceAbuse}>
                    <Stack direction="row">
                      <Radio value="none">None</Radio>
                      <Radio value="past">Past History</Radio>
                      <Radio value="current">Current</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
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
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>

              <Divider />

              <Heading size="md" mb={2}>Case Summary</Heading>
              <Text>{summary}</Text>

              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Detailed Factor Analysis
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Heading size="sm">Age Factor</Heading>
                        <Text>Age {age}: {age < 16 || age > 60 ? "High risk" : "Standard risk"}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm">Theft Amount</Heading>
                        <Text>₹{theftAmount.toLocaleString('en-IN')}: {theftAmount < 10000 ? "Higher rate applied" : "Standard rate applied"}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm">Criminal History</Heading>
                        <Text>{criminalHistory ? "Present: Very low rate applied" : "Not present: Standard rate applied"}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm">Failure to Appear</Heading>
                        <Text>{failureToAppear ? "Previous failure: Lower rate applied" : "No previous failure: Standard rate applied"}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm">Time Served</Heading>
                        <Text>{timeServed} hours: {timeServed <= 2 ? "Higher rate" : (timeServed > 48 ? "Lower rate" : "Standard rate")} applied</Text>
                      </Box>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" leftIcon={<FileText />} onClick={generatePDF}>
              Download Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Additional Components */}
      <Box mt={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
        <Heading size="lg" mb={4}>Bail Calculation Factors</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Calendar} mr={2} color="brand.500" />
                <Heading size="md">Age</Heading>
              </Flex>
              <Text>Age below 16 or above 60 may result in higher bail amounts.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={BadgeAlert} mr={2} color="brand.500" />
                <Heading size="md">Criminal History</Heading>
              </Flex>
              <Text>Previous offenses can significantly impact bail determination.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={AlertTriangle} mr={2} color="brand.500" />
                <Heading size="md">Flight Risk</Heading>
              </Flex>
              <Text>Higher flight risk may lead to increased bail amounts.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Clock} mr={2} color="brand.500" />
                <Heading size="md">Time Served</Heading>
              </Flex>
              <Text>Time already served can influence bail recommendations.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Briefcase} mr={2} color="brand.500" />
                <Heading size="md">Financial Status</Heading>
              </Flex>
              <Text>Income and assets are considered in bail calculations.</Text>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start">
              <Flex align="center">
                <Box as={Users} mr={2} color="brand.500" />
                <Heading size="md">Community Ties</Heading>
              </Flex>
              <Text>Strong community connections may influence risk assessment.</Text>
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
          to your specific situation. This tool is designed to be used within the context of the Indian legal system 
          and may not be applicable in other jurisdictions.
        </Text>
      </Box>
    </ChakraProvider>
  );
};

export default EnhancedBailCalculator;