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
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    studentId: "",
    collegeCode: "",
    universityCode: "",
    companyName: ""
  });
  const navigate = useNavigate();
  const { login, register } = useAuth();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!selectedUserType) {
      setError("Please select your account type");
      return;
    }
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.error) {
        throw result.error;
      }
      toast.success("Login successful!");
      
      // Use a small delay to ensure user state is updated
      setTimeout(() => {
        // Navigate based on the selected user type initially
        navigate(`/dashboard/${selectedUserType}`);
      }, 100);
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserType && email && password) {
      setIsLoading(true);
      try {
        const userData = {
          email,
          password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
          role: selectedUserType.toUpperCase(),
          department: registerData.studentId || registerData.collegeCode || registerData.universityCode || registerData.companyName,
        };
        
        const { error } = await register(userData);
        if (error) {
          toast.error(error.message || "Registration failed");
        } else {
          toast.success("Registration successful! Please check your email to verify your account.");
          setIsRegistering(false);
          setEmail("");
          setPassword("");
          setRegisterData({
            firstName: "",
            lastName: "",
            phone: "",
            studentId: "",
            collegeCode: "",
            universityCode: "",
            companyName: ""
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
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
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
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
                            <Badge variant="secondary">{selectedUser.label} {isRegistering ? 'Registration' : 'Login'}</Badge>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUserType("");
                      setIsRegistering(false);
                    }}
                    className="text-muted-foreground"
                  >
                    Change
                  </Button>
                </div>

                {/* Registration Fields */}
                {isRegistering && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        placeholder="Phone number"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-11"
                      />
                    </div>

                    {/* Role-specific fields */}
                    {selectedUserType === 'student' && (
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          placeholder="Student ID"
                          value={registerData.studentId}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, studentId: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    )}

                    {selectedUserType === 'college' && (
                      <div className="space-y-2">
                        <Label htmlFor="collegeCode">College Code</Label>
                        <Input
                          id="collegeCode"
                          placeholder="College Code"
                          value={registerData.collegeCode}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, collegeCode: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    )}

                    {selectedUserType === 'university' && (
                      <div className="space-y-2">
                        <Label htmlFor="universityCode">University Code</Label>
                        <Input
                          id="universityCode"
                          placeholder="University Code"
                          value={registerData.universityCode}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, universityCode: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    )}

                    {selectedUserType === 'recruiter' && (
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Company Name"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    )}
                  </>
                )}

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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Forgot Password */}
                {!isRegistering && (
                  <div className="text-right">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Forgot Password?
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-hero shadow-button hover:scale-105 transition-transform"
                  disabled={!email || !password || (isRegistering && !registerData.firstName) || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isRegistering ? 'Creating Account...' : 'Logging in...'}
                    </>
                  ) : (
                    isRegistering ? 'Create Account' : 'Login to Dashboard'
                  )}
                </Button>

                {/* Google Login (only for login, not registration) */}
                {!isRegistering && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white/95 px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                )}

                {!isRegistering && (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full h-11"
                    onClick={async () => {
                      try {
                        const { supabase } = await import('@/integrations/supabase/client');
                        const { error } = await supabase.auth.signInWithOAuth({
                          provider: 'google',
                          options: {
                            redirectTo: `${window.location.origin}/dashboard/student`
                          }
                        });
                        if (error) {
                          toast.error('Google login failed: ' + error.message);
                        }
                      } catch (error: any) {
                        toast.error('Google login failed: ' + error.message);
                      }
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                )}

                {/* Toggle between Login and Register */}
                <div className="text-center pt-4 border-t">
                  <p className="text-muted-foreground mb-2">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? 'Login Instead' : 'Create Account'}
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