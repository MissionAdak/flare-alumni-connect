import { useState, useEffect } from "react";
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
  LogOut,
  Loader2,
  Plus,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, analyticsData, videosData, sessionsData, donationsData] = await Promise.all([
          apiClient.getAlumniProfile(),
          apiClient.getAlumniAnalytics(),
          apiClient.getAlumniVideos(1, 5),
          apiClient.getMentorshipSessions(1, 5),
          apiClient.getDonations(1, 5)
        ]);

        setProfile(profileData.user);
        setAnalytics(analyticsData);
        setVideos(videosData.videos);
        setMentorshipSessions(sessionsData.sessions);
        setDonations(donationsData.donations);
      } catch (error: any) {
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <Badge className="bg-primary/10 text-primary">Alumni Portal</Badge>
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
                  <Badge variant="outline">
                    {profile?.alumniProfile ? '100%' : '0%'}
                  </Badge>
                </div>
                <Progress value={profile?.alumniProfile ? 100 : 0} className="h-2" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Current Position</h4>
                    <p className="text-muted-foreground">
                      {profile?.currentPosition || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Experience</h4>
                    <p className="text-muted-foreground">
                      {profile?.experience ? `${profile.experience} years` : 'Not specified'}
                    </p>
                  </div>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Career Details
                </Button>
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
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.activeMentorships || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Students you're mentoring</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Total Sessions</h4>
                    <p className="text-2xl font-bold text-secondary">
                      {analytics?.totalSessions || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Sessions conducted</p>
                  </Card>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View Requests
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
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No skills added yet</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Academic Performance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">CGPA</span>
                        <p className="text-xl font-bold">
                          {profile?.cgpa ? `${profile.cgpa}/10` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Graduation Year</span>
                        <p className="text-xl font-bold">
                          {profile?.graduationYear || 'N/A'}
                        </p>
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
                  <p className="text-2xl font-bold text-primary">
                    ₹{analytics?.totalDonations || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total donated</p>
                </div>
                <Button className="w-full bg-gradient-hero">
                  <Heart className="h-4 w-4 mr-2" />
                  Make Donation
                </Button>
                <Button variant="outline" className="w-full">
                  View History
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
                  {mentorshipSessions.length > 0 ? (
                    mentorshipSessions.slice(0, 2).map((session) => (
                      <div key={session.id} className="border-l-4 border-primary pl-3">
                        <h4 className="font-semibold">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No upcoming sessions</p>
                  )}
                </div>
                <Button variant="outline" className="w-full">
                  View All Sessions
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
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Update Profile
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