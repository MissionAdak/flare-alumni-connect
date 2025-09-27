import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Video, 
  Users, 
  TrendingUp,
  MessageCircle,
  BookOpen,
  Award,
  Search,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">FLARE ALUMS</span>
            </Link>
            <Badge className="bg-secondary/10 text-secondary">Student Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Welcome, Sarah Student</span>
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Connect with alumni and accelerate your career growth</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentorship Sessions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-secondary" />
                  <span>Mentorship Hub</span>
                </CardTitle>
                <CardDescription>Learn from experienced alumni</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Active Mentors</h4>
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">Guiding your journey</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Sessions Attended</h4>
                    <p className="text-2xl font-bold text-secondary">15</p>
                    <p className="text-sm text-muted-foreground">This semester</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Hours Learned</h4>
                    <p className="text-2xl font-bold text-accent">42</p>
                    <p className="text-sm text-muted-foreground">Knowledge gained</p>
                  </Card>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Career in Software Development</h5>
                        <p className="text-sm text-muted-foreground">with John Alumni</p>
                      </div>
                      <Badge>Completed</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Interview Preparation</h5>
                        <p className="text-sm text-muted-foreground">with Sarah Manager</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Book New Session
                </Button>
              </CardContent>
            </Card>

            {/* Alumni Network */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Alumni Network</span>
                </CardTitle>
                <CardDescription>Connect with graduates in your field</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Find Alumni
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Recommended Alumni</h4>
                  <div className="grid gap-3">
                    {[
                      { name: "John Alumni", role: "Software Engineer", company: "TechCorp", skills: ["React", "Node.js"] },
                      { name: "Alice Data", role: "Data Scientist", company: "DataTech", skills: ["Python", "ML"] },
                      { name: "Bob Manager", role: "Product Manager", company: "StartupXYZ", skills: ["Strategy", "Leadership"] }
                    ].map((alumni, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium">{alumni.name}</h5>
                            <p className="text-sm text-muted-foreground">{alumni.role} at {alumni.company}</p>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {alumni.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Academic Progress */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span>Academic Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current CGPA</span>
                    <span className="font-bold">8.2/10</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">3rd</p>
                      <p className="text-xs text-muted-foreground">Year</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-secondary">CSE</p>
                      <p className="text-xs text-muted-foreground">Branch</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Insights */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Career Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Popular Career Paths</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Software Development</span>
                        <Badge variant="secondary">45%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Science</span>
                        <Badge variant="secondary">25%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Product Management</span>
                        <Badge variant="secondary">20%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Explore Careers
                </Button>
              </CardContent>
            </Card>

            {/* Skill Development */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  <span>Skill Building</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommended Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "React", "Python", "SQL", "Git"].map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;