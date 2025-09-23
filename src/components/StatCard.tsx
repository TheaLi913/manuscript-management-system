import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: 'pending' | 'review' | 'decision' | 'completed' | 'rejected';
  onClick?: () => void;
}

const variantClasses = {
  pending: 'bg-status-pending text-status-pending-foreground border-status-pending/20',
  review: 'bg-status-review text-status-review-foreground border-status-review/20',
  decision: 'bg-status-decision text-status-decision-foreground border-status-decision/20',
  completed: 'bg-status-completed text-status-completed-foreground border-status-completed/20',
  rejected: 'bg-status-rejected text-status-rejected-foreground border-status-rejected/20',
};

export function StatCard({ title, count, icon: Icon, variant, onClick }: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <Card 
      className={cn(
        'transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-md', variantClasses[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {count === 1 ? 'manuscript' : 'manuscripts'}
        </p>
      </CardContent>
    </Card>
  );
}