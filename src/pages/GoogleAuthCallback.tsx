import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setSession } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get token and user data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');

        if (token && userData) {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Store token in localStorage and update apiClient
        localStorage.setItem('jwt_token', token);
        apiClient.setToken(token);
          
          // Set user in auth context
          setUser(user);
          setSession(null); // Google auth doesn't provide a Supabase session
          
          // Navigate to appropriate dashboard based on user role
          const userRole = user.role?.toLowerCase();
          if (userRole && ['student', 'alumni', 'college', 'university', 'recruiter'].includes(userRole)) {
            navigate(`/dashboard/${userRole}`);
          } else {
            // Default to student dashboard if role is not recognized
            navigate('/dashboard/student');
          }
        } else {
          // Handle error case
          console.error('Missing token or user data in Google callback');
          navigate('/login?error=google_auth_failed');
        }
      } catch (error) {
        console.error('Google authentication callback error:', error);
        navigate('/login?error=google_auth_failed');
      }
    };

    handleGoogleCallback();
  }, [navigate, setUser, setSession]);

  return (
    <div className="min-h-screen bg-gradient-login flex items-center justify-center p-4">
      <Card className="bg-white/95 backdrop-blur-sm shadow-hero">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Completing Google Login</CardTitle>
          <CardDescription>Please wait while we authenticate you...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Authenticating...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;