import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Clock, Search, CheckCircle, XCircle, AlertCircle, FileCheck, UserCheck, Users } from 'lucide-react';

// Mock data for demonstration
const editorStats = {
  waitingForReview: 12,
  pendingReviewer: 8,
  assignedReviewer: 15,
  waitingForDecision: 6,
  completed: 45,
};

const reviewerStats = {
  reviewInvitation: 3,
  waitingForReview: 5,
  reviewCompleted: 18,
  rejected: 2,
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleStatClick = (type: string) => {
    // Navigate to manuscript list page (to be implemented)
    console.log(`Navigate to ${type} manuscripts`);
  };

  const renderEditorStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Waiting for Review"
        count={editorStats.waitingForReview}
        icon={Clock}
        variant="pending"
        onClick={() => handleStatClick('waiting-review')}
      />
      <StatCard
        title="Pending Reviewer"
        count={editorStats.pendingReviewer}
        icon={UserCheck}
        variant="pending"
        onClick={() => handleStatClick('pending-reviewer')}
      />
      <StatCard
        title="Assigned Reviewer"
        count={editorStats.assignedReviewer}
        icon={Users}
        variant="review"
        onClick={() => handleStatClick('assigned-reviewer')}
      />
      <StatCard
        title="Waiting for Decision"
        count={editorStats.waitingForDecision}
        icon={AlertCircle}
        variant="decision"
        onClick={() => handleStatClick('waiting-decision')}
      />
      <StatCard
        title="Completed"
        count={editorStats.completed}
        icon={CheckCircle}
        variant="completed"
        onClick={() => handleStatClick('completed')}
      />
    </div>
  );

  const renderReviewerStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Review Invitation"
        count={reviewerStats.reviewInvitation}
        icon={Search}
        variant="pending"
        onClick={() => handleStatClick('review-invitation')}
      />
      <StatCard
        title="Waiting for Review"
        count={reviewerStats.waitingForReview}
        icon={Clock}
        variant="review"
        onClick={() => handleStatClick('waiting-review')}
      />
      <StatCard
        title="Review Completed"
        count={reviewerStats.reviewCompleted}
        icon={FileCheck}
        variant="completed"
        onClick={() => handleStatClick('review-completed')}
      />
      <StatCard
        title="Rejected"
        count={reviewerStats.rejected}
        icon={XCircle}
        variant="rejected"
        onClick={() => handleStatClick('rejected')}
      />
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.username}. Here's an overview of your {user.role.toLowerCase()} activities.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Manuscript Statistics</h2>
              {user.role === 'Editor' ? renderEditorStats() : renderReviewerStats()}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New manuscript submitted</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Review completed for MS-2024-001</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Decision made on MS-2024-003</span>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">View All Manuscripts</div>
                    <div className="text-xs text-muted-foreground">Browse and manage submissions</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">
                      {user.role === 'Editor' ? 'Assign Reviewers' : 'Submit Review'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.role === 'Editor' 
                        ? 'Manage reviewer assignments' 
                        : 'Complete pending reviews'
                      }
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;