const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<{
      message: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<{
      user: any;
    }>('/auth/me');
  }

  // User endpoints
  async getUserProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateUserProfile(data: any) {
    return this.request<{
      message: string;
      user: any;
    }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserDashboard() {
    return this.request<{ dashboardData: any }>('/users/dashboard');
  }

  // Alumni endpoints
  async getAlumniProfile() {
    return this.request<{ user: any }>('/alumni/profile');
  }

  async updateAlumniProfile(data: any) {
    return this.request<{
      message: string;
      user: any;
      profile: any;
    }>('/alumni/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadVideo(videoData: FormData) {
    return this.request<{
      message: string;
      video: any;
    }>('/alumni/videos', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: videoData,
    });
  }

  async getAlumniVideos(page = 1, limit = 10) {
    return this.request<{
      videos: any[];
      pagination: any;
    }>(`/alumni/videos?page=${page}&limit=${limit}`);
  }

  async getMentorshipSessions(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      sessions: any[];
      pagination: any;
    }>(`/alumni/mentorship-sessions?${params}`);
  }

  async getMentorshipRequests(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      requests: any[];
      pagination: any;
    }>(`/alumni/mentorship-requests?${params}`);
  }

  async updateMentorshipRequest(requestId: string, status: string) {
    return this.request<{
      message: string;
      request: any;
    }>(`/alumni/mentorship-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getDonations(page = 1, limit = 10) {
    return this.request<{
      donations: any[];
      totalDonated: number;
      pagination: any;
    }>(`/alumni/donations?page=${page}&limit=${limit}`);
  }

  async getAlumniAnalytics() {
    return this.request<{
      totalVideos: number;
      totalViews: number;
      totalSessions: number;
      totalDonations: number;
      activeMentorships: number;
      recentActivity: any[];
    }>('/alumni/analytics');
  }

  // Student endpoints
  async getStudentProfile() {
    return this.request<{ user: any }>('/students/profile');
  }

  async updateStudentProfile(data: any) {
    return this.request<{
      message: string;
      user: any;
      profile: any;
    }>('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async searchAlumni(params: {
    skills?: string[];
    careerPath?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.skills) {
      params.skills.forEach(skill => searchParams.append('skills', skill));
    }
    if (params.careerPath) searchParams.append('careerPath', params.careerPath);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return this.request<{
      alumni: any[];
      pagination: any;
    }>(`/students/search-alumni?${searchParams}`);
  }

  async getMentorshipContent(page = 1, limit = 10, category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    return this.request<{
      videos: any[];
      pagination: any;
    }>(`/students/mentorship-content?${params}`);
  }

  async requestMentorship(mentorId: string, message?: string) {
    return this.request<{
      message: string;
      request: any;
    }>('/students/mentorship-requests', {
      method: 'POST',
      body: JSON.stringify({ mentorId, message }),
    });
  }

  async getStudentMentorshipSessions(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      sessions: any[];
      pagination: any;
    }>(`/students/mentorship-sessions?${params}`);
  }

  async getStudentJobs(params: {
    skills?: string[];
    location?: string;
    jobType?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.skills) {
      params.skills.forEach(skill => searchParams.append('skills', skill));
    }
    if (params.location) searchParams.append('location', params.location);
    if (params.jobType) searchParams.append('jobType', params.jobType);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return this.request<{
      jobs: any[];
      pagination: any;
    }>(`/students/jobs?${searchParams}`);
  }

  async applyForJob(jobId: string, coverLetter?: string, resumeUrl?: string) {
    return this.request<{
      message: string;
      application: any;
    }>(`/students/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ coverLetter, resumeUrl }),
    });
  }

  async getStudentAnalytics() {
    return this.request<{
      totalMentorshipRequests: number;
      acceptedRequests: number;
      completedSessions: number;
      totalJobApplications: number;
      acceptedApplications: number;
      recentActivity: any[];
    }>('/students/analytics');
  }

  // College admin endpoints
  async getCollegeDashboard() {
    return this.request<{
      college: any;
      statistics: any;
      students: any[];
      alumni: any[];
    }>('/colleges/dashboard');
  }

  async getCollegeStudents(params: {
    year?: number;
    branch?: string;
    cgpaMin?: number;
    cgpaMax?: number;
    placementStatus?: string;
    internshipStatus?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      students: any[];
      pagination: any;
    }>(`/colleges/students?${searchParams}`);
  }

  async getCollegeAlumni(params: {
    graduationYear?: number;
    branch?: string;
    company?: string;
    experience?: number;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      alumni: any[];
      pagination: any;
    }>(`/colleges/alumni?${searchParams}`);
  }

  async createEvent(eventData: any) {
    return this.request<{
      message: string;
      event: any;
    }>('/colleges/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getCollegeEvents(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      events: any[];
      pagination: any;
    }>(`/colleges/events?${params}`);
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.request<{
      message: string;
      event: any;
    }>(`/colleges/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async getNaacData() {
    return this.request<{
      college: any;
      placementData: any;
    }>('/colleges/naac-data');
  }

  async getCollegeAnalytics() {
    return this.request<{
      totalStudents: number;
      totalAlumni: number;
      totalEvents: number;
      totalMentorshipSessions: number;
      recentActivity: any[];
    }>('/colleges/analytics');
  }

  // University admin endpoints
  async getUniversityDashboard() {
    return this.request<{
      university: any;
      colleges: any[];
      statistics: any;
    }>('/universities/dashboard');
  }

  async getUniversityColleges(page = 1, limit = 10) {
    return this.request<{
      colleges: any[];
      pagination: any;
    }>(`/universities/colleges?page=${page}&limit=${limit}`);
  }

  async getUniversityReports(reportType: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams({ reportType });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return this.request<any>(`/universities/reports?${params}`);
  }

  async getUniversityAnalytics() {
    return this.request<{
      totalStudents: number;
      totalAlumni: number;
      totalColleges: number;
      totalEvents: number;
      totalMentorshipSessions: number;
      recentActivity: any[];
    }>('/universities/analytics');
  }

  // Recruiter endpoints
  async getRecruiterProfile() {
    return this.request<{ user: any }>('/recruiters/profile');
  }

  async updateRecruiterProfile(data: any) {
    return this.request<{
      message: string;
      user: any;
      profile: any;
    }>('/recruiters/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async browseStudents(params: {
    skills?: string[];
    cgpaMin?: number;
    cgpaMax?: number;
    branch?: string;
    year?: number;
    placementStatus?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.skills) {
      params.skills.forEach(skill => searchParams.append('skills', skill));
    }
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'skills') {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      students: any[];
      pagination: any;
    }>(`/recruiters/students?${searchParams}`);
  }

  async postJob(jobData: any) {
    return this.request<{
      message: string;
      job: any;
    }>('/recruiters/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async getRecruiterJobs(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      jobs: any[];
      pagination: any;
    }>(`/recruiters/jobs?${params}`);
  }

  async updateJob(jobId: string, jobData: any) {
    return this.request<{
      message: string;
      job: any;
    }>(`/recruiters/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async getJobApplications(jobId: string, page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      applications: any[];
      pagination: any;
    }>(`/recruiters/jobs/${jobId}/applications?${params}`);
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return this.request<{
      message: string;
      application: any;
    }>(`/recruiters/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getRecruiterAnalytics() {
    return this.request<{
      totalJobs: number;
      totalApplications: number;
      acceptedApplications: number;
      recentActivity: any[];
    }>('/recruiters/analytics');
  }

  async getAlumniDashboard() {
    return this.request<{ user: any }>('/recruiters/alumni-dashboard');
  }

  // General endpoints
  async getVideos(page = 1, limit = 10, category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    return this.request<{
      videos: any[];
      pagination: any;
    }>(`/videos?${params}`);
  }

  async getVideo(id: string) {
    return this.request<{ video: any }>(`/videos/${id}`);
  }

  async likeVideo(id: string) {
    return this.request<{
      message: string;
      likes: number;
    }>(`/videos/${id}/like`, {
      method: 'POST',
    });
  }

  async getEvents(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request<{
      events: any[];
      pagination: any;
    }>(`/events?${params}`);
  }

  async getEvent(id: string) {
    return this.request<{ event: any }>(`/events/${id}`);
  }

  async registerForEvent(eventId: string) {
    return this.request<{
      message: string;
      registration: any;
    }>(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async cancelEventRegistration(eventId: string) {
    return this.request<{
      message: string;
    }>(`/events/${eventId}/register`, {
      method: 'DELETE',
    });
  }

  async getJobs(params: {
    skills?: string[];
    location?: string;
    jobType?: string;
    experience?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.skills) {
      params.skills.forEach(skill => searchParams.append('skills', skill));
    }
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'skills') {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      jobs: any[];
      pagination: any;
    }>(`/jobs?${searchParams}`);
  }

  async getJob(id: string) {
    return this.request<{ job: any }>(`/jobs/${id}`);
  }

  // Donation endpoints
  async createDonationOrder(orderData: any) {
    return this.request<{
      message: string;
      order: any;
      donation: any;
    }>('/donations/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(paymentData: any) {
    return this.request<{
      message: string;
      donation: any;
    }>('/donations/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getDonationHistory(page = 1, limit = 10) {
    return this.request<{
      donations: any[];
      totalDonated: number;
      pagination: any;
    }>(`/donations/history?page=${page}&limit=${limit}`);
  }

  async getDonationStatistics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return this.request<{
      totalDonations: number;
      totalAmount: number;
      donationsByPurpose: any[];
      recentDonations: any[];
    }>(`/donations/statistics?${params}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
