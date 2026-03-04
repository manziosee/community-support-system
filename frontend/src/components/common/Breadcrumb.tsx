import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// ─── Route label map ──────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  dashboard:    'Dashboard',
  requests:     'Requests',
  create:       'Create',
  available:    'Available',
  assignments:  'Assignments',
  notifications:'Notifications',
  profile:      'Profile',
  settings:     'Settings',
  skills:       'My Skills',
  admin:        'Admin',
  users:        'Users',
  analytics:    'Analytics',
  locations:    'Locations',
  reports:      'Reports',
  leaderboard:  'Leaderboard',
  community:    'Community',
  bulletin:     'Bulletin Board',
  availability: 'Availability',
  achievements: 'Achievements',
  volunteer:    'Volunteer',
  scheduling:   'Schedule',
  edit:         'Edit',
};

function buildCrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; to: string; isId: boolean }[] = [];

  let path = '';
  for (const part of parts) {
    path += `/${part}`;
    const isId = /^\d+$/.test(part);
    const label = isId ? `#${part}` : (ROUTE_LABELS[part] ?? part.charAt(0).toUpperCase() + part.slice(1));
    crumbs.push({ label, to: path, isId });
  }
  return crumbs;
}

interface BreadcrumbProps {
  className?: string;
  custom?: { label: string; to?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '', custom }) => {
  const { pathname } = useLocation();
  const crumbs = custom
    ? custom.map((c, i) => ({ label: c.label, to: c.to ?? '#', isId: false }))
    : buildCrumbs(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm mb-4 ${className}`}>
      <Link
        to="/dashboard"
        className="flex items-center text-neutral-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.to}>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-slate-600 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-gray-800 dark:text-slate-200 truncate max-w-[160px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-neutral-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[120px]"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
