import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
  Icon,
  Button,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { FaBars, FaHome, FaGavel, FaCalendarAlt, FaUserFriends, FaFileAlt, FaBalanceScale, FaHistory, FaCog, FaPowerOff, FaCheckCircle } from 'react-icons/fa';
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
              <Button leftIcon={<FaHome />} onClick={() => onNavigate('/')}>Home</Button>
              <Button leftIcon={<FaGavel />} onClick={() => onNavigate('/case-assignment')}>Case Assignment</Button>
              <Button leftIcon={<FaCalendarAlt />} onClick={() => onNavigate('/court-calendar')}>Court Calendar</Button>
              <Button leftIcon={<FaUserFriends />} onClick={() => onNavigate('/defendant-records')}>Defendant Records</Button>
              <Button leftIcon={<FaFileAlt />} onClick={() => onNavigate('/document-management')}>Document Management</Button>
              <Button leftIcon={<FaBalanceScale />} onClick={() => onNavigate('/legal-research')}>Legal Research</Button>
              <Button leftIcon={<FaHistory />} onClick={() => onNavigate('/case-history')}>Case History</Button>
              <Button leftIcon={<FaCog />} onClick={() => onNavigate('/settings')}>Settings</Button>
              <Button leftIcon={<FaPowerOff />} onClick={() => onNavigate('/')}>Logout</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

const DefendantRecords = () => {
  const [isOpen, setIsOpen] = useState(false);  // Sidebar state
  const history = useHistory();  // Navigation

  // Sample data for completed cases
  const defendantRecords = [
    { caseId: '001', defendantName: 'John Doe', caseType: 'Theft', status: 'Completed', completionDate: '2023-01-10' },
    { caseId: '002', defendantName: 'Jane Smith', caseType: 'Fraud', status: 'Completed', completionDate: '2023-03-22' },
    { caseId: '003', defendantName: 'Michael Johnson', caseType: 'Assault', status: 'Completed', completionDate: '2023-07-05' },
    { caseId: '004', defendantName: 'Emily Davis', caseType: 'Drug Possession', status: 'Completed', completionDate: '2024-01-18' },
  ];

  const handleSidebarOpen = () => setIsOpen(true);
  const handleSidebarClose = () => setIsOpen(false);
  const handleNavigate = (path) => {
    setIsOpen(false);
    history.push(path);
  };

  return (
    <Box p={8}>
      {/* Hamburger Menu to open sidebar */}
      <Button onClick={handleSidebarOpen} variant="ghost">
        <Icon as={FaBars} boxSize={6} />
      </Button>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onClose={handleSidebarClose} onNavigate={handleNavigate} />

      <Heading mb={6}>Defendant Records - Completed Cases</Heading>

      {/* Table to show the defendant records */}
      <Table variant="striped" colorScheme="blue">
        <TableCaption>Previous cases of all users that were completed</TableCaption>
        <Thead>
          <Tr>
            <Th>Case ID</Th>
            <Th>Defendant Name</Th>
            <Th>Case Type</Th>
            <Th>Status</Th>
            <Th>Completion Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {defendantRecords.map((record) => (
            <Tr key={record.caseId}>
              <Td>{record.caseId}</Td>
              <Td>{record.defendantName}</Td>
              <Td>{record.caseType}</Td>
              <Td>
                <Button
                  leftIcon={<Icon as={FaCheckCircle} />}
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                >
                  {record.status}
                </Button>
              </Td>
              <Td>{record.completionDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DefendantRecords;
