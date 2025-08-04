import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp, Play, FileText } from "lucide-react"
import { Database } from "@/lib/database.types"
import { useNavigate } from "react-router-dom"

type Interview = Database['public']['Tables']['interviews']['Row']

interface InterviewCardProps {
  interview: Interview
  onViewDetails?: (interview: Interview) => void
}

export const InterviewCard = ({ interview, onViewDetails }: InterviewCardProps) => {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'pending': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{interview.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {interview.type.replace('_', ' ').toUpperCase()} • {interview.industry}
            </CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(interview.status)} text-white`}
          >
            {interview.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(interview.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {interview.duration} min
          </div>
          {interview.score && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {interview.score}%
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(interview.difficulty)}>
            {interview.difficulty}
          </Badge>
        </div>

        <div className="flex gap-2 pt-2">
          {interview.status === 'pending' ? (
            <Button 
              size="sm" 
              onClick={() => navigate(`/interview/${interview.id}`)}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Interview
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails?.(interview)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}