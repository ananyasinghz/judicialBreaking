import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Icon
  } from '@chakra-ui/react';  // Import necessary components from Chakra UI
  
  import {
    FaHome,
    FaGavel,
    FaCalendarAlt,
    FaUserFriends,
    FaFileAlt,
    FaBalanceScale,
    FaHistory,
    FaCog,
    FaBars,
    FaPowerOff
  } from 'react-icons/fa';  // Import necessary icons from react-icons/fa
  


import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHistory } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
    return (
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Button leftIcon={<FaHome />} onClick={() => onNavigate('/judicial-login')}>Home</Button>
                <Button leftIcon={<FaGavel />} onClick={() => onNavigate('/case-assignment')}>Case Assignment</Button>
                <Button leftIcon={<FaCalendarAlt />} onClick={() => onNavigate('/court-calendar')}>Court Calendar</Button>
                <Button leftIcon={<FaUserFriends />} onClick={() => onNavigate('/defendant-records')}>Defendant Records</Button>
                <Button leftIcon={<FaFileAlt />} onClick={() => onNavigate('/document-management')}>Document Management</Button>
                <Button leftIcon={<FaBalanceScale />} onClick={() => onNavigate('/legal-research')}>Legal Research</Button>
                <Button leftIcon={<FaHistory />} onClick={() => onNavigate('/case-history')}>Case History</Button>
                <Button leftIcon={<FaCog />} onClick={() => onNavigate('/settings')}>Settings</Button>
                <Button leftIcon={<FaPowerOff />} onClick={() => onNavigate('/')}>Logout</Button> {/* Add the Logout button */}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  };

const CourtCalendar = () => {
  const [viewCalendar, setViewCalendar] = useState(false);
  const [addHearing, setAddHearing] = useState(false);
  const [hearingDate, setHearingDate] = useState(new Date());
  const [selectedCase, setSelectedCase] = useState('');
  const [hearings, setHearings] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const toast = useToast();
  const history = useHistory();

  // List of sample cases (you'll replace this with real case data)
  const caseList = ['Case 1', 'Case 2', 'Case 3', 'Case 4'];

  const handleAddHearing = () => {
    if (selectedCase) {
      setHearings([...hearings, { case: selectedCase, date: hearingDate }]);
      toast({
        title: "Hearing added successfully.",
        description: `Hearing for ${selectedCase} set on ${hearingDate.toDateString()}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedCase('');
      setHearingDate(new Date());
      setAddHearing(false);  // Close the form after adding
    } else {
      toast({
        title: "Error",
        description: "Please select a case and a date.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

const handleSidebarOpen = () => setIsOpen(true);  // Open sidebarconst const 
const handleSidebarClose = () => setIsOpen(false);  // Close sidebar
const handleNavigate = (path) => history.push(path);  


  return (
    <Box p={8}>
        {/* Hamburger Menu to open sidebar */}
      <Button onClick={handleSidebarOpen} variant="ghost">
        <Icon as={FaBars} boxSize={6} />  {/* Hamburger icon */}
      </Button>

      {/* Sidebar component */}
      <Sidebar isOpen={isOpen} onClose={handleSidebarClose} onNavigate={handleNavigate} />
      <VStack spacing={6}>
        <Heading>Court Calendar</Heading>
        
        <Button onClick={() => setViewCalendar(!viewCalendar)} colorScheme="blue">
          {viewCalendar ? "Hide Calendar" : "View Calendar"}
        </Button>

        <Button onClick={() => setAddHearing(!addHearing)} colorScheme="green">
          {addHearing ? "Cancel Add Hearing" : "Add New Hearing"}
        </Button>

        {viewCalendar && (
          <Calendar
            value={new Date()}
            tileContent={({ date }) => {
              const hearing = hearings.find(h => new Date(h.date).toDateString() === date.toDateString());
              return hearing ? <p>{hearing.case}</p> : null;
            }}
          />
        )}

        {addHearing && (
          <Box w="full" p={4} border="1px" borderColor="gray.300" borderRadius="md">
            <FormControl mb={4}>
              <FormLabel>Select Case</FormLabel>
              <Select
                placeholder="Select Case"
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
              >
                {caseList.map((caseItem, idx) => (
                  <option key={idx} value={caseItem}>{caseItem}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Select Hearing Date</FormLabel>
              <Input
                type="date"
                value={hearingDate.toISOString().substr(0, 10)}
                onChange={(e) => setHearingDate(new Date(e.target.value))}
              />
            </FormControl>

            <Button onClick={handleAddHearing} colorScheme="blue">Submit</Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CourtCalendar;
