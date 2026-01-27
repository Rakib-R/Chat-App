'use client';

import React from 'react';

// Updated to include VALIDATION for CastError
type ErrorType = 'DUPLICATE' | 'NETWORK' | 'VALIDATION' | 'UNKNOWN';

interface State {
  hasError: boolean;
  errorType: ErrorType;
  errorMessage?: string;
}

class UploadErrorBoundaryInner extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  State
> {
  state: State = {
    hasError: false,
    errorType: 'UNKNOWN',
  };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : '';

    // 1. Check for Duplicate Errors (e.g., MongoDB E11000)
    if (message.includes('E11000') || message.toLowerCase().includes('duplicate')) {
      return { hasError: true, errorType: 'DUPLICATE' };
    }

    // 2. Check for CastError (Validation issues like wrong ID format)
    if (errorName === 'CastError' || message.includes('CastError')) {
      return { 
        hasError: true, 
        errorType: 'VALIDATION', 
        errorMessage: 'The provided data format is invalid.' 
      };
    }

    // 3. Check for Network or Fetch failures
    if (
      message.toLowerCase().includes('timeout') ||
      message.toLowerCase().includes('fetch') ||
      message.toLowerCase().includes('network')
    ) {
      return { hasError: true, errorType: 'NETWORK' };
    }

    // 4. Default Fallback
    return { hasError: true, errorType: 'UNKNOWN' };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // In 2026, it's best practice to log to a service like Sentry or LogRocket
    console.error('Upload Error Caught:', error, info);
  }

  handleReset = () => {
    // Clear state before calling the parent reset
    this.setState({ hasError: false, errorType: 'UNKNOWN', errorMessage: undefined });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 text-center">
          Look like you've encountered an error!
          <p className="text-sm text-red-600">
            {this.state.errorType === 'DUPLICATE' && 'This item already exists.'}
            {this.state.errorType === 'VALIDATION' && (this.state.errorMessage || 'Invalid data format.')}
            {this.state.errorType === 'NETWORK' && 'Network timeout. Please check your connection.'}
            {this.state.errorType === 'UNKNOWN' && 'An unexpected system error occurred.'}
          </p>

          <button
            onClick={this.handleReset}
            className="mt-2 rounded-md border border-red-300 bg-white px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 active:bg-red-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main Export: Wraps the boundary and manages the reset key 
 * to force-remount children on retry.
 */
export function UploadErrorBoundary({ children }: { children: React.ReactNode }) {
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <UploadErrorBoundaryInner
      key={resetKey}
      onReset={() => setResetKey((prev) => prev + 1)}
    >
      {children}
    </UploadErrorBoundaryInner>
  );
}
