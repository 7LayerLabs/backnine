"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ErrorRecord {
  id: string;
  context: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  stack?: string;
  metadata?: string;
  createdAt: number;
  resolved: boolean;
  resolvedAt?: number;
}

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function AdminErrors() {
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedError, setSelectedError] = useState<ErrorRecord | null>(null);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      const res = await fetch("/api/admin/errors");
      const data = await res.json();
      setErrors(data.errors || []);
    } catch (err) {
      console.error("Failed to fetch errors:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleResolved = async (errorId: string, currentResolved: boolean) => {
    setUpdating(true);
    try {
      await fetch("/api/admin/errors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorId, resolved: !currentResolved }),
      });
      setErrors(errors.map(e =>
        e.id === errorId ? { ...e, resolved: !currentResolved, resolvedAt: !currentResolved ? Date.now() : undefined } : e
      ));
      if (selectedError?.id === errorId) {
        setSelectedError({ ...selectedError, resolved: !currentResolved });
      }
    } catch (err) {
      console.error("Failed to update error:", err);
    }
    setUpdating(false);
  };

  const deleteError = async (errorId: string) => {
    if (!confirm("Delete this error permanently?")) return;

    setUpdating(true);
    try {
      await fetch("/api/admin/errors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorId }),
      });
      setErrors(errors.filter(e => e.id !== errorId));
      if (selectedError?.id === errorId) {
        setSelectedError(null);
      }
    } catch (err) {
      console.error("Failed to delete error:", err);
    }
    setUpdating(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const parseMetadata = (metadata?: string): Record<string, unknown> | null => {
    if (!metadata) return null;
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  };

  const filteredErrors = errors
    .filter(e => {
      if (filter === "unresolved") return !e.resolved;
      if (filter === "resolved") return e.resolved;
      return true;
    })
    .sort((a, b) => {
      // Sort by severity first, then by date
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.createdAt - a.createdAt;
    });

  const unresolvedCount = errors.filter(e => !e.resolved).length;
  const criticalCount = errors.filter(e => !e.resolved && e.severity === "critical").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-600">Loading errors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Error Log</h1>
            <div className="flex gap-4 mt-2 text-sm">
              {criticalCount > 0 && (
                <span className="text-red-600 font-medium">{criticalCount} critical</span>
              )}
              <span className="text-stone-500">{unresolvedCount} unresolved</span>
              <span className="text-stone-400">{errors.length} total</span>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            &larr; Back to Orders
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["unresolved", "all", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Errors List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-stone-500">
                  {filter === "unresolved" ? "No unresolved errors" : "No errors found"}
                </p>
              </div>
            ) : (
              filteredErrors.map((error) => (
                <div
                  key={error.id}
                  onClick={() => setSelectedError(error)}
                  className={`bg-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedError?.id === error.id ? "ring-2 ring-stone-900" : ""
                  } ${error.resolved ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          severityColors[error.severity]
                        }`}
                      >
                        {error.severity}
                      </span>
                      <span className="text-sm font-medium text-stone-700">
                        {error.context}
                      </span>
                    </div>
                    {error.resolved && (
                      <span className="text-xs text-emerald-600 font-medium">Resolved</span>
                    )}
                  </div>

                  <p className="text-sm text-stone-800 line-clamp-2 mb-2">
                    {error.message}
                  </p>

                  <p className="text-xs text-stone-400">
                    {formatDate(error.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Error Details Panel */}
          <div className="lg:col-span-1">
            {selectedError ? (
              <div className="bg-white rounded-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-900">Details</h2>
                  <button
                    onClick={() => setSelectedError(null)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Severity & Context */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        severityColors[selectedError.severity]
                      }`}
                    >
                      {selectedError.severity}
                    </span>
                    <span className="text-sm text-stone-600">{selectedError.context}</span>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Error</p>
                    <p className="text-sm text-stone-800 bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {selectedError.message}
                    </p>
                  </div>

                  {/* Metadata */}
                  {selectedError.metadata && (
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Context</p>
                      <pre className="text-xs bg-stone-50 p-3 rounded overflow-x-auto">
                        {JSON.stringify(parseMetadata(selectedError.metadata), null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Stack Trace */}
                  {selectedError.stack && (
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Stack Trace</p>
                      <pre className="text-xs bg-stone-900 text-stone-300 p-3 rounded overflow-x-auto max-h-48">
                        {selectedError.stack}
                      </pre>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-xs text-stone-400 pt-2 border-t border-stone-100">
                    <p>Occurred: {formatDate(selectedError.createdAt)}</p>
                    {selectedError.resolvedAt && (
                      <p>Resolved: {formatDate(selectedError.resolvedAt)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => toggleResolved(selectedError.id, selectedError.resolved)}
                      disabled={updating}
                      className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                        selectedError.resolved
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {selectedError.resolved ? "Reopen" : "Mark Resolved"}
                    </button>
                    <button
                      onClick={() => deleteError(selectedError.id)}
                      disabled={updating}
                      className="px-4 py-2 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-stone-500">Select an error to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
