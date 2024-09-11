import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, extendTheme, Box, VStack, HStack, Text, Heading, Button, Input, Textarea, Checkbox, FormControl, FormLabel, Select, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Badge, Progress, UnorderedList, ListItem, Divider, Tooltip, InputGroup, InputLeftAddon, Stack, Switch } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFileDownload, FaSearch, FaUserCircle, FaExclamationTriangle, FaInfoCircle, FaChevronRight, FaChevronLeft, FaSave, FaUpload } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SignatureCanvas from 'react-signature-canvas';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004280',
      800: '#002a4d',
      900: '#00121a',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : `${props.colorScheme}.600`,
          },
        }),
      },
    },
  },
});

const MotionBox = motion(Box);

const bailGrounds = [
  "The accused is not likely to abscond",
  "The accused is not likely to tamper with evidence",
  "The accused is willing to cooperate with the investigation",
  "The alleged offense is bailable",
  "The accused has no prior criminal record",
  "The accused is the sole breadwinner of the family",
  "The accused requires medical attention",
  "The investigation is complete and charge sheet has been filed",
  "The accused is a student and exams are approaching",
  "The accused has strong community ties",
  "The case against the accused is weak",
  "The accused is willing to surrender their passport"
];

const mockCases = [
  { id: 1, name: "John Doe", offense: "Theft", arrestDate: "2024-08-15", riskLevel: "Low", status: "Pending" },
  { id: 2, name: "Jane Smith", offense: "Fraud", arrestDate: "2024-08-10", riskLevel: "Medium", status: "Approved" },
  { id: 3, name: "Bob Johnson", offense: "Assault", arrestDate: "2024-08-05", riskLevel: "High", status: "Rejected" },
  { id: 4, name: "Alice Brown", offense: "Drug Possession", arrestDate: "2024-08-20", riskLevel: "Medium", status: "Pending" },
  { id: 5, name: "Charlie Davis", offense: "Burglary", arrestDate: "2024-08-18", riskLevel: "High", status: "Pending" },
];

const mockStats = [
  { month: 'Jan', applications: 65, approved: 40, rejected: 25 },
  { month: 'Feb', applications: 59, approved: 35, rejected: 24 },
  { month: 'Mar', applications: 80, approved: 55, rejected: 25 },
  { month: 'Apr', applications: 81, approved: 60, rejected: 21 },
  { month: 'May', applications: 56, approved: 39, rejected: 17 },
  { month: 'Jun', applications: 55, approved: 38, rejected: 17 },
  { month: 'Jul', applications: 40, approved: 30, rejected: 10 },
];

