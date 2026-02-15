import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mb-8 max-w-md text-gray-500">
            We apologize for the inconvenience. Our team has been notified.
            Please try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="primary"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 w-full max-w-2xl overflow-auto rounded-lg bg-gray-900 p-4 text-left text-xs text-red-400">
              <code>{this.state.error?.toString()}</code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}