import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, BarChart3, Clock, Users, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Interviews",
    description: "Advanced AI technology that conducts realistic mock interviews tailored to your industry and role."
  },
  {
    icon: MessageSquare,
    title: "Voice Interaction",
    description: "Practice with natural voice conversations, just like a real interview experience."
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Get comprehensive feedback on your performance, including areas for improvement."
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "Practice anytime, anywhere. Our AI interviewer never sleeps and is always ready."
  },
  {
    icon: Users,
    title: "Industry Specific",
    description: "Customized questions and scenarios for different industries and job positions."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your practice sessions are completely private and secure. We protect your data."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">PrepWise?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with proven interview techniques 
            to give you the best preparation experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;