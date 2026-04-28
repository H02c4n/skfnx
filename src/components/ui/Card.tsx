import { cn } from '@/lib/utils';

export default function Card({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}