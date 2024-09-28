import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  Link, 
  Divider, 
  useToast 
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Login submitted', { email, password });
    
    // Show a success message on login
    toast({
      title: "Login successful.",
      description: "You have been logged in successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Redirect to dashboard on successful login
    history.push('/judicial-login');
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-r, blue.200, teal.500)"
    >
      <Box
        maxWidth="400px"
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="xl"
        textAlign="center"
      >
        <Heading mb={6} fontSize="2xl" color="blue.600">Welcome to Judicial Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                focusBorderColor="blue.500"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              Sign In
            </Button>
          </VStack>
        </form>

        {/* Divider */}
        <Divider my={6} />

        {/* Signup link */}
        <Text>
          Don't have an account?{' '}
          <Link color="blue.500" href="/signup">
            Sign up
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
