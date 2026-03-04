import React from 'react';
import { HandHeart, Users } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, variant = 'default' }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-base', subtext: 'text-xs' },
    md: { icon: 'w-10 h-10', text: 'text-xl', subtext: 'text-sm' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-base' },
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900 dark:text-slate-100';
  const subtextColor = variant === 'white' ? 'text-white/70' : 'text-neutral-500 dark:text-slate-400';

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className={`${sizes[size].icon} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-md`}>
          <HandHeart className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
        </div>
        <div className={`absolute -bottom-1 -right-1 ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border-2 border-primary-400`}>
          <Users className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-primary-600`} />
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={`${sizes[size].text} font-display font-bold ${textColor} leading-tight`}>Community</h1>
          <p className={`${sizes[size].subtext} ${subtextColor} leading-tight font-medium`}>Support System</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
