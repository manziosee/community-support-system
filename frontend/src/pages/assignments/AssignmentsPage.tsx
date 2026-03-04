import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Clock, CheckCircle, User, MapPin, Phone, Eye,
  Download, Filter, Award, Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi } from '../../services/api';
import type { Assignment } from '../../types';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/exportUtils';

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const response = await assignmentsApi.getByVolunteer(user.userId);
        setAssignments(response.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);

  useEffect(() => {
    let filtered = assignments;
    if (statusFilter === 'ACTIVE') filtered = filtered.filter((a) => !a.completedAt);
    else if (statusFilter === 'COMPLETED') filtered = filtered.filter((a) => a.completedAt);
    setFilteredAssignments(filtered);
    setStats({
      total: assignments.length,
      active: assignments.filter((a) => !a.completedAt).length,
      completed: assignments.filter((a) => a.completedAt).length,
    });
  }, [assignments, statusFilter]);

  const handleCompleteAssignment = async (assignmentId: number) => {
    try {
      await assignmentsApi.complete(assignmentId);
      const now = new Date().toISOString();
      setAssignments((prev) =>
        prev.map((a) => (a.assignmentId === assignmentId ? { ...a, completedAt: now } : a))
      );
    } catch (error) {
      console.error('Failed to complete assignment:', error);
    }
  };

  const handleExport = () => {
    const rows = filteredAssignments.map((a) => ({
      ID: a.assignmentId,
      Title: a.request?.title ?? '',
      Citizen: a.request?.citizen?.name ?? '',
      Phone: a.request?.citizen?.phoneNumber ?? '',
      District: a.request?.citizen?.location?.district ?? '',
      Province: a.request?.citizen?.location?.province ?? '',
      Status: a.completedAt ? 'Completed' : 'Active',
      'Accepted At': new Date(a.acceptedAt).toLocaleDateString(),
      'Completed At': a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '',
    }));
    exportToCSV(rows as Record<string, unknown>[], 'assignments');
  };

  const duration = (acceptedAt: string, completedAt?: string) => {
    const ms = (completedAt ? new Date(completedAt) : new Date()).getTime() - new Date(acceptedAt).getTime();
    const h = Math.floor(ms / 3_600_000);
    return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading your assignments…" />;

  const filterBtns = [
    { key: 'ALL', label: 'All', count: stats.total, active: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200' },
    { key: 'ACTIVE', label: 'Active', count: stats.active, active: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200' },
    { key: 'COMPLETED', label: 'Completed', count: stats.completed, active: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' },
  ];

  const statItems = [
    { label: 'Total Assignments', value: stats.total,     icon: CheckSquare, bg: 'bg-primary-50 dark:bg-primary-900/20',  iconColor: 'text-primary-600 dark:text-primary-400' },
    { label: 'Active',            value: stats.active,    icon: Clock,       bg: 'bg-orange-50 dark:bg-orange-900/20',    iconColor: 'text-orange-600 dark:text-orange-400' },
    { label: 'Completed',         value: stats.completed, icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20',      iconColor: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Assignments</h1>
          <p className="text-sm text-neutral-500 dark:text-slate-400 mt-0.5">
            Track your volunteer work and help requests
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          icon={Download}
          onClick={handleExport}
          disabled={filteredAssignments.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5 flex items-center gap-4 shadow-sm hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-4 flex items-center gap-3 flex-wrap shadow-sm">
        <Filter className="w-4 h-4 text-neutral-400 dark:text-slate-500 flex-shrink-0" />
        {filterBtns.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setStatusFilter(btn.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              statusFilter === btn.key
                ? btn.active
                : 'bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-600'
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {/* ── Assignments List ────────────────────────────────── */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm">
            <EmptyState
              icon={CheckSquare}
              title="No assignments found"
              description={`No ${statusFilter.toLowerCase() === 'all' ? '' : statusFilter.toLowerCase() + ' '}assignments yet.`}
            />
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.assignmentId}
              className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm hover:shadow-soft hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-200"
            >
              <div className="p-5">
                {/* Card header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      assignment.completedAt
                        ? 'bg-green-50 dark:bg-green-900/30'
                        : 'bg-orange-50 dark:bg-orange-900/30'
                    }`}>
                      {assignment.completedAt
                        ? <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                        : <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {assignment.request?.title || 'Assignment'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Accepted {new Date(assignment.acceptedAt).toLocaleDateString()}
                        {assignment.completedAt
                          ? ` · Completed ${new Date(assignment.completedAt).toLocaleDateString()}`
                          : ` · ${duration(assignment.acceptedAt)} ongoing`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                    {assignment.completedAt ? 'Completed' : 'Active'}
                  </Badge>
                </div>

                {/* Description */}
                {assignment.request?.description && (
                  <p className="text-sm text-neutral-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-2">
                    {assignment.request.description}
                  </p>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Citizen contact */}
                  <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wide mb-3">
                      Citizen Contact
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                        <span className="font-medium">{assignment.request?.citizen?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                        <span>{assignment.request?.citizen?.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                        <span>
                          {assignment.request?.citizen?.location?.district},{' '}
                          {assignment.request?.citizen?.location?.province}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wide mb-3">
                      Timeline
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary-400 flex-shrink-0" />
                        <span><span className="font-medium">Accepted:</span> {new Date(assignment.acceptedAt).toLocaleDateString()}</span>
                      </div>
                      {assignment.completedAt ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                          <span><span className="font-medium">Completed:</span> {new Date(assignment.completedAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
                          <span className="text-orange-600 dark:text-orange-400">
                            <span className="font-medium">In progress:</span> {duration(assignment.acceptedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-slate-700">
                  <Link to={`/assignments/${assignment.assignmentId}`}>
                    <Button type="button" variant="secondary" icon={Eye} size="sm">
                      View Details
                    </Button>
                  </Link>
                  {!assignment.completedAt && (
                    <Button
                      type="button"
                      variant="success"
                      icon={CheckCircle}
                      size="sm"
                      onClick={() => handleCompleteAssignment(assignment.assignmentId)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
