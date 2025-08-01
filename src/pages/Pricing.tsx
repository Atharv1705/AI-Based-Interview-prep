import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, X, Star, Zap, Crown, ArrowLeft, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      badge: null,
      icon: Brain,
      features: [
        { name: "5 AI interviews per month", included: true },
        { name: "Basic feedback reports", included: true },
        { name: "Standard question bank", included: true },
        { name: "Email support", included: true },
        { name: "Voice AI assistant", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Custom scenarios", included: false },
        { name: "Priority support", included: false }
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      description: "Most popular for job seekers",
      price: { monthly: 29, annual: 24 },
      badge: "Most Popular",
      icon: Star,
      features: [
        { name: "Unlimited AI interviews", included: true },
        { name: "Advanced feedback & scoring", included: true },
        { name: "Industry-specific questions", included: true },
        { name: "Voice AI assistant", included: true },
        { name: "Progress analytics", included: true },
        { name: "Custom interview scenarios", included: true },
        { name: "Priority email support", included: true },
        { name: "Mock group interviews", included: false }
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For teams and organizations",
      price: { monthly: 99, annual: 79 },
      badge: "Enterprise",
      icon: Crown,
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Team management dashboard", included: true },
        { name: "Bulk user accounts", included: true },
        { name: "Custom branding", included: true },
        { name: "Advanced team analytics", included: true },
        { name: "Mock group interviews", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "API access", included: true }
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer discounts for students?",
      answer: "Yes! We offer a 50% discount for students with a valid .edu email address. Contact support for details."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover-lift">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-effect">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Pricing Plans</h1>
                <p className="text-sm text-muted-foreground">Choose the perfect plan for your needs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprise charges.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-gradient-primary"
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="ml-2">Save 20%</Badge>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className={`glass-card-elevated hover-lift interactive-scale relative ${
                plan.popular ? 'border-primary glow-effect' : ''
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plan.popular ? 'bg-gradient-primary' : 'bg-gradient-accent'
                  }`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl gradient-text">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {plan.price.monthly > 0 ? '/month' : ''}
                      </span>
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.price.annual * 12})
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-primary hover-lift glow-effect' 
                        : 'bg-gradient-accent hover-lift'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="glass-card-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl gradient-text">Why Choose PrepWise?</CardTitle>
              <CardDescription className="text-lg">
                Advanced features that set us apart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">
                    Get personalized feedback and recommendations based on your performance.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
                  <p className="text-muted-foreground">
                    Instant feedback on your responses, tone, and communication style.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-glow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary-glow" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Industry Expertise</h3>
                  <p className="text-muted-foreground">
                    Questions and scenarios tailored to your specific industry and role.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We have answers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="glass-card-elevated hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="glass-card-elevated border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Still Have Questions?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team is here to help you choose the right plan and get the most out of PrepWise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover-lift glow-effect">
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
                <Button variant="outline" size="lg" className="hover-lift">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;