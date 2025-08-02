import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

interface UserInfo {
  name?: string;
  city?: string;
  interviewType?: string;
  experience?: string;
  specificNeeds?: string;
}

interface VapiHookReturn {
  vapi: Vapi | null;
  isConnected: boolean;
  isLoading: boolean;
  userInfo: UserInfo;
  transcript: string[];
  startCall: () => Promise<void>;
  endCall: () => void;
  escalateToHuman: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
}

export const useVapi = (apiKey?: string): VapiHookReturn => {
  const defaultApiKey = apiKey || localStorage.getItem('vapi_api_key') || '';
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    if (defaultApiKey) {
      const vapiInstance = new Vapi(defaultApiKey);
      setVapi(vapiInstance);

      // Event listeners
      vapiInstance.on('call-start', () => {
        setIsConnected(true);
        setIsLoading(false);
      });

      vapiInstance.on('call-end', () => {
        setIsConnected(false);
        setIsLoading(false);
      });

      vapiInstance.on('speech-start', () => {
        console.log('Speech started');
      });

      vapiInstance.on('speech-end', () => {
        console.log('Speech ended');
      });

      vapiInstance.on('message', (message: any) => {
        console.log('Message:', message);
        if (message.type === 'transcript' && message.transcript) {
          setTranscript(prev => [...prev, message.transcript]);
        }
        
        // Extract user information from conversation
        if (message.transcript) {
          extractUserInfo(message.transcript);
        }
      });

      vapiInstance.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsLoading(false);
      });

      return () => {
        vapiInstance.stop();
      };
    }
  }, [defaultApiKey]);

  const extractUserInfo = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Extract name
    const namePatterns = [
      /my name is (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i,
      /this is (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        setUserInfo(prev => ({ ...prev, name: match[1] }));
        break;
      }
    }

    // Extract city
    const cityPatterns = [
      /from (\w+)/i,
      /in (\w+)/i,
      /located in (\w+)/i,
      /live in (\w+)/i
    ];
    
    for (const pattern of cityPatterns) {
      const match = text.match(pattern);
      if (match) {
        setUserInfo(prev => ({ ...prev, city: match[1] }));
        break;
      }
    }

    // Extract interview preferences
    if (lowerText.includes('technical') || lowerText.includes('coding')) {
      setUserInfo(prev => ({ ...prev, interviewType: 'technical' }));
    } else if (lowerText.includes('behavioral') || lowerText.includes('hr')) {
      setUserInfo(prev => ({ ...prev, interviewType: 'behavioral' }));
    }
  }, []);

  const startCall = useCallback(async () => {
    if (!vapi || isConnected) return;
    
    setIsLoading(true);
    setTranscript([]);
    
    try {
      await vapi.start({
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI interview assistant for PrepWise. Your role is to:
              
              1. Greet users warmly and ask about their interview preparation needs
              2. Extract user information (name, city, experience level, interview type)
              3. Use their name and information in responses to personalize the experience
              4. Guide them through interview preparation options
              5. If they ask for human help or seem frustrated, offer to escalate to a human agent
              
              Always be encouraging and professional. Ask follow-up questions to understand their specific needs.
              
              Start with: "Hi! Welcome to PrepWise, your AI-powered interview assistant. I'm here to help you prepare for your next job interview. Could you tell me your name and what type of interview you're preparing for?"`
            }
          ]
        },
        voice: {
          provider: 'openai',
          voiceId: 'alloy'
        }
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsLoading(false);
    }
  }, [vapi, isConnected]);

  const endCall = useCallback(() => {
    if (vapi && isConnected) {
      vapi.stop();
    }
  }, [vapi, isConnected]);

  const escalateToHuman = useCallback(() => {
    if (vapi && isConnected) {
      // Send message to escalate
      vapi.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: `The user has requested to speak with a human agent. Please acknowledge this request and let them know a human agent will be contacted. Provide them with contact information: support@prepwise.ai or say "I understand you'd like to speak with a human agent. I'm connecting you now to our support team. Please hold on while I transfer your call."`
        }
      });
    }
  }, [vapi, isConnected]);

  const updateUserInfo = useCallback((info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  }, []);

  return {
    vapi,
    isConnected,
    isLoading,
    userInfo,
    transcript,
    startCall,
    endCall,
    escalateToHuman,
    updateUserInfo
  };
};