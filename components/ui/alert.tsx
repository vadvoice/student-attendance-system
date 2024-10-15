// following components Alert, AlertDescription, AlertTitle are missing in the library

import * as React from 'react';
import { cn } from '@/lib/utils';

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'success' | 'error' | 'warning' | 'info';
};

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ className, variant, ...props }, ref) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'info':
        return 'blue';
      default:
        return '';
    }
  };
  const color = getColor(variant || 'info');
  const borderColor = color ? `bg-${color}-400` : '';
  console.log(borderColor);
  return <div ref={ref} className={cn('border rounded-md p-4', className, borderColor)} {...props} />;
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm', className)} {...props} />
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
