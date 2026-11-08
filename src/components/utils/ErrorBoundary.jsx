import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // SAFE ERROR LOGGING - FIX THE [object Object] ISSUE
    try {
      console.error('🚨 APPLICATION ERROR:', {
        errorId,
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        errorInfo: errorInfo?.componentStack || 'No component stack',
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
      });

      // Check if we're in development mode SAFELY
      const isDevelopment = typeof window !== 'undefined' && 
                           (window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname.startsWith('192.168.'));

      // In production, send to error tracking service
      if (!isDevelopment) {
        this.reportError(error, errorInfo, errorId);
      }
    } catch (loggingError) {
      console.error('Error in error logging:', loggingError.message);
    }
  }

  reportError = async (error, errorInfo, errorId) => {
    try {
      // SAFE ERROR REPORTING
      const errorReport = {
        errorId,
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        componentStack: errorInfo?.componentStack || 'No component stack',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      };

      // In production, send to your error tracking service
      console.log('Error reported:', JSON.stringify(errorReport, null, 2));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError.message);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = '#/';
      this.handleReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // SAFE DEVELOPMENT MODE CHECK
      const isDevelopment = typeof window !== 'undefined' && 
                           (window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname.startsWith('192.168.'));

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-red-500 bg-red-900/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-red-200">Oops! Something went wrong</CardTitle>
              <p className="text-red-300/80 text-sm">
                Don't worry, our team has been automatically notified.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <p className="text-gray-300 text-sm">
                  <strong>Error ID:</strong> {this.state.errorId || 'Unknown'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Please include this ID when contacting support.
                </p>
              </div>

              {isDevelopment && this.state.error && (
                <details className="bg-gray-800 p-3 rounded border border-gray-700">
                  <summary className="text-gray-300 text-sm cursor-pointer">
                    Technical Details (Development Mode)
                  </summary>
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    <p><strong>Error:</strong> {this.state.error.message || 'Unknown error'}</p>
                    {this.state.error.stack && (
                      <pre className="mt-2 overflow-auto max-h-32 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 overflow-auto max-h-32 whitespace-pre-wrap">
                        Component Stack: {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline" 
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;