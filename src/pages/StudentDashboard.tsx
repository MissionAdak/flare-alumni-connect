import { useState, useEffect } from "react";
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
  LogOut,
  Loader2,
  Plus,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [mentorshipSessions, setMentorshipSessions] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch data if user is authenticated
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user has the correct role for this dashboard
      if (user.role && user.role.toLowerCase() !== 'student') {
        console.warn(`User role '${user.role}' does not match dashboard 'student'`);
        // Still allow access but show a warning
      }

      try {
        setLoading(true);
        const [profileData, analyticsData, sessionsData, alumniData, jobsData] = await Promise.all([
          apiClient.getStudentProfile(),
          apiClient.getStudentAnalytics(),
          apiClient.getStudentMentorshipSessions(1, 5),
          apiClient.searchAlumni({ page: 1, limit: 3 }),
          apiClient.getJobs({ page: 1, limit: 3 })
        ]);

        setProfile(profileData.user);
        setAnalytics(analyticsData);
        setMentorshipSessions(sessionsData.sessions);
        setAlumni(alumniData.alumni);
        setJobs(jobsData.jobs);
      } catch (error: any) {
        console.error('Failed to load dashboard data:', error);
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-muted-foreground">
              Welcome, {profile?.firstName} {profile?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
                    <h4 className="font-semibold mb-2">Mentorship Requests</h4>
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.totalMentorshipRequests || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total requests sent</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Sessions Completed</h4>
                    <p className="text-2xl font-bold text-secondary">
                      {analytics?.completedSessions || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Sessions attended</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Active Mentors</h4>
                    <p className="text-2xl font-bold text-accent">
                      {analytics?.acceptedRequests || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Currently guiding you</p>
                  </Card>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Sessions</h4>
                  <div className="space-y-2">
                    {mentorshipSessions.length > 0 ? (
                      mentorshipSessions.slice(0, 2).map((session) => (
                        <div key={session.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">{session.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              with {session.mentor?.firstName} {session.mentor?.lastName}
                            </p>
                          </div>
                          <Badge variant={session.status === 'COMPLETED' ? 'default' : 'outline'}>
                            {session.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No sessions yet</p>
                    )}
                  </div>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Mentorship
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
                    {alumni.length > 0 ? (
                      alumni.map((alum) => (
                        <div key={alum.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium">{alum.firstName} {alum.lastName}</h5>
                              <p className="text-sm text-muted-foreground">
                                {alum.currentPosition} at {alum.company}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">Connect</Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {alum.skills && alum.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No alumni found</p>
                    )}
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
                    <span className="font-bold">
                      {profile?.cgpa ? `${profile.cgpa}/10` : 'N/A'}
                    </span>
                  </div>
                  <Progress value={profile?.cgpa ? (profile.cgpa * 10) : 0} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {profile?.studentProfile?.currentYear || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Year</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-secondary">
                        {profile?.branch || 'N/A'}
                      </p>
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
                    <h4 className="font-semibold mb-2">Job Applications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Applications</span>
                        <Badge variant="secondary">{analytics?.totalJobApplications || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accepted</span>
                        <Badge variant="secondary">{analytics?.acceptedApplications || 0}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Jobs
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
                  <h4 className="font-semibold">Your Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No skills added yet</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skills
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