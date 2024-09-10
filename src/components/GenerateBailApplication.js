import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Text, Heading, Button, Input, Textarea, Checkbox, FormControl, FormLabel, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const MotionBox = motion(Box);

const bailGrounds = [
  "The accused is not likely to abscond",
  "The accused is not likely to tamper with evidence",
  "The accused is willing to cooperate with the investigation",
  "The alleged offense is bailable",
  "The accused has no prior criminal record",
  "The accused is the sole breadwinner of the family",
  "The accused requires medical attention",
  "The investigation is complete and charge sheet has been filed"
];

const mockCases = [
  { id: 1, name: "John Doe", offense: "Theft", arrestDate: "2024-08-15", riskLevel: "Low" },
  { id: 2, name: "Jane Smith", offense: "Fraud", arrestDate: "2024-08-10", riskLevel: "Medium" },
  { id: 3, name: "Bob Johnson", offense: "Assault", arrestDate: "2024-08-05", riskLevel: "High" },
];

const EnhancedBailApplicationSystem = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accusedName: '',
    caseNumber: '',
    court: '',
    offenses: '',
    arrestDate: '',
    selectedGrounds: [],
    additionalGrounds: '',
    prayerDetails: ''
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        if (!formData.accusedName || !formData.caseNumber || !formData.court) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 2:
        if (!formData.offenses || !formData.arrestDate) {
          toast({
            title: "Missing Information",
            description: "Please provide details about the offenses and arrest date.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        break;
      case 3:
        if (formData.selectedGrounds.length === 0) {
          toast({
            title: "No Grounds Selected",
            description: "Please select at least one ground for bail.",
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
    doc.text(`${formData.accusedName} ... PETITIONER`, 10, 50);
    doc.text("VERSUS", 10, 60);
    doc.text("State ... RESPONDENT", 10, 70);

    doc.setFontSize(14);
    doc.text("APPLICATION UNDER SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE 1973 FOR GRANT OF BAIL", 10, 90);
    doc.setFontSize(12);
    doc.text("Most Respectfully Show:", 10, 100);
    doc.text(`1. That the present application under section 439 of the Code of Criminal Procedure 1973 is being filed by the Petitioner for seeking grant of bail in Case No. ${formData.caseNumber}. The Petitioner has been arrested on ${formData.arrestDate} in connection with the said case.`, 10, 110, { maxWidth: 180 });
    doc.text(`2. That the Petitioner is innocent and is being falsely implicated in the above said case.`, 10, 130, { maxWidth: 180 });
    doc.text(`3. Grounds for bail:`, 10, 150);

    let yPos = 160;
    formData.selectedGrounds.forEach((ground, index) => {
      doc.text(`   • ${ground}`, 10, yPos);
      yPos += 10;
    });

    if (formData.additionalGrounds) {
      doc.text(`   • ${formData.additionalGrounds}`, 10, yPos);
      yPos += 10;
    }

    doc.text("PRAYER:", 10, yPos + 10);
    doc.text(formData.prayerDetails, 10, yPos + 20, { maxWidth: 180 });

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
            <Heading size="md">Basic Information</Heading>
            <FormControl isRequired>
              <FormLabel>Name of the Accused</FormLabel>
              <Input name="accusedName" value={formData.accusedName} onChange={handleInputChange} placeholder="Enter full name" />
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
      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Offense Details</Heading>
            <FormControl isRequired>
              <FormLabel>Offenses</FormLabel>
              <Textarea name="offenses" value={formData.offenses} onChange={handleInputChange} placeholder="List the alleged offenses" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Date of Arrest</FormLabel>
              <Input name="arrestDate" type="date" value={formData.arrestDate} onChange={handleInputChange} />
            </FormControl>
          </VStack>
        );
      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Grounds for Bail</Heading>
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
      case 4:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Prayer</Heading>
            <FormControl isRequired>
              <FormLabel>Prayer Details</FormLabel>
              <Textarea name="prayerDetails" value={formData.prayerDetails} onChange={handleInputChange} placeholder="Enter the prayer details" />
            </FormControl>
          </VStack>
        );
    }
  };

  const renderJudicialDashboard = () => (
    <Box>
      <Heading size="md" mb={4}>Judicial Authorities Dashboard</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Accused Name</Th>
            <Th>Offense</Th>
            <Th>Arrest Date</Th>
            <Th>Risk Level</Th>
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
                <Button size="sm" colorScheme="blue">View Details</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <ChakraProvider>
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
                <AnimatePresence mode="wait">
                  {renderBailApplicationForm()}
                </AnimatePresence>

                <HStack justify="space-between" width="100%" mt={4}>
                  {step > 1 && <Button onClick={handlePrevious}>Previous</Button>}
                  {step < 4 && <Button colorScheme="blue" onClick={handleNext}>Next</Button>}
                  {step === 4 && <Button colorScheme="green" onClick={generateApplication}>Generate PDF</Button>}
                </HStack>
              </MotionBox>
            </TabPanel>
            <TabPanel>
              {renderJudicialDashboard()}
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Review Bail Application</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>You're about to generate a bail application PDF. Please review all the information before proceeding.</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={generatePDF}>Generate PDF</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default EnhancedBailApplicationSystem;