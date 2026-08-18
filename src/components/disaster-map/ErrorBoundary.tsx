import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class DisasterMapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DisasterMap Error caught:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full w-full min-h-[350px] flex items-center justify-center bg-gray-50/80 p-4 rounded-xl">
          <Card className="max-w-md w-full mx-auto shadow-lg border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-7 w-7 text-orange-600" />
              </div>
              
              <h3 className="text-base font-bold text-gray-900 mb-1">
                เกิดข้อผิดพลาดในระบบแผนที่
              </h3>
              
              <p className="text-xs text-gray-600 mb-4">
                เกิดข้อผิดพลาดในการโหลดข้อมูลแผนที่ กรุณากดปุ่มเพื่อโหลดใหม่อีกครั้ง
              </p>

              {this.state.error && (
                <div className="mb-4 text-left bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <div className="text-[11px] font-semibold text-red-800 mb-1">
                    ข้อผิดพลาด: {this.state.error.name || 'Error'}
                  </div>
                  <pre className="text-[10px] text-red-600 font-mono overflow-auto max-h-20 whitespace-pre-wrap">
                    {this.state.error.message || this.state.error.toString()}
                  </pre>
                </div>
              )}

              <div className="flex space-x-2 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1.5 text-xs h-8"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>ลองใหม่</span>
                </Button>
                
                <Button
                  onClick={() => window.location.reload()}
                  size="sm"
                  className="flex items-center space-x-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>รีเฟรชหน้า</span>
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
