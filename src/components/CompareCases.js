import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { jsPDF } from "jspdf";
import { Search, Download, Maximize2, AlertTriangle, Info, BarChart2, PieChart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraProvider, Box, VStack, HStack, Input, Textarea, Button, Text, Heading, Grid, GridItem, useToast, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Tooltip as ChakraTooltip, useColorModeValue, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSpring, animated } from 'react-spring';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDDHyTigKNL81wqgpU2VkjZR-innDbq8Cw');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const CaseComparisonComponent = () => {
  const [currentCase, setCurrentCase] = useState({
    title: '',
    date: '',
    charges: '',
    description: '',
    verdict: ''
  });
  const [similarCases, setSimilarCases] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [error, setError] = useState(null);
  const [caseSimilarityData, setCaseSimilarityData] = useState([]);
  const [caseTimeline, setCaseTimeline] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleInputChange = (e) => {
    setCurrentCase({ ...currentCase, [e.target.name]: e.target.value });
  };

  const fetchSimilarCases = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentCase.title || !currentCase.date || !currentCase.charges || !currentCase.description) {
        throw new Error("Please fill in all required fields.");
      }
  
      const prompt = `Given the following case details:
        Title: ${currentCase.title}
        Charges: ${currentCase.charges}
  
        Please provide 3 similar historical law cases with the following details for each:
        1. Case title
        2. Date
        3. Charges
        4. Brief description
        5. Verdict
  
        Also, provide a brief analysis comparing the given case to these historical cases.`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw API response:', text);
  
      // More flexible parsing logic
      const casesAndAnalysis = text.split(/Case \d+:/);
      if (casesAndAnalysis.length < 2) {
        throw new Error("No valid cases found in the response.");
      }
  
      const cases = casesAndAnalysis.slice(1).map((caseText, index) => {
        const lines = caseText.split('\n').filter(line => line.trim() !== '');
        const caseData = {};
  
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          
          switch (key.trim().toLowerCase()) {
            case 'title':
              caseData.title = value;
              break;
            case 'date':
              caseData.date = value;
              break;
            case 'charges':
              caseData.charges = value;
              break;
            case 'brief description':
              caseData.description = value;
              break;
            case 'verdict':
              caseData.verdict = value;
              break;
            case 'key similarities':
              caseData.similarities = value;
              break;
            case 'key differences':
              caseData.differences = value;
              break;
            case 'similarity score':
              caseData.similarityScore = parseInt(value) || 0;
              break;
            case 'precedent value':
              caseData.precedentValue = parseInt(value) || 0;
              break;
            case 'legal impact':
              caseData.legalImpact = parseInt(value) || 0;
              break;
            case 'public interest':
              caseData.publicInterest = parseInt(value) || 0;
              break;
          }
        });
  
        if (!caseData.title) {
          caseData.title = `Case ${index + 1}`;
        }
  
        return caseData;
      });
  
      if (cases.length === 0) {
        throw new Error("No valid cases could be parsed from the response.");
      }
  
      setSimilarCases(cases);
  
      const analysisText = casesAndAnalysis[casesAndAnalysis.length - 1];
      setAnalysis(analysisText.includes('Analysis:') ? analysisText.split('Analysis:')[1].trim() : 'No analysis provided.');
  
      setCaseSimilarityData(cases.map(c => ({ name: c.title, similarity: c.similarityScore })));
      setCaseTimeline([currentCase, ...cases].map(c => ({ name: c.title, date: c.date })));
      setRadarData(cases.map(c => ({
        subject: c.title,
        'Similarity': c.similarityScore,
        'Precedent Value': c.precedentValue,
        'Legal Impact': c.legalImpact,
        'Public Interest': c.publicInterest
      })));
  
      toast({
        title: "Cases found",
        description: `Retrieved ${cases.length} similar cases successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching similar cases:', error);
      setError(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Case Comparison Report', 10, 20);
    doc.setFontSize(12);
    doc.text(`Current Case: ${currentCase.title}`, 10, 30);
    doc.text('Similar Cases:', 10, 40);
    similarCases.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.title} (Similarity: ${c.similarityScore}%)`, 10, 50 + i * 10);
    });
    doc.text('Analysis:', 10, 90);
    const splitText = doc.splitTextToSize(analysis, 180);
    doc.text(splitText, 10, 100);
    doc.save('case-comparison-report.pdf');

    toast({
      title: "PDF Generated",
      description: "Your report has been downloaded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [currentCase, similarCases, analysis, toast]);

  const pieChartData = {
    labels: similarCases.map(c => c.title),
    datasets: [
      {
        data: similarCases.map(c => c.similarityScore),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const AnimatedNumber = ({ n }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
  };

  return (
    <ChakraProvider>
      <Box maxWidth="1200px" margin="auto" padding={6}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading as="h1" size="xl" textAlign="center">Advanced Case Comparison Tool</Heading>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem colSpan={2}>
                  <Input
                    placeholder="Case Title"
                    name="title"
                    value={currentCase.title}
                    onChange={handleInputChange}
                  />
                </GridItem>
                <Input
                  type="date"
                  name="date"
                  value={currentCase.date}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Charges"
                  name="charges"
                  value={currentCase.charges}
                  onChange={handleInputChange}
                />
                <GridItem colSpan={2}>
                  <Textarea
                    placeholder="Case Description"
                    name="description"
                    value={currentCase.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </GridItem>
                <Input
                  placeholder="Verdict"
                  name="verdict"
                  value={currentCase.verdict}
                  onChange={handleInputChange}
                />
              </Grid>

              <Button
                leftIcon={<Search />}
                colorScheme="blue"
                onClick={fetchSimilarCases}
                isLoading={loading}
                loadingText="Analyzing..."
              >
                Find Similar Cases
              </Button>

              {error && (
                <Box p={4} bg="red.100" color="red.700" borderRadius="md">
                  <HStack>
                    <AlertTriangle />
                    <Text>{error}</Text>
                  </HStack>
                </Box>
              )}

              {similarCases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Heading as="h2" size="lg" mb={3}>Similar Cases</Heading>
                  <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                    {similarCases.map((c, index) => (
                      <GridItem key={index}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Box
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => {
                              setSelectedCase(c);
                              onOpen();
                            }}
                            _hover={{ bg: "gray.50" }}
                            transition="background-color 0.2s"
                          >
                            <Heading as="h3" size="md">{c.title}</Heading>
                            <Text><strong>Date:</strong> {c.date}</Text>
                            <Text><strong>Verdict:</strong> {c.verdict}</Text>
                            <HStack justify="space-between" mt={2}>
                              <Badge colorScheme="green">
                                Similarity: <AnimatedNumber n={c.similarityScore} />%
                              </Badge>
                              <Badge colorScheme="purple">
                                Impact: <AnimatedNumber n={c.legalImpact} />%
                              </Badge>
                            </HStack>
                          </Box>
                        </motion.div>
                      </GridItem>
                    ))}
                  </Grid>
                </motion.div>
              )}

              {selectedCase && (
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{selectedCase.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text><strong>Date:</strong> {selectedCase.date}</Text>
                      <Text><strong>Charges:</strong> {selectedCase.charges}</Text>
                      <Text><strong>Description:</strong> {selectedCase.description}</Text>
                      <Text><strong>Verdict:</strong> {selectedCase.verdict}</Text>
                      <Text><strong>Similarities:</strong> {selectedCase.similarities}</Text>
                      <Text><strong>Differences:</strong> {selectedCase.differences}</Text>
                      <HStack spacing={4} mt={4}>
                        <VStack>
                          <ChakraTooltip label="Similarity to current case">
                            <CircularProgress value={selectedCase.similarityScore} color="green.400">
                              <CircularProgressLabel>{selectedCase.similarityScore}%</CircularProgressLabel>
                            </CircularProgress>
                          </ChakraTooltip>
                          <Text>Similarity</Text>
                        </VStack>
                        <VStack>
                          <ChakraTooltip label="Value as a legal precedent">
                            <CircularProgress value={selectedCase.precedentValue} color="blue.400">
                              <CircularProgressLabel>{selectedCase.precedentValue}%</CircularProgressLabel>
                            </CircularProgress>
                          </ChakraTooltip>
                          <Text>Precedent Value</Text>
                        </VStack>
                        <VStack>
                          <ChakraTooltip label="Impact on legal landscape">
                            <CircularProgress value={selectedCase.legalImpact} color="purple.400">
                              <CircularProgressLabel>{selectedCase.legalImpact}%</CircularProgressLabel>
                            </CircularProgress>
                          </ChakraTooltip>
                          <Text>Legal Impact</Text>
                        </VStack>
                        <VStack>
                          <ChakraTooltip label="Level of public interest">
                            <CircularProgress value={selectedCase.publicInterest} color="orange.400">
                              <CircularProgressLabel>{selectedCase.publicInterest}%</CircularProgressLabel>
                            </CircularProgress>
                          </ChakraTooltip>
                          <Text>Public Interest</Text>
                        </VStack>
                      </HStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}

              {analysis && (
                <Box
                  p={6}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="lg"
                  bg={bgColor}
                  borderColor={borderColor}
                >
                  <Heading as="h2" size="lg" mb={3}>Analysis</Heading>
                  <Text>{analysis}</Text>
                </Box>
              )}

              {similarCases.length > 0 && (
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab><BarChart2 />&nbsp;Timeline</Tab>
                    <Tab><PieChart />&nbsp;Similarity</Tab>
                    <Tab><Activity />&nbsp;Multi-factor</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Box
                        p={6}
                        borderWidth={1}
                        borderRadius="lg"
                        boxShadow="lg"
                        bg={bgColor}
                        borderColor={borderColor}
                      >
                        <Heading as="h3" size="md" mb={3}>Case Comparison Timeline</Heading>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={caseTimeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis dataKey="date" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="date" stroke="#8884d8" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box
                        p={6}
                        borderWidth={1}
                        borderRadius="lg"
                        boxShadow="lg"
                        bg={bgColor}
                        borderColor={borderColor}
                      >
                        <Heading as="h3" size="md" mb={3}>Case Similarity Comparison</Heading>
                        <HStack spacing={8} align="start">
                          <Box width="50%">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={caseSimilarityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="similarity" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </Box>
                          <Box width="50%">
                            <Pie data={pieChartData} />
                          </Box>
                        </HStack>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box
                        p={6}
                        borderWidth={1}
                        borderRadius="lg"
                        boxShadow="lg"
                        bg={bgColor}
                        borderColor={borderColor}
                      >
                        <Heading as="h3" size="md" mb={3}>Multi-factor Case Analysis</Heading>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart outerRadius={150} data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Similarity" dataKey="Similarity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Precedent Value" dataKey="Precedent Value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Radar name="Legal Impact" dataKey="Legal Impact" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                            <Radar name="Public Interest" dataKey="Public Interest" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}

              <HStack justify="space-between">
                <Button
                  leftIcon={<Download />}
                  colorScheme="green"
                  onClick={generatePDF}
                  isDisabled={similarCases.length === 0}
                >
                  Generate Report
                </Button>
                <Button
                  leftIcon={<Info />}
                  colorScheme="purple"
                  onClick={() => {
                    toast({
                      title: "About This Tool",
                      description: "This advanced case comparison tool uses AI to analyze and compare legal cases, providing insights on similarity, precedent value, legal impact, and public interest.",
                      status: "info",
                      duration: 5000,
                      isClosable: true,
                    });
                  }}
                >
                  About This Tool
                </Button>
              </HStack>
            </VStack>
          </motion.div>
        </AnimatePresence>
      </Box>
    </ChakraProvider>
  );
};

export default CaseComparisonComponent;