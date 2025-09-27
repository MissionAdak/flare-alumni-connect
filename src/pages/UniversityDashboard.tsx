import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Building, 
  TrendingUp,
  Award,
  BarChart3,
  Users,
  Target,
  Globe,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const UniversityDashboard = () => {
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
            <Badge className="bg-primary-light/10 text-primary-light">University Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Mumbai University</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">University Dashboard</h1>
          <p className="text-muted-foreground">Monitor institutional performance and oversee college networks</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Affiliated Colleges</p>
                  <p className="text-3xl font-bold text-primary">47</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+3 new colleges</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-secondary">58,420</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+5.2% growth</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">University CGPA</p>
                  <p className="text-3xl font-bold text-accent">8.1</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
              <p className="text-sm text-green-600 mt-2">+0.2 improvement</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NAAC Grade</p>
                  <p className="text-3xl font-bold text-primary">A++</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">Maintained</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-3xl font-bold text-secondary">89%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+7% increase</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colleges">College Performance</TabsTrigger>
            <TabsTrigger value="academics">Academic Analytics</TabsTrigger>
            <TabsTrigger value="placements">Placement Data</TabsTrigger>
            <TabsTrigger value="rankings">Rankings & Accreditation</TabsTrigger>
          </TabsList>

          {/* College Performance Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>College Performance Overview</span>
                </CardTitle>
                <CardDescription>Monitor performance metrics across affiliated colleges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Top Performing Colleges</h4>
                    <div className="space-y-3">
                      {[
                        { name: "St. Xavier's College", score: 9.2, students: 1235, trend: "+0.3" },
                        { name: "K.C. College", score: 9.0, students: 1180, trend: "+0.5" },
                        { name: "H.R. College", score: 8.9, students: 1420, trend: "+0.2" },
                        { name: "Mithibai College", score: 8.8, students: 1350, trend: "+0.4" },
                        { name: "Wilson College", score: 8.7, students: 980, trend: "+0.1" }
                      ].map((college, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{college.name}</h5>
                            <Badge className="bg-green-100 text-green-800">Rank {index + 1}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Score: </span>
                              <span className="font-medium">{college.score}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Students: </span>
                              <span className="font-medium">{college.students}</span>
                            </div>
                            <div>
                              <span className="text-green-600">{college.trend}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Academic Excellence</h5>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Average CGPA</span>
                              <span className="text-sm font-medium">8.1/10</span>
                            </div>
                            <Progress value={81} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Pass Rate</span>
                              <span className="text-sm font-medium">94%</span>
                            </div>
                            <Progress value={94} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Research Output</span>
                              <span className="text-sm font-medium">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">College Categories</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-3">By Type</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Engineering</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Arts & Science</span>
                            <span className="font-medium">18</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Commerce</span>
                            <span className="font-medium">10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Law</span>
                            <span className="font-medium">4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Medicine</span>
                            <span className="font-medium">3</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">View Detailed Reports</Button>
                  <Button variant="outline" className="flex-1">College Comparison</Button>
                  <Button variant="outline" className="flex-1">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Analytics Tab */}
          <TabsContent value="academics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  <span>Academic Performance Analytics</span>
                </CardTitle>
                <CardDescription>University-wide academic metrics and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Department-wise Performance</h4>
                    <div className="space-y-3">
                      {[
                        { dept: "Computer Science", avgCGPA: 8.5, students: 12500 },
                        { dept: "Electronics", avgCGPA: 8.3, students: 10200 },
                        { dept: "Mechanical", avgCGPA: 8.1, students: 9800 },
                        { dept: "Civil", avgCGPA: 8.0, students: 8500 },
                        { dept: "Information Technology", avgCGPA: 8.4, students: 7200 }
                      ].map((dept, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{dept.dept}</h5>
                            <Badge variant="outline">Avg: {dept.avgCGPA}</Badge>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{dept.students} students</span>
                            <span className="text-green-600">↗ Improving</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Academic Trends</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Yearly Progress</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">2024 Average CGPA</span>
                            <span className="font-medium">8.1</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">2023 Average CGPA</span>
                            <span className="font-medium">7.9</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">2022 Average CGPA</span>
                            <span className="font-medium">7.8</span>
                          </div>
                          <div className="text-center pt-2">
                            <Badge className="bg-green-100 text-green-800">+0.2 Annual Growth</Badge>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Research Publications</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">This Year</span>
                            <span className="font-medium">1,245</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">International</span>
                            <span className="font-medium">687</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Impact Factor &gt;5</span>
                            <span className="font-medium">234</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placement Data Tab */}
          <TabsContent value="placements" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span>University Placement Analytics</span>
                </CardTitle>
                <CardDescription>Comprehensive placement data across all colleges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Overall Statistics</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">89%</p>
                        <p className="text-sm text-muted-foreground">Placement Rate</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <p className="text-xl font-bold">52,000</p>
                          <p className="text-xs text-muted-foreground">Students Placed</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold">8.5L</p>
                          <p className="text-xs text-muted-foreground">Avg Package</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Top Recruiters</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">TCS</span>
                        <span className="font-medium">3,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Infosys</span>
                        <span className="font-medium">2,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wipro</span>
                        <span className="font-medium">2,100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Accenture</span>
                        <span className="font-medium">1,950</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cognizant</span>
                        <span className="font-medium">1,800</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Salary Distribution</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">&gt;15 LPA</span>
                          <span className="font-medium">12%</span>
                        </div>
                      <div className="flex justify-between">
                        <span className="text-sm">10-15 LPA</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">6-10 LPA</span>
                        <span className="font-medium">38%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">3-6 LPA</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">College-wise Placement Performance</h4>
                  <div className="space-y-3">
                    {[
                      { college: "St. Xavier's College", rate: 95, placed: 1174, avg: "9.2L" },
                      { college: "K.C. College", rate: 92, placed: 1086, avg: "8.8L" },
                      { college: "H.R. College", rate: 90, placed: 1278, avg: "8.5L" },
                      { college: "Mithibai College", rate: 87, placed: 1175, avg: "8.1L" },
                      { college: "Wilson College", rate: 85, placed: 833, avg: "7.8L" }
                    ].map((college, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{college.college}</h5>
                          <Badge className={`${index < 3 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {college.rate}% placed
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Students Placed: </span>
                            <span className="font-medium">{college.placed}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Package: </span>
                            <span className="font-medium">{college.avg}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Detailed Analytics
                  </Button>
                  <Button variant="outline" className="flex-1">Export Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Rankings & Accreditation</span>
                </CardTitle>
                <CardDescription>University standings and accreditation status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">National Rankings</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium">NIRF Overall Ranking</h5>
                          <Badge className="bg-primary text-white">Rank 15</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Previous Year:</span>
                            <span>Rank 18</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Improvement:</span>
                            <span className="text-green-600">+3 positions</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Category-wise Rankings</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Engineering</span>
                            <Badge variant="outline">Rank 12</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Management</span>
                            <Badge variant="outline">Rank 8</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Research</span>
                            <Badge variant="outline">Rank 20</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Accreditation Status</h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium">NAAC Grade</h5>
                          <Badge className="bg-green-100 text-green-800">A++</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Score:</span>
                            <span className="font-medium">3.85/4.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valid Until:</span>
                            <span>Dec 2027</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Review:</span>
                            <span>Dec 2022</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h5 className="font-medium mb-3">International Recognition</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">QS World Ranking</span>
                            <Badge variant="outline">451-500</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">THE World Ranking</span>
                            <Badge variant="outline">501-600</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">QS Asia Ranking</span>
                            <Badge variant="outline">101-150</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Upcoming Assessments</h4>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">NAAC Re-accreditation</h5>
                          <p className="text-sm text-muted-foreground">Scheduled for 2025</p>
                        </div>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Preparation Phase
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">NBA Accreditation</h5>
                          <p className="text-sm text-muted-foreground">Engineering programs review</p>
                        </div>
                        <Badge variant="outline">
                          Q2 2024
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Globe className="h-4 w-4 mr-2" />
                    Global Rankings Report
                  </Button>
                  <Button variant="outline" className="flex-1">Accreditation Documents</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityDashboard;