import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Server, RotateCcw, HelpCircle } from 'lucide-react';
import { getApiBase, setApiBase } from '../services/api';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  customEndpoint: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    customEndpoint: getApiBase()
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      customEndpoint: getApiBase()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an unhandled exception]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.removeItem('coop_api_endpoint');
      localStorage.removeItem('mayap_theme');
      localStorage.removeItem('mayap_large_text');
      localStorage.removeItem('mayap_sidebar_collapsed');
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  private handleSwitchEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.customEndpoint.trim()) {
      setApiBase(this.state.customEndpoint.trim());
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-rose-500/30">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Application Initialization Notice</h2>
                <p className="text-sm text-slate-400 mt-1">
                  CoopFlex encountered an unhandled issue while rendering or communicating with the API backend.
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-rose-300 overflow-x-auto max-h-40">
              <p className="font-bold">{this.state.error?.name || 'Error'}: {this.state.error?.message || 'Unknown runtime error'}</p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-slate-400 mt-2 whitespace-pre-wrap">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            {/* API Endpoint Configuration */}
            <form onSubmit={this.handleSwitchEndpoint} className="space-y-3 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target API Endpoint</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Active: {getApiBase()}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={this.state.customEndpoint}
                  onChange={(e) => this.setState({ customEndpoint: e.target.value })}
                  placeholder="e.g. http://cooperative-api.test/api"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Save & Reload
                </button>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Quick switch:</span>
                <button
                  type="button"
                  onClick={() => {
                    setApiBase('http://cooperative-api.test/api');
                    window.location.reload();
                  }}
                  className="text-emerald-400 hover:underline cursor-pointer font-mono"
                >
                  http://cooperative-api.test/api
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => {
                    setApiBase('/api');
                    window.location.reload();
                  }}
                  className="text-blue-400 hover:underline cursor-pointer font-mono"
                >
                  /api (Internal)
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-1/2 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleResetStorage}
                className="w-full sm:w-1/2 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset Local Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
