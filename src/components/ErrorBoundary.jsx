import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Three.js Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffdddd', 
          border: '1px solid #ff0000',
          borderRadius: '5px',
          margin: '20px',
          color: '#333'
        }}>
          <h2>Something went wrong with the 3D scene</h2>
          <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
            <summary>Show Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 