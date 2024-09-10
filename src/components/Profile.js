import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Avatar } from '@chakra-ui/react';

const Profile = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('(123) 456-7890');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement profile update logic here
    console.log('Profile updated', { name, email, phone });
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8}>
      <VStack spacing={4} align="stretch">
        <Heading>User Profile</Heading>
        <Avatar size="2xl" name={name} src="https://bit.ly/broken-link" alignSelf="center" />
        <form onSubmit={handleSubmit}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl id="email" isRequired mt={4}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="phone" mt={4}>
            <FormLabel>Phone number</FormLabel>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full" mt={4}>
            Update Profile
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default Profile;