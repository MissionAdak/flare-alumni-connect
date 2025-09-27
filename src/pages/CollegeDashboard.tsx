import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  TrendingUp,
  Calendar,
  Award,
  Building,
  BarChart3,
  BookOpen,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const CollegeDashboard = () => {
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
            <Badge className="bg-accent/10 text-accent">College Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">St. Xavier's College</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">College Dashboard</h1>
          <p className="text-muted-foreground">Manage students, alumni, and institutional data</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alumni</p>
                  <p className="text-3xl font-bold text-primary">2,847</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+12% from last year</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Students</p>
                  <p className="text-3xl font-bold text-secondary">1,235</p>
                </div>
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+8% enrollment</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. CGPA</p>
                  <p className="text-3xl font-bold text-accent">8.4</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
              <p className="text-sm text-green-600 mt-2">+0.3 improvement</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-3xl font-bold text-primary">92%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+5% increase</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-secondary" />
                      <span>Student Management</span>
                    </CardTitle>
                    <CardDescription>Monitor student performance and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Department Wise</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">CSE</span>
                            <span className="font-medium">420</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">ECE</span>
                            <span className="font-medium">380</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">ME</span>
                            <span className="font-medium">435</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Year Wise</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">1st Year</span>
                            <span className="font-medium">350</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">2nd Year</span>
                            <span className="font-medium">320</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">3rd Year</span>
                            <span className="font-medium">315</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">4th Year</span>
                            <span className="font-medium">250</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Above 8.5</span>
                            <span className="font-medium">450</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">7.0 - 8.5</span>
                            <span className="font-medium">620</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Below 7.0</span>
                            <span className="font-medium">165</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">View All Students</Button>
                      <Button variant="outline" className="flex-1">Generate Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Recent Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="border-l-4 border-primary pl-3">
                        <h4 className="font-medium">New Admission</h4>
                        <p className="text-sm text-muted-foreground">150 new students enrolled</p>
                      </div>
                      <div className="border-l-4 border-secondary pl-3">
                        <h4 className="font-medium">Placement Drive</h4>
                        <p className="text-sm text-muted-foreground">TechCorp hiring event</p>
                      </div>
                      <div className="border-l-4 border-accent pl-3">
                        <h4 className="font-medium">Exam Results</h4>
                        <p className="text-sm text-muted-foreground">Semester 6 published</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Alumni Tab */}
          <TabsContent value="alumni" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Alumni Data Management</span>
                </CardTitle>
                <CardDescription>Track and manage alumni information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Career Sectors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">IT/Software</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Finance</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Healthcare</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Education</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Others</span>
                        <span className="font-medium">8%</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Experience Levels</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">0-2 years</span>
                        <span className="font-medium">680</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">3-5 years</span>
                        <span className="font-medium">920</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">6-10 years</span>
                        <span className="font-medium">850</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">10+ years</span>
                        <span className="font-medium">397</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Geographic Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Bangalore</span>
                        <span className="font-medium">890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mumbai</span>
                        <span className="font-medium">650</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Delhi</span>
                        <span className="font-medium">420</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Others</span>
                        <span className="font-medium">887</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Engagement Level</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active</span>
                        <span className="font-medium">1,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Moderate</span>
                        <span className="font-medium">980</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inactive</span>
                        <span className="font-medium">617</span>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Alumni Directory</Button>
                  <Button variant="outline" className="flex-1">Export Data</Button>
                  <Button variant="outline" className="flex-1">Send Newsletter</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>Event Management</span>
                </CardTitle>
                <CardDescription>Organize and track institutional events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Upcoming Events</h4>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Annual Alumni Meet 2024</h5>
                          <Badge>Planning</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">December 15, 2024</p>
                        <p className="text-sm">Expected: 500+ alumni</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Campus Placement Drive</h5>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">January 20, 2025</p>
                        <p className="text-sm">15 companies participating</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Tech Workshop Series</h5>
                          <Badge variant="outline">Draft</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">February 2025</p>
                        <p className="text-sm">Alumni-led skill sessions</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Event Statistics</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">This Year</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Events Organized</span>
                            <span className="font-medium">24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Total Attendance</span>
                            <span className="font-medium">3,450</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Alumni Participation</span>
                            <span className="font-medium">65%</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                  <Button variant="outline" className="flex-1">View Calendar</Button>
                  <Button variant="outline" className="flex-1">Event Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>College Analytics</span>
                </CardTitle>
                <CardDescription>Institutional performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Academic Performance</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">Department Rankings</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Computer Science</span>
                            <Badge className="bg-green-100 text-green-800">Rank 2</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Electronics</span>
                            <Badge className="bg-blue-100 text-blue-800">Rank 5</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Mechanical</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Rank 8</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Placement Insights</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">Top Recruiters</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">TCS</span>
                            <span className="font-medium">85 offers</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Infosys</span>
                            <span className="font-medium">72 offers</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Wipro</span>
                            <span className="font-medium">58 offers</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Detailed Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeDashboard;