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

export const useVapi = (): VapiHookReturn => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Vapi with API key from localStorage, env, or project default
    (async () => {
      // Prefer server-issued token
      let apiKey = '';
      try {
        const res = await fetch('/api/vapi/token', { method: 'POST', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          apiKey = data.apiKey || '';
        }
      } catch {}
      if (!apiKey) {
        apiKey =
          localStorage.getItem('vapi_api_key') ||
          (import.meta as any).env?.VITE_VAPI_API_KEY ||
          'fbf6b826-fc14-4c0f-b82c-7b9665b4cd41';
      }
      if (!apiKey) {
        console.warn('Vapi API key is not set. Save it in Profile > API Keys or set VITE_VAPI_API_KEY.');
      }
      const vapiInstance = new Vapi(apiKey || '');
    
      // Set up event listeners
      vapiInstance.on('call-start', () => {
        console.log('Call started');
        setIsConnected(true);
        setIsLoading(false);
      });

      vapiInstance.on('call-end', () => {
        console.log('Call ended');
        setIsConnected(false);
        setIsLoading(false);
      });

      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript') {
          console.log(`${message.role}: ${message.transcript}`);
          setTranscript(prev => [...prev, `${message.role}: ${message.transcript}`]);
          
          // Extract user information from transcript
          if (message.role === 'user') {
            extractUserInfo(message.transcript);
          }
        }
      });

      vapiInstance.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsLoading(false);
        setIsConnected(false);
      });

      setVapi(vapiInstance);

      return () => {
        try {
          vapiInstance?.stop();
        } catch {}
      };
    })();
  }, []);

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
      // Configure assistant for mock interview: job context from UI storage if present
      const assistantId =
        localStorage.getItem('vapi_assistant_id') ||
        (import.meta as any).env?.VITE_VAPI_ASSISTANT_ID ||
        'c010d2e8-db16-4255-aaa2-2b3391583ef4';

      const jobTitle = localStorage.getItem('mock_job_title') || 'Software Engineer';
      const company = localStorage.getItem('mock_company') || 'Tech Corp';
      const difficulty = localStorage.getItem('mock_difficulty') || 'medium';

      await vapi.start(assistantId || '', {
        metadata: {
          jobTitle,
          company,
          difficulty,
        },
      } as any);
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
      // Send a message to the assistant to escalate to human
      console.log('Escalating to human agent...');
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