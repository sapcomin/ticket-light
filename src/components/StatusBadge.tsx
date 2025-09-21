import { cn } from "@/lib/utils";
import { TicketStatus } from "@/types/ticket";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          className: 'bg-status-open text-status-open-foreground border-status-open-foreground/20'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          className: 'bg-status-progress text-status-progress-foreground border-status-progress-foreground/20'
        };
      case 'closed':
        return {
          label: 'Closed',
          className: 'bg-status-closed text-status-closed-foreground border-status-closed-foreground/20'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}