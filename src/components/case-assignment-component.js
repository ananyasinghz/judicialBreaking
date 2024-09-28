import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Input,
  HStack,
  VStack,
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
    FaPowerOff,
    FaSearch
  } from 'react-icons/fa';

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

const mockCases = [
  { id: 1, name: "John Doe", offense: "Theft", arrestDate: "2024-08-15", riskLevel: "Low", status: "Pending" },
  { id: 2, name: "Jane Smith", offense: "Fraud", arrestDate: "2024-08-10", riskLevel: "Medium", status: "Approved" },
  { id: 3, name: "Bob Johnson", offense: "Assault", arrestDate: "2024-08-05", riskLevel: "High", status: "Rejected" },
  { id: 4, name: "Alice Brown", offense: "Drug Possession", arrestDate: "2024-08-20", riskLevel: "Medium", status: "Pending" },
  { id: 5, name: "Charlie Davis", offense: "Burglary", arrestDate: "2024-08-18", riskLevel: "High", status: "Pending" },
];

const CaseAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const filteredCases = mockCases.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.offense.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
const handleSidebarOpen = () => setIsOpen(true);  // Open sidebarconst const 
const handleSidebarClose = () => setIsOpen(false);  // Close sidebar
const handleNavigate = (path) => history.push(path);  


  return (
    <Box  p={8}>
      <Button onClick={handleSidebarOpen} variant="ghost">
        <Icon as={FaBars} boxSize={6} />  {/* Hamburger icon */}
      </Button>

      {/* Sidebar component */}
      <Sidebar isOpen={isOpen} onClose={handleSidebarClose} onNavigate={handleNavigate} />
      <Heading size="md" mb={4}>Case Assignment</Heading>
      <HStack spacing={4} mb={4}>
        <Input
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {filteredCases.map(caseItem => (
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
    </Box>
  );
};

export default CaseAssignment;
