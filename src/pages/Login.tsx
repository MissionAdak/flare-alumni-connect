import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Building, 
  Briefcase, 
  Award,
  Mail,
  Lock,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const userTypes = [
    { 
      type: "alumni", 
      label: "Alumni", 
      icon: GraduationCap, 
      color: "bg-primary",
      description: "Access mentorship tools, career tracking, and donation portal"
    },
    { 
      type: "student", 
      label: "Student", 
      icon: Users, 
      color: "bg-secondary",
      description: "Connect with alumni, access mentorship, and explore careers"
    },
    { 
      type: "college", 
      label: "College", 
      icon: Building, 
      color: "bg-accent",
      description: "Manage student and alumni data, organize events"
    },
    { 
      type: "university", 
      label: "University", 
      icon: Award, 
      color: "bg-primary-light",
      description: "Monitor college performance, analytics, and institutional data"
    },
    { 
      type: "recruiter", 
      label: "Recruiter", 
      icon: Briefcase, 
      color: "bg-secondary-light",
      description: "Access student profiles, skills data, and recruitment tools"
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserType && email && password) {
      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${selectedUserType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-login flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <GraduationCap className="h-10 w-10 text-white" />
            <h1 className="text-3xl font-bold text-white">FLARE ALUMS</h1>
          </div>
          <p className="text-white/80">Connect with your alumni network</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-hero animate-slide-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
            <CardDescription>Choose your account type to continue</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!selectedUserType ? (
              <div className="space-y-4">
                <Label className="text-base font-medium">Select Account Type</Label>
                <div className="grid gap-3">
                  {userTypes.map((user) => (
                    <Button
                      key={user.type}
                      variant="outline"
                      className="h-auto p-4 justify-start hover:shadow-button transition-all duration-200"
                      onClick={() => setSelectedUserType(user.type)}
                    >
                      <div className={`w-10 h-10 ${user.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                        <user.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">{user.label}</div>
                        <div className="text-sm text-muted-foreground">{user.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Selected User Type Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const selectedUser = userTypes.find(u => u.type === selectedUserType);
                      if (!selectedUser) return null;
                      return (
                        <>
                          <div className={`w-10 h-10 ${selectedUser.color} rounded-lg flex items-center justify-center`}>
                            <selectedUser.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <Badge variant="secondary">{selectedUser.label} Login</Badge>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUserType("")}
                    className="text-muted-foreground"
                  >
                    Change
                  </Button>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Forgot Password?
                  </Button>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-hero shadow-button hover:scale-105 transition-transform"
                  disabled={!email || !password}
                >
                  Login to Dashboard
                </Button>

                {/* Create Account */}
                <div className="text-center pt-4 border-t">
                  <p className="text-muted-foreground mb-2">Don't have an account?</p>
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;