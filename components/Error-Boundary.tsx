// components/error-boundary.tsx
'use client';

import React from 'react';

export class UploadErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorType: string | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorType: null };
  }

  static getDerivedStateFromError(error: any) {
    // Check for specific MongoDB/Network strings
    const msg = error.message || "";
    if (msg.includes("E11000")) return { hasError: true, errorType: "DUPLICATE" };
    if (msg.includes("timeout") || msg.includes("fetch")) return { hasError: true, errorType: "NETWORK" };
    return { hasError: true, errorType: "UNKNOWN" };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border h-100 flex flex-col justify-center items-center text-2xl border-red-200 bg-red-50 rounded-lg text-center">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-sm text-red-600">
            {this.state.errorType === "DUPLICATE" && "This account or file already exists."}
            {this.state.errorType === "NETWORK" && "Connection timed out. Please try again."}
            {this.state.errorType === "UNKNOWN" && "An unexpected error occurred."}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm cursor-pointer underline text-red-800 border-2 bg-amber-200 p-3 "
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}