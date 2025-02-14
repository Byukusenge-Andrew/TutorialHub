
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link} from 'react-router-dom';
import { 
  User, Settings, BookOpen, Timer, Code2, 
  Keyboard, BookOpenCheck, BrainCircuit 
} from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Profile and Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Link to={"/profile"}>
            <Button variant="outline" className="w-full" 
            
            >
              <Settings className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            </Link>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tutorials Completed</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Timer className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. WPM</p>
                <h3 className="text-2xl font-bold">65</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DSA Solved</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/typing">
          <Card className="p-6 hover:border-primary transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Keyboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Practice Typing</h3>
                <p className="text-sm text-muted-foreground">
                  Improve your typing speed and accuracy with interactive exercises
                </p>
              </div>
              <Button variant="outline" size="sm"
              >
                Start Practice
              </Button>
            </div>
          </Card>
        </Link>

        <Link to="/tutorials">
          <Card className="p-6 hover:border-primary transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                <BookOpenCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Continue Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off in your tutorials
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Tutorials
              </Button>
            </div>
          </Card>
        </Link>

        <Link to="/dsa">
          <Card className="p-6 hover:border-primary transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">DSA Challenges</h3>
                <p className="text-sm text-muted-foreground">
                  Test your skills with coding challenges
                </p>
              </div>
              <Button variant={'outline'} size="sm" >
                Solve Challenges
              </Button>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
        </div>
      </Card>
    </div>
  );
}