import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Heart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export type StatusType = 'idle' | 'processing' | 'success' | 'error';

interface StatusMessageProps {
  status: StatusType;
  message?: string;
  className?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  message,
  className
}) => {
  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          variant: 'default' as const,
          bgClass: 'bg-secondary/50 border-secondary',
          message: message || "Just a moment… we're sorting your numbers with love! 💝"
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          variant: 'default' as const,
          bgClass: 'bg-accent/50 border-accent text-accent-foreground',
          message: message || "All set! Your organized ZIP is ready to download. Enjoy! 🎉"
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          variant: 'destructive' as const,
          bgClass: 'bg-destructive/10 border-destructive/30',
          message: message || "Oops! Something went wrong. Please check file format or retry. 🔄"
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <Alert
      variant={config.variant}
      className={cn(
        "animate-in fade-in-0 slide-in-from-top-2 duration-300",
        config.bgClass,
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {config.icon}
        {status === 'processing' && <Heart className="w-4 h-4 text-primary animate-pulse" />}
      </div>
      <AlertDescription className="font-medium">
        {config.message}
      </AlertDescription>
    </Alert>
  );
};