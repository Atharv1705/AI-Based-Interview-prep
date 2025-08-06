import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Phone, PhoneCall, User, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVapi } from '@/hooks/useVapi';
import { useToast } from '@/hooks/use-toast';

interface VoiceAgentProps {
  onUserInfoCollected?: (userInfo: any) => void;
}

const VoiceAgent = ({ onUserInfoCollected }: VoiceAgentProps) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const { toast } = useToast();

  const {
    vapi,
    isConnected,
    isLoading,
    userInfo,
    transcript,
    startCall,
    endCall,
    escalateToHuman,
    updateUserInfo
  } = useVapi();

  useEffect(() => {
    if (userInfo.name || userInfo.city) {
      onUserInfoCollected?.(userInfo);
    }
  }, [userInfo, onUserInfoCollected]);


  const handleStartCall = async () => {
    try {
      await startCall();
      toast({
        title: "Voice Agent Started",
        description: "You can now speak with your AI interview assistant!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    endCall();
    toast({
      title: "Call Ended",
      description: "Voice conversation has been terminated.",
    });
  };

  const handleEscalate = () => {
    escalateToHuman();
    toast({
      title: "Escalating to Human",
      description: "Connecting you with a human agent...",
    });
  };


  return (
    <Card className="glass-card-elevated w-full max-w-md hover-lift interactive-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary animate-pulse-glow" />
          <span className="gradient-text">AI Voice Assistant</span>
        </CardTitle>
        <CardDescription>
          Your personal interview preparation coach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info Display */}
        <AnimatePresence>
          {(userInfo.name || userInfo.city) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-secondary/20 rounded-lg border border-border/50"
            >
              <div className="text-sm font-medium text-primary mb-2">Collected Information:</div>
              <div className="space-y-1">
                {userInfo.name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{userInfo.name}</span>
                  </div>
                )}
                {userInfo.city && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{userInfo.city}</span>
                  </div>
                )}
                {userInfo.interviewType && (
                  <Badge variant="secondary" className="text-xs">
                    {userInfo.interviewType} interview
                  </Badge>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Controls */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{
              scale: isConnected ? [1, 1.05, 1] : 1,
              opacity: isConnected ? [1, 0.8, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: isConnected ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center glow-effect ${
              isConnected
                ? 'bg-gradient-to-r from-green-500 to-green-600 animate-pulse-glow'
                : 'bg-gradient-primary animate-float'
            }`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            ) : isConnected ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </motion.div>

          <div className="text-center">
            <div className="font-medium">
              {isLoading && "Connecting..."}
              {isConnected && "Voice agent is active"}
              {!isLoading && !isConnected && "Ready to start"}
            </div>
            <div className="text-sm text-muted-foreground">
              {isConnected
                ? "Speak naturally - I'm listening!"
                : "Click to start your voice conversation"
              }
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {!isConnected ? (
            <Button
              onClick={handleStartCall}
              disabled={isLoading}
              className="col-span-2 bg-gradient-primary hover-lift interactive-scale glow-effect"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Start Call
            </Button>
          ) : (
            <>
              <Button onClick={handleEndCall} variant="destructive">
                <Phone className="w-4 h-4 mr-2" />
                End Call
              </Button>
              <Button onClick={handleEscalate} variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Human Agent
              </Button>
            </>
          )}
        </div>

        {/* Transcript Toggle */}
        {transcript.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full"
            >
              {showTranscript ? 'Hide' : 'Show'} Conversation ({transcript.length})
            </Button>
            
            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-h-32 overflow-y-auto space-y-1 p-2 bg-secondary/10 rounded border"
                >
                  {transcript.map((text, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {text}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceAgent;