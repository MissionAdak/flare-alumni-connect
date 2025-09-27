import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Video, 
  TrendingUp, 
  Users, 
  Heart,
  Award,
  MessageCircle,
  Calendar,
  BookOpen,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const AlumniDashboard = () => {
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
            <Badge className="bg-primary/10 text-primary">Alumni Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Welcome, John Alumni</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Alumni Dashboard</h1>
          <p className="text-muted-foreground">Share your journey and mentor the next generation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Journey */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Your Career Journey</span>
                </CardTitle>
                <CardDescription>Track and showcase your professional growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profile Completion</span>
                  <Badge variant="outline">85%</Badge>
                </div>
                <Progress value={85} className="h-2" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Current Position</h4>
                    <p className="text-muted-foreground">Senior Software Engineer at TechCorp</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Experience</h4>
                    <p className="text-muted-foreground">5 years in Software Development</p>
                  </div>
                </div>
                <Button className="w-full">Update Career Details</Button>
              </CardContent>
            </Card>

            {/* Mentorship Activities */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-secondary" />
                  <span>Mentorship Center</span>
                </CardTitle>
                <CardDescription>Share knowledge and guide students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Active Mentorships</h4>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Students you're mentoring</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Video Sessions</h4>
                    <p className="text-2xl font-bold text-secondary">8</p>
                    <p className="text-sm text-muted-foreground">Sessions this month</p>
                  </Card>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Achievements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span>Skills & Achievements</span>
                </CardTitle>
                <CardDescription>Showcase your expertise and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Node.js", "Python", "AWS"].map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Academic Performance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">CGPA</span>
                        <p className="text-xl font-bold">8.7/10</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Graduation Year</span>
                        <p className="text-xl font-bold">2019</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Donation Portal */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Give Back</span>
                </CardTitle>
                <CardDescription>Support your alma mater</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">₹25,000</p>
                  <p className="text-sm text-muted-foreground">Total donated this year</p>
                </div>
                <Button className="w-full bg-gradient-hero">
                  <Heart className="h-4 w-4 mr-2" />
                  Make Donation
                </Button>
                <Button variant="outline" className="w-full">
                  View Impact Report
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-3">
                    <h4 className="font-semibold">Alumni Meetup 2024</h4>
                    <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <h4 className="font-semibold">Career Fair</h4>
                    <p className="text-sm text-muted-foreground">Jan 20, 2025</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find Alumni
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Student Q&A
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;