import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();

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
        title={t('stats.waitingForReview')}
        count={editorStats.waitingForReview}
        icon={Clock}
        variant="pending"
        onClick={() => handleStatClick('waiting-review')}
      />
      <StatCard
        title={t('stats.pendingReviewer')}
        count={editorStats.pendingReviewer}
        icon={UserCheck}
        variant="pending"
        onClick={() => handleStatClick('pending-reviewer')}
      />
      <StatCard
        title={t('stats.assignedReviewer')}
        count={editorStats.assignedReviewer}
        icon={Users}
        variant="review"
        onClick={() => handleStatClick('assigned-reviewer')}
      />
      <StatCard
        title={t('stats.waitingForDecision')}
        count={editorStats.waitingForDecision}
        icon={AlertCircle}
        variant="decision"
        onClick={() => handleStatClick('waiting-decision')}
      />
      <StatCard
        title={t('stats.completed')}
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
        title={t('stats.reviewInvitation')}
        count={reviewerStats.reviewInvitation}
        icon={Search}
        variant="pending"
        onClick={() => handleStatClick('review-invitation')}
      />
      <StatCard
        title={t('stats.waitingForReview')}
        count={reviewerStats.waitingForReview}
        icon={Clock}
        variant="review"
        onClick={() => handleStatClick('waiting-review')}
      />
      <StatCard
        title={t('stats.reviewCompleted')}
        count={reviewerStats.reviewCompleted}
        icon={FileCheck}
        variant="completed"
        onClick={() => handleStatClick('review-completed')}
      />
      <StatCard
        title={t('stats.rejected')}
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
              <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
              <p className="text-muted-foreground">
                {t('dashboard.welcome')
                  .replace('{username}', user.username)
                  .replace('{role}', user.role.toLowerCase())}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.statistics')}</h2>
              {user.role === 'Editor' ? renderEditorStats() : renderReviewerStats()}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.recentActivity')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.newSubmitted')}</span>
                    <span className="text-xs text-muted-foreground">{t('dashboard.hoursAgo').replace('{hours}', '2')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.reviewCompleted')}</span>
                    <span className="text-xs text-muted-foreground">{t('dashboard.dayAgo').replace('{days}', '1')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.decisionMade')}</span>
                    <span className="text-xs text-muted-foreground">{t('dashboard.daysAgo').replace('{days}', '3')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">{t('dashboard.viewAllManuscripts')}</div>
                    <div className="text-xs text-muted-foreground">{t('dashboard.browseManage')}</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">
                      {user.role === 'Editor' ? t('dashboard.assignReviewers') : t('dashboard.submitReview')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.role === 'Editor' 
                        ? t('dashboard.manageAssignments')
                        : t('dashboard.completePending')
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