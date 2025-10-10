import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          margin: '1rem'
        }}>
          <h2>Algo deu errado!</h2>
          <p>Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
