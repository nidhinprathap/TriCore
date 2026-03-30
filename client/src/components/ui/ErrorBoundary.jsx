import { Component } from 'react';
import Button from './Button.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-tc-bg flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-extrabold text-tc-primary mb-4">Oops</h1>
            <p className="text-tc-muted mb-6">Something went wrong. Please try refreshing the page.</p>
            <Button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