const EnhancedBailApplicationSystem = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accusedName: '',
    age: '',
    occupation: '',
    address: '',
    fatherName: '',
    respondentName: '',
    respondentAge: '',
    respondentOccupation: '',
    respondentAddress: '',
    firNumber: '',
    sections: '',
    policeStation: '',
    caseNumber: '',
    court: '',
    offenses: '',
    arrestDate: '',
    custodyType: 'judicial',
    selectedGrounds: [],
    additionalGrounds: '',
    prayerDetails: '',
    signature: null,
    businessDetails: '',
    relevantFacts: '',
    previousApplications: '',
    medicalCondition: '',
    financialStatus: '',
    communityTies: '',
    passportNumber: '',
    witnessCount: '',
    evidenceStrength: 'medium',
  });
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const signaturePad = useRef();

  useEffect(() => {
    const totalSteps = 7;
    const newProgress = (step / totalSteps) * 100;
    setProgress(newProgress);
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (ground) => {
    setFormData(prevData => ({
      ...prevData,
      selectedGrounds: prevData.selectedGrounds.includes(ground)
        ? prevData.selectedGrounds.filter(g => g !== ground)
        : [...prevData.selectedGrounds, ground]
    }));
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.accusedName || !formData.age || !formData.occupation || !formData.address || !formData.fatherName) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields for the accused.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 2:
        if (!formData.respondentName || !formData.respondentAge || !formData.respondentOccupation || !formData.respondentAddress) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields for the respondent.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 3:
        if (!formData.firNumber || !formData.sections || !formData.policeStation || !formData.caseNumber || !formData.court) {
          toast({
            title: "Missing Information",
            description: "Please provide all case details.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 4:
        if (!formData.offenses || !formData.arrestDate || formData.selectedGrounds.length === 0) {
          toast({
            title: "Missing Information",
            description: "Please provide offense details and select at least one ground for bail.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 5:
        if (!formData.businessDetails || !formData.relevantFacts || !formData.previousApplications) {
          toast({
            title: "Missing Information",
            description: "Please provide all additional details.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 6:
        if (!formData.prayerDetails) {
          toast({
            title: "Missing Information",
            description: "Please provide the prayer details.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 7:
        if (!formData.signature) {
          toast({
            title: "Missing Signature",
            description: "Please provide your signature.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
    }
    return true;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`IN THE COURT OF ${formData.court.toUpperCase()}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Case No: ${formData.caseNumber}`, 10, 30);
    doc.text("IN THE MATTER OF:", 10, 40);
    doc.text(`${formData.accusedName}, aged ${formData.age} years, ${formData.occupation}`, 10, 50);
    doc.text(`S/o ${formData.fatherName}, residing at ${formData.address} ... PETITIONER`, 10, 60);
    doc.text("VERSUS", 10, 70);
    doc.text(`State of ________ through ${formData.respondentName}, aged ${formData.respondentAge} years,`, 10, 80);
    doc.text(`${formData.respondentOccupation}, residing at ${formData.respondentAddress} ... RESPONDENT`, 10, 90);

    doc.setFontSize(14);
    doc.text("APPLICATION UNDER SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE 1973 FOR GRANT OF BAIL", 10, 110);
    doc.setFontSize(12);
    doc.text("Most Respectfully Show:", 10, 120);
    doc.text(`1. That the present application under section 439 of the Code of Criminal Procedure 1973 is being filed by the Petitioner for seeking grant of bail in FIR No. ${formData.firNumber} registered at Police Station ${formData.policeStation}. The Petitioner has been arrested on ${formData.arrestDate} in connection with the said FIR and is now in ${formData.custodyType} custody.`, 10, 130, { maxWidth: 180 });
    doc.text(`2. That the Petitioner is innocent and is being falsely implicated in the above said case.`, 10, 160, { maxWidth: 180 });
    doc.text(`3. That the Petitioner is a law-abiding citizen of India. ${formData.businessDetails}`, 10, 170, { maxWidth: 180 });
    doc.text(`4. That the Petitioner is a responsible person and is living at the above-mentioned address.`, 10, 190, { maxWidth: 180 });
    doc.text(`5. ${formData.relevantFacts}`, 10, 200, { maxWidth: 180 });
    doc.text(`6. Grounds for bail:`, 10, 220);

    let yPos = 230;
    formData.selectedGrounds.forEach((ground, index) => {
      doc.text(`   • ${ground}`, 10, yPos);
      yPos += 10;
    });

    if (formData.additionalGrounds) {
      doc.text(`   • ${formData.additionalGrounds}`, 10, yPos);
      yPos += 10;
    }

    doc.text(`7. That the Petitioner undertakes to abide by the conditions that this Honorable Court may impose at the time of granting bail to the Petitioner and further undertakes to attend the trial on every date of hearing.`, 10, yPos + 10, { maxWidth: 180 });
    doc.text(`8. ${formData.previousApplications}`, 10, yPos + 30, { maxWidth: 180 });

    doc.addPage();

    doc.text("PRAYER:", 10, 20);
    doc.text(formData.prayerDetails || "In view of the above stated facts and circumstances, it is most respectfully prayed that this Honorable Court may be pleased to grant bail to the Petitioner in connection with the aforementioned FIR.", 10, 30, { maxWidth: 180 });

    doc.text(`${formData.accusedName}`, 150, 100);
    doc.text("Petitioner", 150, 110);

    if (formData.signature) {
      doc.addImage(formData.signature, 'PNG', 150, 60, 40, 20);
    }

    doc.text("Through", 10, 130);
    doc.text("Counsel", 10, 140);

    doc.text(`Place: ${formData.policeStation}`, 10, 160);
    doc.text(`Dated: ${new Date().toLocaleDateString()}`, 10, 170);

    doc.save(`${formData.accusedName}_BailApplication.pdf`);
  };

  const generateApplication = () => {
    if (validateStep()) {
      onOpen();
    }
  };

  const renderBailApplicationForm = () => {
    switch (step) {
      case 1:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Petitioner Information</Heading>
            <FormControl isRequired>
              <FormLabel>Name of the Accused</FormLabel>
              <Input name="accusedName" value={formData.accusedName} onChange={handleInputChange} placeholder="Enter full name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Father's Name</FormLabel>
              <Input name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Enter father's name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Age</FormLabel>
              <Input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Enter age" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Occupation</FormLabel>
              <Input name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Enter occupation" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full address" />
            </FormControl>
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Respondent Information</Heading>
            <FormControl isRequired>
              <FormLabel>Name of the Respondent</FormLabel>
              <Input name="respondentName" value={formData.respondentName} onChange={handleInputChange} placeholder="Enter full name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Age</FormLabel>
              <Input name="respondentAge" type="number" value={formData.respondentAge} onChange={handleInputChange} placeholder="Enter age" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Occupation</FormLabel>
              <Input name="respondentOccupation" value={formData.respondentOccupation} onChange={handleInputChange} placeholder="Enter occupation" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Textarea name="respondentAddress" value={formData.respondentAddress} onChange={handleInputChange} placeholder="Enter full address" />
            </FormControl>
          </VStack>
        );
      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Case Details</Heading>
            <FormControl isRequired>
              <FormLabel>FIR Number</FormLabel>
              <Input name="firNumber" value={formData.firNumber} onChange={handleInputChange} placeholder="Enter FIR number" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Sections</FormLabel>
              <Input name="sections" value={formData.sections} onChange={handleInputChange} placeholder="Enter applicable sections" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Police Station</FormLabel>
              <Input name="policeStation" value={formData.policeStation} onChange={handleInputChange} placeholder="Enter police station name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Case Number</FormLabel>
              <Input name="caseNumber" value={formData.caseNumber} onChange={handleInputChange} placeholder="Enter case number" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Court</FormLabel>
              <Input name="court" value={formData.court} onChange={handleInputChange} placeholder="Enter court name" />
            </FormControl>
          </VStack>
        );
      case 4:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Offense Details and Grounds for Bail</Heading>
            <FormControl isRequired>
              <FormLabel>Offenses</FormLabel>
              <Textarea name="offenses" value={formData.offenses} onChange={handleInputChange} placeholder="List the alleged offenses" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Date of Arrest</FormLabel>
              <Input name="arrestDate" type="date" value={formData.arrestDate} onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type of Custody</FormLabel>
              <Select name="custodyType" value={formData.custodyType} onChange={handleInputChange}>
                <option value="judicial">Judicial Custody</option>
                <option value="police">Police Custody</option>
              </Select>
            </FormControl>
            <Heading size="sm" mt={4}>Grounds for Bail</Heading>
            {bailGrounds.map((ground, index) => (
              <Checkbox key={index} isChecked={formData.selectedGrounds.includes(ground)} onChange={() => handleCheckboxChange(ground)}>
                {ground}
              </Checkbox>
            ))}
            <FormControl>
              <FormLabel>Additional Grounds</FormLabel>
              <Textarea name="additionalGrounds" value={formData.additionalGrounds} onChange={handleInputChange} placeholder="Enter any additional grounds for bail" />
            </FormControl>
          </VStack>
        );
      case 5:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Additional Details</Heading>
            <FormControl isRequired>
              <FormLabel>Business Details</FormLabel>
              <Textarea name="businessDetails" value={formData.businessDetails} onChange={handleInputChange} placeholder="Provide details about the petitioner's business or employment" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Relevant Facts</FormLabel>
              <Textarea name="relevantFacts" value={formData.relevantFacts} onChange={handleInputChange} placeholder="Enter any relevant facts that support the bail application" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Previous Bail Applications</FormLabel>
              <Textarea name="previousApplications" value={formData.previousApplications} onChange={handleInputChange} placeholder="Provide details of any previous bail applications, if applicable" />
            </FormControl>
            <FormControl>
              <FormLabel>Medical Condition (if applicable)</FormLabel>
              <Textarea name="medicalCondition" value={formData.medicalCondition} onChange={handleInputChange} placeholder="Describe any relevant medical conditions" />
            </FormControl>
            <FormControl>
              <FormLabel>Financial Status</FormLabel>
              <Textarea name="financialStatus" value={formData.financialStatus} onChange={handleInputChange} placeholder="Provide information about the petitioner's financial status" />
            </FormControl>
            <FormControl>
              <FormLabel>Community Ties</FormLabel>
              <Textarea name="communityTies" value={formData.communityTies} onChange={handleInputChange} placeholder="Describe the petitioner's ties to the community" />
            </FormControl>
            <FormControl>
              <FormLabel>Passport Number (if applicable)</FormLabel>
              <Input name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} placeholder="Enter passport number" />
            </FormControl>
            <FormControl>
              <FormLabel>Number of Prosecution Witnesses</FormLabel>
              <Input name="witnessCount" type="number" value={formData.witnessCount} onChange={handleInputChange} placeholder="Enter the number of prosecution witnesses" />
            </FormControl>
            <FormControl>
              <FormLabel>Strength of Evidence</FormLabel>
              <Select name="evidenceStrength" value={formData.evidenceStrength} onChange={handleInputChange}>
                <option value="weak">Weak</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </Select>
            </FormControl>
          </VStack>
        );
      case 6:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Prayer</Heading>
            <FormControl isRequired>
              <FormLabel>Prayer Details</FormLabel>
              <Textarea 
                name="prayerDetails" 
                value={formData.prayerDetails} 
                onChange={handleInputChange} 
                placeholder="Enter the prayer details" 
                height="200px"
              />
            </FormControl>
          </VStack>
        );
      case 7:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Signature</Heading>
            <Box border="1px solid" borderColor="gray.300" p={2}>
              <SignatureCanvas 
                ref={signaturePad}
                canvasProps={{width: 500, height: 200, className: 'signature-canvas'}}
              />
            </Box>
            <HStack>
              <Button onClick={() => signaturePad.current.clear()}>Clear</Button>
              <Button onClick={() => {
                if (signaturePad.current.isEmpty()) {
                  toast({
                    title: "Signature Required",
                    description: "Please provide your signature before saving.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  setFormData(prevData => ({
                    ...prevData,
                    signature: signaturePad.current.toDataURL()
                  }));
                  toast({
                    title: "Signature Saved",
                    description: "Your signature has been saved successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}>Save Signature</Button>
            </HStack>
          </VStack>
        );
    }
  };

  const renderJudicialDashboard = () => (
    <Box>
      <Heading size="md" mb={4}>Judicial Authorities Dashboard</Heading>
      <HStack spacing={4} mb={4}>
        <Input placeholder="Search cases..." />
        <Button leftIcon={<FaSearch />} colorScheme="blue">Search</Button>
      </HStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Accused Name</Th>
            <Th>Offense</Th>
            <Th>Arrest Date</Th>
            <Th>Risk Level</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mockCases.map(caseItem => (
            <Tr key={caseItem.id}>
              <Td>{caseItem.name}</Td>
              <Td>{caseItem.offense}</Td>
              <Td>{caseItem.arrestDate}</Td>
              <Td>
                <Badge colorScheme={caseItem.riskLevel === 'Low' ? 'green' : caseItem.riskLevel === 'Medium' ? 'yellow' : 'red'}>
                  {caseItem.riskLevel}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={caseItem.status === 'Approved' ? 'green' : caseItem.status === 'Rejected' ? 'red' : 'gray'}>
                  {caseItem.status}
                </Badge>
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2}>View Details</Button>
                <Button size="sm" colorScheme="green">Update Status</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={8}>
        <Heading size="md" mb={4}>Bail Application Statistics</Heading>
        <HStack spacing={8} align="start">
          <Box width="60%">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Total Applications" />
                <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
                <Line type="monotone" dataKey="rejected" stroke="#ff7300" name="Rejected" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box width="40%">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Approved', value: mockStats.reduce((sum, stat) => sum + stat.approved, 0) },
                    { name: 'Rejected', value: mockStats.reduce((sum, stat) => sum + stat.rejected, 0) },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ff7300" />
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </HStack>
      </Box>
    </Box>
  );

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        <Heading as="h1" size="xl" textAlign="center" mb={8}>
          Enhanced Bail Application System
        </Heading>
        <Tabs isFitted variant="enclosed" index={activeTab} onChange={(index) => setActiveTab(index)}>
          <TabList mb="1em">
            <Tab>Bail Application Form</Tab>
            <Tab>Judicial Dashboard</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MotionBox
                p={6}
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Progress value={progress} mb={4} colorScheme="blue" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderBailApplicationForm()}
                  </motion.div>
                </AnimatePresence>

                <HStack justify="space-between" width="100%" mt={4}>
                  {step > 1 && <Button onClick={handlePrevious} leftIcon={<FaChevronLeft />}>Previous</Button>}
                  {step < 7 && <Button colorScheme="blue" onClick={handleNext} rightIcon={<FaChevronRight />}>Next</Button>}
                  {step === 7 && <Button colorScheme="green" onClick={generateApplication} leftIcon={<FaFileDownload />}>Generate PDF</Button>}
                </HStack>
              </MotionBox>
            </TabPanel>
            <TabPanel>
              {renderJudicialDashboard()}
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Review Bail Application</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Text>Please review the information before generating the PDF:</Text>
                <Box p={4} bg="gray.100" borderRadius="md">
                  <Text><strong>Petitioner:</strong> {formData.accusedName}, {formData.age} years old</Text>
                  <Text><strong>Father's Name:</strong> {formData.fatherName}</Text>
                  <Text><strong>Respondent:</strong> {formData.respondentName}</Text>
                  <Text><strong>FIR Number:</strong> {formData.firNumber}</Text>
                  <Text><strong>Case Number:</strong> {formData.caseNumber}</Text>
                  <Text><strong>Court:</strong> {formData.court}</Text>
                  <Text><strong>Arrest Date:</strong> {formData.arrestDate}</Text>
                  <Text><strong>Custody Type:</strong> {formData.custodyType}</Text>
                  <Text><strong>Selected Grounds for Bail:</strong></Text>
                  <UnorderedList>
                    {formData.selectedGrounds.map((ground, index) => (
                      <ListItem key={index}>{ground}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={generatePDF} leftIcon={<FaFileDownload />}>Generate PDF</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default EnhancedBailApplicationSystem;