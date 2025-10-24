import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Github, Chrome } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export const SocialAuthButtons = () => {
  const { toast } = useToast()
  const { signInWithGoogle, signInWithGitHub } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(provider)
    try {
      if (provider === 'google') {
        signInWithGoogle()
      } else if (provider === 'github') {
        signInWithGitHub()
      }
    } catch (error: any) {
      const errorMessage = error.message || `Failed to sign in with ${provider}`;
      console.error('Social auth error:', error);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleSocialAuth('google')}
        disabled={loading === 'google'}
      >
        <Chrome className="w-4 h-4 mr-2" />
        {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleSocialAuth('github')}
        disabled={loading === 'github'}
      >
        <Github className="w-4 h-4 mr-2" />
        {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
      </Button>
    </div>
  )
}