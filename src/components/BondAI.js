import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, Paperclip, Send, Sun, Moon, X, User, Bot, Trash2, FileText, Image, Volume2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BondAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePrompt, setFilePrompt] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI('AIzaSyDDHyTigKNL81wqgpU2VkjZR-innDbq8Cw');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setInput('');
      setIsTyping(true);
      try {
        const result = await model.generateContent(`Youre ai Law assitant Refer to indian penalcode and indian constinution , never say I'm an AI language model and can't provide legal advice. answer whatever is asked ,if i give you an senerio analyze it and tell me possible legal actions on it  and  please respond to this query accordingly: ${input}`);
        const response = await result.response;
        setIsTyping(false);
        const aiResponse = formatResponse(response.text());
        setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        speakText(aiResponse);
      } catch (error) {
        setError('Failed to generate response. Please try again.');
        toast.error('Failed to generate response. Please try again.');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const formatResponse = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'javascript'}">${code}</code></pre>`;
    });
    return text;
  };

  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`File selected: ${file.name}`);
    }
  };

  const handleFileAnalysis = async () => {
    if (selectedFile) {
      setIsTyping(true);
      try {
        let fileContent;
        if (selectedFile.type.startsWith('image/')) {
          fileContent = await fileToGenerativePart(selectedFile);
        } else {
          fileContent = await selectedFile.text();
        }
        
        const prompt = filePrompt || (selectedFile.type.startsWith('image/') 
          ? "Analyze this image and provide a detailed description of its contents, focusing on any legal documents or relevant legal information visible."
          : "Analyze the following document and provide a summary, focusing on key legal points:");
        
        const result = await model.generateContent([prompt, fileContent]);
        const response = await result.response;
        setMessages(prev => [...prev, { text: `File analyzed: ${selectedFile.name}`, sender: 'user' }]);
        setIsTyping(false);
        const aiResponse = formatResponse(response.text());
        setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        speakText(aiResponse);
        setSelectedFile(null);
        setFilePrompt('');
      } catch (error) {
        setError('Failed to process the file. Please try again.');
        toast.error('Failed to process the file. Please try again.');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.onstop = handleStop;
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast.info('Recording started');
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        toast.error('Unable to access microphone');
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Recording stopped');
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    chunksRef.current = [];
    const audioUrl = URL.createObjectURL(blob);
    audioRef.current.src = audioUrl;
    
    // Here you would typically send the audio to a speech-to-text service
    // For demonstration, we'll just set a placeholder text
    setInput("Transcribed voice input would appear here");
    handleSendMessage();
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const deleteAllConversations = () => {
    setMessages([]);
    toast.info('All conversations deleted');
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const backgroundStyle = theme === 'dark'
    ? { background: 'linear-gradient(to right, #1a202c, #2d3748)' }
    : { background: 'linear-gradient(to right, #e2e8f0, #edf2f7)' };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} style={backgroundStyle}>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">Bond AI Legal Assistant</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={deleteAllConversations}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            <Trash2 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-800 text-yellow-400'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </motion.header>

      <main className="flex-grow overflow-hidden flex flex-col md:flex-row p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-grow overflow-y-auto rounded-lg shadow-xl bg-opacity-50 backdrop-blur-md"
          style={{ backgroundColor: theme === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(237, 242, 247, 0.8)' }}
        >
          <div className="p-4 space-y-4" ref={chatContainerRef}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-lg p-4 rounded-lg shadow-md ${
                      message.sender === 'user'
                        ? theme === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                        : theme === 'dark' ? 'bg-green-700' : 'bg-green-100'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'} mr-2`}>
                        {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <span className="font-semibold">{message.sender === 'user' ? 'You' : 'Bond AI'}</span>
                      {message.sender === 'ai' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => speakText(message.text)}
                          className="ml-2 p-1 rounded-full bg-blue-500 text-white"
                        >
                          <Volume2 size={16} />
                        </motion.button>
                      )}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-200 text-gray-600 hover:text-gray-800'}`}
            >
              <Paperclip size={20} />
            </motion.button>
          </div>
         <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-200 text-gray-600 hover:text-gray-800'}`}
          >
            <Mic size={20} />
          </motion.button>
          {selectedFile && (
            <div className="flex items-center bg-blue-500 text-white p-2 rounded-full">
              {selectedFile.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
              <span className="ml-2 truncate max-w-xs">{selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="ml-2">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        {selectedFile && (
          <div className="mb-2">
            <input
              type="text"
              placeholder="Enter a prompt for file analysis (optional)"
              className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} focus:outline-none`}
              value={filePrompt}
              onChange={(e) => setFilePrompt(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFileAnalysis}
              className={`mt-2 p-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              Analyze File
            </motion.button>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your legal question..."
            className={`flex-grow p-3 rounded-l-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} focus:outline-none`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`p-3 rounded-r-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.footer>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      <audio ref={audioRef} />
    </div>
  );
};

export default BondAI;