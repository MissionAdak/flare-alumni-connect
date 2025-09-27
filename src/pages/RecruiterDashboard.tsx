import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  Search,
  Filter,
  Download,
  MessageCircle,
  TrendingUp,
  Award,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
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
            <Badge className="bg-secondary-light/10 text-secondary-light">Recruiter Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">TechCorp Recruiting</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Find the best talent from top universities and colleges</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-3xl font-bold text-primary">58,420</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">Available for hiring</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold text-secondary">1,247</p>
                </div>
                <Briefcase className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-sm text-green-600 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-3xl font-bold text-accent">342</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
              <p className="text-sm text-green-600 mt-2">This quarter</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-primary">27%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-green-600 mt-2">+5% improvement</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Candidate Search</TabsTrigger>
            <TabsTrigger value="alumni">Alumni Network</TabsTrigger>
            <TabsTrigger value="colleges">College Partnerships</TabsTrigger>
            <TabsTrigger value="analytics">Hiring Analytics</TabsTrigger>
          </TabsList>

          {/* Candidate Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <span>Candidate Search & Filtering</span>
                </CardTitle>
                <CardDescription>Find the perfect candidates based on skills, experience, and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Filters */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Keywords</label>
                    <Input placeholder="Skills, technologies, job titles..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">College/University</label>
                    <Input placeholder="Institution name..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">CGPA Range</label>
                    <Input placeholder="e.g., 7.5 - 9.0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Graduation Year</label>
                    <Input placeholder="e.g., 2024" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Search Candidates
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                {/* Search Results */}
                <div>
                  <h4 className="font-semibold mb-4">Search Results (1,247 candidates)</h4>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Priya Sharma",
                        college: "St. Xavier's College",
                        branch: "Computer Science",
                        cgpa: 8.7,
                        year: 2024,
                        skills: ["React", "Node.js", "Python", "MongoDB"],
                        projects: 8,
                        internships: 2
                      },
                      {
                        name: "Rahul Patel",
                        college: "K.C. College",
                        branch: "Information Technology",
                        cgpa: 8.4,
                        year: 2024,
                        skills: ["Java", "Spring Boot", "MySQL", "Docker"],
                        projects: 6,
                        internships: 1
                      },
                      {
                        name: "Anita Singh",
                        college: "H.R. College",
                        branch: "Electronics",
                        cgpa: 8.9,
                        year: 2023,
                        skills: ["C++", "Python", "MATLAB", "IoT"],
                        projects: 10,
                        internships: 3
                      },
                      {
                        name: "Vikram Kumar",
                        college: "Mithibai College",
                        branch: "Mechanical",
                        cgpa: 8.2,
                        year: 2024,
                        skills: ["AutoCAD", "SolidWorks", "ANSYS", "Manufacturing"],
                        projects: 5,
                        internships: 2
                      }
                    ].map((candidate, index) => (
                      <Card key={index} className="p-6 hover:shadow-card transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="text-lg font-semibold">{candidate.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {candidate.branch} • {candidate.college}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm">View Profile</Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-muted-foreground">CGPA</span>
                            <p className="font-semibold text-primary">{candidate.cgpa}/10</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Graduation</span>
                            <p className="font-semibold">{candidate.year}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Projects</span>
                            <p className="font-semibold">{candidate.projects}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Internships</span>
                            <p className="font-semibold">{candidate.internships}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-muted-foreground mb-2 block">Skills</span>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alumni Network Tab */}
          <TabsContent value="alumni" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>Alumni Network Access</span>
                </CardTitle>
                <CardDescription>Connect with experienced alumni for senior positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Experience Levels</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">0-2 years</span>
                        <span className="font-medium">2,840</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">3-5 years</span>
                        <span className="font-medium">3,920</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">6-10 years</span>
                        <span className="font-medium">2,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">10+ years</span>
                        <span className="font-medium">1,397</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Top Industries</h4>
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
                        <span className="text-sm">Consulting</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Healthcare</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Others</span>
                        <span className="font-medium">8%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Company Sizes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Startup</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mid-size</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Enterprise</span>
                        <span className="font-medium">40%</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Featured Alumni Profiles</h4>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Sarah Johnson",
                        position: "Senior Software Engineer",
                        company: "Google",
                        experience: "6 years",
                        college: "St. Xavier's College",
                        skills: ["React", "Go", "Kubernetes", "System Design"],
                        availability: "Open to opportunities"
                      },
                      {
                        name: "Arjun Gupta",
                        position: "Product Manager",
                        company: "Microsoft",
                        experience: "8 years",
                        college: "K.C. College",
                        skills: ["Product Strategy", "Data Analysis", "Leadership", "Agile"],
                        availability: "Considering offers"
                      },
                      {
                        name: "Meera Reddy",
                        position: "Data Scientist",
                        company: "Amazon",
                        experience: "5 years",
                        college: "H.R. College",
                        skills: ["Python", "Machine Learning", "SQL", "AWS"],
                        availability: "Active job seeker"
                      }
                    ].map((alumni, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="text-lg font-semibold">{alumni.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {alumni.position} at {alumni.company}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {alumni.experience} experience • {alumni.college}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm">View Full Profile</Button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Badge 
                            className={`${
                              alumni.availability === "Active job seeker" 
                                ? "bg-green-100 text-green-800" 
                                : alumni.availability === "Open to opportunities"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {alumni.availability}
                          </Badge>
                        </div>

                        <div>
                          <span className="text-sm text-muted-foreground mb-2 block">Key Skills</span>
                          <div className="flex flex-wrap gap-2">
                            {alumni.skills.map((skill) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* College Partnerships Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <span>College Partnerships</span>
                </CardTitle>
                <CardDescription>Build relationships with top institutions for campus recruitment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Partner Colleges</h4>
                    <div className="space-y-3">
                      {[
                        { name: "St. Xavier's College", students: 1235, placement: 95, avgCGPA: 8.7 },
                        { name: "K.C. College", students: 1180, placement: 92, avgCGPA: 8.4 },
                        { name: "H.R. College", students: 1420, placement: 90, avgCGPA: 8.3 },
                        { name: "Mithibai College", students: 1350, placement: 87, avgCGPA: 8.1 },
                        { name: "Wilson College", students: 980, placement: 85, avgCGPA: 8.0 }
                      ].map((college, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{college.name}</h5>
                            <Button size="sm" variant="outline">Schedule Visit</Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Students: </span>
                              <span className="font-medium">{college.students}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Placement: </span>
                              <span className="font-medium">{college.placement}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg CGPA: </span>
                              <span className="font-medium">{college.avgCGPA}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Recruitment Calendar</h4>
                    <div className="space-y-3">
                      <Card className="p-4 border-l-4 border-primary">
                        <h5 className="font-medium">Campus Drive - St. Xavier's</h5>
                        <p className="text-sm text-muted-foreground">January 15, 2025</p>
                        <p className="text-sm">Expected: 50+ candidates</p>
                      </Card>
                      <Card className="p-4 border-l-4 border-secondary">
                        <h5 className="font-medium">Tech Talk - K.C. College</h5>
                        <p className="text-sm text-muted-foreground">January 22, 2025</p>
                        <p className="text-sm">Pre-placement activity</p>
                      </Card>
                      <Card className="p-4 border-l-4 border-accent">
                        <h5 className="font-medium">Virtual Hiring - H.R. College</h5>
                        <p className="text-sm text-muted-foreground">February 5, 2025</p>
                        <p className="text-sm">Online assessment + interviews</p>
                      </Card>
                    </div>

                    <h4 className="font-semibold mb-4 mt-6">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Request College Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Schedule Campus Visit
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Post Job Opening
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Hiring Analytics & Insights</span>
                </CardTitle>
                <CardDescription>Track your recruitment performance and optimize hiring strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Hiring Funnel</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Applications</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Screening</span>
                        <span className="font-medium">847 (68%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Interviews</span>
                        <span className="font-medium">423 (34%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Offers</span>
                        <span className="font-medium">342 (27%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Accepted</span>
                        <span className="font-medium">298 (24%)</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Top Performing Colleges</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">St. Xavier's</span>
                        <span className="font-medium">45 hires</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">K.C. College</span>
                        <span className="font-medium">38 hires</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">H.R. College</span>
                        <span className="font-medium">32 hires</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mithibai</span>
                        <span className="font-medium">28 hires</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wilson</span>
                        <span className="font-medium">25 hires</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Skill Demand Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">React.js</span>
                        <span className="font-medium">↗ 25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Python</span>
                        <span className="font-medium">↗ 20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Java</span>
                        <span className="font-medium">→ 15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Node.js</span>
                        <span className="font-medium">↗ 18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Docker</span>
                        <span className="font-medium">↗ 30%</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Recruitment ROI Analysis</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h5 className="font-medium mb-3">Cost Breakdown</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Campus Visits</span>
                          <span className="font-medium">₹2,40,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Platform Fees</span>
                          <span className="font-medium">₹1,80,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">HR Resources</span>
                          <span className="font-medium">₹3,20,000</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Total Investment</span>
                          <span>₹7,40,000</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="font-medium mb-3">Hiring Metrics</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Cost per Hire</span>
                          <span className="font-medium">₹24,832</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Time to Hire</span>
                          <span className="font-medium">28 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Quality of Hire</span>
                          <span className="font-medium">8.2/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Retention Rate</span>
                          <span className="font-medium">87%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trend Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;