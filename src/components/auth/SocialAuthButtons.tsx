import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Github, Chrome } from "lucide-react"
import { useState } from "react"

export const SocialAuthButtons = () => {
  const { signInWithGoogle, signInWithGitHub } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(provider)
    try {
      if (provider === 'google') {
        await signInWithGoogle()
      } else {
        await signInWithGitHub()
      }
      toast({
        title: "Success",
        description: `Signing in with ${provider}...`,
      })
    } catch (error: any) {
      const errorMessage = error.message || `Failed to sign in with ${provider}`;
      console.error('Social auth error:', error);
      
      // Check for specific error codes
      if (error.message?.includes('provider is not enabled')) {
        toast({
          title: "Provider Not Enabled",
          description: `${provider} authentication is not enabled. Please contact support or use email authentication.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
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