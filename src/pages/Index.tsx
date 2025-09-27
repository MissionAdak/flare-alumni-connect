import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Building, 
  Briefcase, 
  Heart,
  TrendingUp,
  Award,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Alumni Network",
      description: "Connect with graduates and build lasting professional relationships"
    },
    {
      icon: GraduationCap,
      title: "Student Mentorship",
      description: "Provide guidance and share experiences with current students"
    },
    {
      icon: Building,
      title: "Institution Management",
      description: "Centralized data management for colleges and universities"
    },
    {
      icon: Briefcase,
      title: "Career Growth",
      description: "Track career journeys and facilitate recruitment opportunities"
    },
    {
      icon: Heart,
      title: "Donations & Support",
      description: "Enable alumni to give back to their alma mater"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Data-driven insights for institutional growth"
    }
  ];

  const userTypes = [
    { type: "Alumni", icon: GraduationCap, color: "bg-primary" },
    { type: "Students", icon: Users, color: "bg-secondary" },
    { type: "Colleges", icon: Building, color: "bg-accent" },
    { type: "Universities", icon: Award, color: "bg-primary-light" },
    { type: "Recruiters", icon: Briefcase, color: "bg-secondary-light" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">FLARE ALUMS</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="hidden md:flex">Login</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-hero shadow-button hover:scale-105 transition-transform">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                🎓 Digital Alumni Management Platform
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Connect. Engage. 
                <span className="text-accent"> Grow Together</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Strengthen your alumni network with our comprehensive platform. 
                Facilitate mentorship, track career growth, and build lasting 
                institutional relationships.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hero w-full sm:w-auto">
                    Join Network <Users className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Learn More <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <img 
                src={heroImage} 
                alt="Alumni Network Platform" 
                className="w-full h-auto rounded-2xl shadow-hero animate-pulse-slow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Designed for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform serves all stakeholders in the educational ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {userTypes.map((user, index) => (
              <Card key={user.type} className="p-6 text-center hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`w-16 h-16 ${user.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <user.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{user.type}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build and maintain strong alumni relationships
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="p-8 hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Alumni Network?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of institutions already using FLARE ALUMS to strengthen their communities
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hero">
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">FLARE ALUMS</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 FLARE ALUMS. Connecting alumni, empowering futures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;