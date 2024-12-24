import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ConversationPage = () => {
  const [messages, setMessages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(null);
  const [expandedAll, setExpandedAll] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition({ continuous: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const utteranceRef = useRef(null);

  useEffect(() => {
    sendMessage('Hi there! How can I assist you today?', 'bot');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (transcript && !isSpeaking()) {
      handleUserInput(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleUserInput = (input) => {
    if (idleTimeout) clearTimeout(idleTimeout);
    const timeout = setTimeout(() => {
      sendMessage(input.trim(), 'user');
      resetTranscript();
    }, 6000);
    setIdleTimeout(timeout);
  };

  const sendMessage = async (message, sender) => {
    setMessages((prev) => [...prev, { text: message, sender }]);
    if (sender === 'user') {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction:
            'You are a helpful and friendly assistant. Provide simpler and medium-sized responses.',
        });

        const chatSession = model.startChat();

        // Add a "loading" placeholder
        setMessages((prev) => [...prev, { text: '...', sender: 'bot' }]);

        const response = await chatSession.sendMessage(message);
        let botReply = response.response.text();
        botReply = botReply.replace(/\*/g, '');

        // Replace placeholder with actual message
        setMessages((prev) =>
          prev.filter((msg) => msg.text !== '...').concat({ text: botReply, sender: 'bot' })
        );
        speak(botReply);
      } catch (error) {
        console.error('Error:', error);
        speak("Sorry, I couldn't process that. Please try again.");
      }
    }
  };

  const speak = (text) => {
    stopListening();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find((v) => v.name === 'Microsoft Zira - English (United States)');
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    }

    utterance.onstart = () => setIsActive(true);
    utterance.onend = () => {
      setIsActive(false);
      startListening();
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!isActive) {
      setIsActive(true);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const toggleActive = () => {
    if (isActive) {
      stopListening();
      setIsActive(false);
    } else {
      startListening();
    }
  };

  const isSpeaking = () => window.speechSynthesis.speaking;
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/*
        Button container pinned at top-left
        - z-50 ensures it’s above other elements
      */}
      <div className="fixed top-4 left-4 flex flex-col items-start gap-4 z-50">
        {/* Show/Hide Conversations Button */}
        <button
          className="
            px-4 py-2 
            bg-blue-500 hover:bg-blue-600 
            text-white text-sm sm:text-lg 
            rounded-lg shadow 
            focus:outline-none
          "
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'Hide Conversations' : 'Show Conversations'}
        </button>

        {/* Activity text, e.g. "Active..." / "Tap to start" */}
        
      </div>

      {/* 
        Add name in top-right corner 
        e.g. "GGTalk" or "ConversationPage" or any custom name
      */}
      <div className="fixed top-4 right-4 z-50">
        <p className="text-white text-sm sm:text-xl font-bold">GGTalk</p>
      </div>

      {/* Responsive, fixed sidebar */}
      {isSidebarOpen && (
        <div
          className="
            fixed
            top-0 bottom-0 left-0
            bg-white
            pt-16 pb-4 px-4
            overflow-y-auto
            shadow-lg
            w-full sm:w-72 md:w-80
            z-40
          "
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ease-in-out ${
                expandedAll ? 'max-h-full' : 'max-h-max overflow-hidden'
              } mb-4`}
            >
              <div
                className="cursor-pointer bg-gray-200 p-3 rounded-lg hover:bg-gray-300"
                onClick={() =>
                  setMessages((prev) =>
                    prev.map((msg, idx) =>
                      idx === index ? { ...msg, expanded: !msg.expanded } : msg
                    )
                  )
                }
              >
                <strong>
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}:
                </strong>{' '}
                {expandedAll || message.expanded
                  ? message.text
                  : message.text.slice(0, 30) + '...'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Center content (Microphone animation + Start/Stop) */}
      <div className="flex flex-col items-center justify-center mt-16">
        <div
          className={`
            rounded-full
            bg-gradient-to-r from-purple-500 to-pink-500
            flex items-center justify-center animate-pulse
            ${isActive ? 'opacity-100' : 'opacity-50'}
            w-40 h-40 sm:w-64 sm:h-64
          `}
        >
          <div className="bg-white rounded-full w-24 h-24 sm:w-48 sm:h-48 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin w-16 h-16 sm:w-32 sm:h-32" />
          </div>
        </div>

        {/* Start/Stop Button in center */}
        <div className="mt-8 text-center">
          <button
            className="px-4 py-2 rounded-lg bg-white text-black text-lg focus:outline-none"
            onClick={toggleActive}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
