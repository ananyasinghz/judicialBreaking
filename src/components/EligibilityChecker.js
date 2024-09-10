import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  useToast,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const MotionBox = motion(Box);

const BailEligibilityAssessment = () => {
  const [formData, setFormData] = useState({
    offense: '',
    priorRecord: '',
    age: '',
    employmentStatus: '',
    communityTies: '',
    financialStatus: '',
    healthStatus: '',
    legalRepresentation: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated AI model logic based on Indian Constitution
      const offenseGravity = getOffenseGravity(formData.offense);
      const priorRecordScore = getPriorRecordScore(formData.priorRecord);
      const ageScore = getAgeScore(formData.age);
      const employmentScore = getEmploymentScore(formData.employmentStatus);
      const communityTiesScore = getCommunityTiesScore(formData.communityTies);
      const financialScore = getFinancialScore(formData.financialStatus);
      const healthScore = getHealthScore(formData.healthStatus);
      const legalRepresentationScore = getLegalRepresentationScore(formData.legalRepresentation);

      const totalScore =
        offenseGravity +
        priorRecordScore +
        ageScore +
        employmentScore +
        communityTiesScore +
        financialScore +
        healthScore +
        legalRepresentationScore;

      const eligibilityThreshold = 70;
      const isEligible = totalScore >= eligibilityThreshold;

      const conditions = generateBailConditions(formData, isEligible);

      setPrediction({
        eligible: isEligible,
        conditions: conditions,
        score: totalScore,
        maxScore: 100,
        factors: {
          offenseGravity,
          priorRecordScore,
          ageScore,
          employmentScore,
          communityTiesScore,
          financialScore,
          healthScore,
          legalRepresentationScore,
        },
      });

      toast({
        title: 'Assessment Complete',
        description: `Bail eligibility has been determined. Score: ${totalScore}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error in bail eligibility assessment:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during the assessment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
      setProgress(100);
    }
  };

  // Simulated scoring functions based on Indian Constitution and legal principles
  const getOffenseGravity = (offense) => {
    const gravityMap = {
      'minor': 20,
      'moderate': 10,
      'serious': 0,
    };
    return gravityMap[offense.toLowerCase()] || 0;
  };

  const getPriorRecordScore = (record) => {
    const recordMap = {
      'none': 20,
      'minor': 10,
      'major': 0,
    };
    return recordMap[record] || 0;
  };

  const getAgeScore = (age) => {
    if (age < 21) return 5;
    if (age > 60) return 10;
    return 7;
  };

  const getEmploymentScore = (status) => {
    const statusMap = {
      'employed': 10,
      'unemployed': 0,
      'student': 5,
    };
    return statusMap[status] || 0;
  };

  const getCommunityTiesScore = (ties) => {
    return ties.length > 50 ? 10 : 5;
  };

  const getFinancialScore = (status) => {
    const statusMap = {
      'stable': 10,
      'moderate': 5,
      'unstable': 0,
    };
    return statusMap[status] || 0;
  };

  const getHealthScore = (status) => {
    const statusMap = {
      'good': 10,
      'fair': 5,
      'poor': 0,
    };
    return statusMap[status] || 0;
  };

  const getLegalRepresentationScore = (status) => {
    return status === 'yes' ? 10 : 0;
  };

  const generateBailConditions = (formData, isEligible) => {
    if (!isEligible) return [];

    const conditions = [
      'Regular check-ins with local police station',
      'Surrender of passport',
      'Restrictions on travel outside the jurisdiction',
    ];

    if (formData.priorRecord === 'major') {
      conditions.push('Electronic monitoring');
    }

    if (formData.employmentStatus === 'unemployed') {
      conditions.push('Seek and maintain employment');
    }

    if (formData.financialStatus === 'unstable') {
      conditions.push('Financial surety or bond');
    }

    return conditions;
  };

  const renderPieChart = () => {
    if (!prediction) return null;

    const data = {
      labels: ['Offense Gravity', 'Prior Record', 'Age', 'Employment', 'Community Ties', 'Financial', 'Health', 'Legal Representation'],
      datasets: [
        {
          data: [
            prediction.factors.offenseGravity,
            prediction.factors.priorRecordScore,
            prediction.factors.ageScore,
            prediction.factors.employmentScore,
            prediction.factors.communityTiesScore,
            prediction.factors.financialScore,
            prediction.factors.healthScore,
            prediction.factors.legalRepresentationScore,
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
          ],
        },
      ],
    };

    return (
      <Box mt={6}>
        <Heading size="md" mb={4}>Factor Breakdown</Heading>
        <Pie data={data} />
      </Box>
    );
  };

  return (
    <ChakraProvider>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="800px"
        margin="auto"
        mt={8}
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Bail Eligibility Assessment
        </Heading>
        <Text fontSize="md" textAlign="center" mb={6}>
          Based on the principles of the Indian Constitution and Criminal Procedure Code
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Type of Offense</FormLabel>
              <Select
                name="offense"
                value={formData.offense}
                onChange={handleInputChange}
                placeholder="Select offense type"
              >
                <option value="minor">Minor (e.g., petty theft, simple assault)</option>
                <option value="moderate">Moderate (e.g., fraud, drug possession)</option>
                <option value="serious">Serious (e.g., murder, rape, terrorism)</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Prior Criminal Record</FormLabel>
              <Select
                name="priorRecord"
                value={formData.priorRecord}
                onChange={handleInputChange}
                placeholder="Select prior record"
              >
                <option value="none">None</option>
                <option value="minor">Minor offenses</option>
                <option value="major">Major offenses</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Age</FormLabel>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min={18}
                max={100}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Employment Status</FormLabel>
              <Select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                placeholder="Select employment status"
              >
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Community Ties</FormLabel>
              <Textarea
                name="communityTies"
                value={formData.communityTies}
                onChange={handleInputChange}
                placeholder="Describe the accused's ties to the community"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Financial Status</FormLabel>
              <Select
                name="financialStatus"
                value={formData.financialStatus}
                onChange={handleInputChange}
                placeholder="Select financial status"
              >
                <option value="stable">Stable</option>
                <option value="moderate">Moderate</option>
                <option value="unstable">Unstable</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Health Status</FormLabel>
              <Select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleInputChange}
                placeholder="Select health status"
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Legal Representation</FormLabel>
              <Select
                name="legalRepresentation"
                value={formData.legalRepresentation}
                onChange={handleInputChange}
                placeholder="Select legal representation status"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              isLoading={loading}
              loadingText="Assessing"
            >
              Assess Eligibility
            </Button>
          </VStack>
        </form>

        {loading && (
          <Box mt={4}>
            <Text mb={2}>Analyzing factors...</Text>
            <Progress value={progress} size="sm" colorScheme="blue" />
          </Box>
        )}

        {prediction && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            mt={6}
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg={prediction.eligible ? "green.50" : "red.50"}
          >
            <Heading size="md" mb={4}>
              Assessment Result
            </Heading>
            <Alert
              status={prediction.eligible ? "success" : "error"}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {prediction.eligible ? "Eligible for Bail" : "Not Eligible for Bail"}
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {prediction.eligible
                  ? "Based on the provided information and legal guidelines, the accused may be granted bail subject to conditions."
                  : "Based on the provided information and legal guidelines, bail is not recommended at this time."}
              </AlertDescription>
            </Alert>

            <Stat mt={4}>
              <StatLabel>Eligibility Score</StatLabel>
              <StatNumber>{prediction.score} / {prediction.maxScore}</StatNumber>
              <StatHelpText>
                <StatArrow type={prediction.eligible ? "increase" : "decrease"} />
                {((prediction.score / prediction.maxScore) * 100).toFixed(2)}%
              </StatHelpText>
            </Stat>

            {prediction.eligible && prediction.conditions.length > 0 && (
              <Box mt={4}>
                <Heading size="sm" mb={2}>
                  Suggested Bail Conditions:
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {prediction.conditions.map((condition, index) => (
                    <Alert key={index} status="info" variant="left-accent">
                      <AlertIcon />
                      {condition}
                    </Alert>
                  ))}
                </VStack>
              </Box>
            )}

            <Accordion allowToggle mt={6}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Legal Considerations
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text>
                    The bail assessment is based on the principles outlined in the Indian Constitution, particularly Article 21 (Right to Life and Personal Liberty) and the provisions of the Code of Criminal Procedure, 1973.
                  </Text>
                  <Text mt={2}>
                    Key factors considered include the nature and gravity of the offense, the character of the evidence, reasonable apprehension of tampering with witnesses, the danger of the offense being repeated if released, and the accused's roots in society.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {renderPieChart()}
          </MotionBox>
        )}

        <Box mt={8}>
          <Heading size="md" mb={4}>
            Understanding Bail in India
          </Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Types of Bail
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>In India, there are three main types of bail:</Text>
                <UnorderedList mt={2}>
                  <ListItem>Regular Bail: Granted to a person who is under arrest or in police custody.</ListItem>
                  <ListItem>Anticipatory Bail: Granted in anticipation of arrest for a non-bailable offense.</ListItem>
                  <ListItem>Interim Bail: Granted for a short period before the hearing for regular or anticipatory bail.</ListItem>
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Legal Framework
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>The legal framework for bail in India is primarily governed by:</Text>
                <UnorderedList mt={2}>
                  <ListItem>The Constitution of India (Article 21)</ListItem>
                  <ListItem>The Code of Criminal Procedure, 1973 (Sections 436 to 450)</ListItem>
                  <ListItem>Various Supreme Court judgments interpreting these provisions</ListItem>
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        <Box mt={8}>
          <Heading size="md" mb={4}>
            Recent Bail Statistics
          </Heading>
          <Stat>
            <StatLabel>Average Bail Approval Rate (2023)</StatLabel>
            <StatNumber>62%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              5% increase from previous year
            </StatHelpText>
          </Stat>
          <Text mt={2} fontSize="sm" color="gray.600">
            Note: These statistics are simulated and do not represent actual data.
          </Text>
        </Box>

        <Box mt={8}>
          <Heading size="md" mb={4}>
            Disclaimer
          </Heading>
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <AlertTitle>Legal Notice</AlertTitle>
              <AlertDescription>
                This assessment tool is for informational purposes only and does not constitute legal advice. The results should not be considered as a guarantee of bail eligibility. Always consult with a qualified legal professional for advice on your specific case.
              </AlertDescription>
            </Box>
          </Alert>
        </Box>
      </MotionBox>
    </ChakraProvider>
  );
};

export default BailEligibilityAssessment;