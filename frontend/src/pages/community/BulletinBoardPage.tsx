import React, { useState } from 'react';
import { MessageSquare, Heart, Pin, Plus, Search, Megaphone, Calendar, BookOpen, Star, Users, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';
import { timeAgo } from '../../utils/dateUtils';
import type { BulletinPost } from '../../types';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_POSTS: BulletinPost[] = [
  {
    postId: '1', title: 'Community Cleanup Drive – Gasabo District',
    content: 'Join us this Saturday for a big community cleanup! We need 50 volunteers to help clean the streets of Gasabo. Gloves and bags will be provided. Let\'s make our community shine! 🌟',
    category: 'EVENT', author: { userId: 101, name: 'Amina Uwase', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '2026-02-20', location: { locationId: 1, province: 'Kigali', district: 'Gasabo', provinceCode: 'KGL' } },
    createdAt: '2026-03-01T08:00:00Z', likes: 34, comments: 12, isPinned: true, tags: ['cleanup', 'gasabo', 'community'],
  },
  {
    postId: '2', title: 'Success Story: 100 Groceries Delivered! 🎉',
    content: 'I am so proud to share that our team of 8 volunteers just completed 100 grocery deliveries to elderly residents in Kicukiro. Every delivery was a smile. Thank you all for your dedication!',
    category: 'SUCCESS_STORY', author: { userId: 102, name: 'Jean Habimana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '2026-01-15', location: { locationId: 2, province: 'Kigali', district: 'Kicukiro', provinceCode: 'KGL' } },
    createdAt: '2026-02-28T14:30:00Z', likes: 67, comments: 23, isPinned: true, tags: ['success', 'groceries', 'elderly'],
  },
  {
    postId: '3', title: 'Free Technology Training Workshop – March 15',
    content: 'Are you a volunteer who wants to better help citizens with their tech problems? Join our free workshop covering: smartphone basics, internet safety, and common app troubleshooting. Register by March 10.',
    category: 'ANNOUNCEMENT', author: { userId: 103, name: 'Marie Mukamana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '2026-01-10', location: { locationId: 3, province: 'Northern', district: 'Musanze', provinceCode: 'N' } },
    createdAt: '2026-02-27T10:00:00Z', likes: 28, comments: 8, tags: ['training', 'technology', 'workshop'],
  },
  {
    postId: '4', title: 'Resource: Best Practices for Transportation Help',
    content: 'I\'ve compiled a guide on how to safely and efficiently help citizens with transportation needs. It covers route planning, communication, and safety tips. Feel free to share with other volunteers!',
    category: 'RESOURCE', author: { userId: 104, name: 'Patrick Niyonzima', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '2026-01-20', location: { locationId: 4, province: 'Southern', district: 'Huye', provinceCode: 'S' } },
    createdAt: '2026-02-25T16:00:00Z', likes: 19, comments: 5, tags: ['transportation', 'guide', 'safety'],
  },
  {
    postId: '5', title: 'Discussion: How do you handle difficult requests?',
    content: 'I recently had a citizen request that was quite emotionally challenging. I\'d love to hear from other volunteers: how do you handle these situations? What self-care do you practice after difficult assignments?',
    category: 'DISCUSSION', author: { userId: 105, name: 'Claudine Ingabire', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '2026-02-01', location: { locationId: 5, province: 'Eastern', district: 'Rwamagana', provinceCode: 'E' } },
    createdAt: '2026-02-24T09:00:00Z', likes: 45, comments: 31, tags: ['mental-health', 'support', 'discussion'],
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; border: string }> = {
  ANNOUNCEMENT:  { label: 'Announcement',  icon: Megaphone,     bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-700/40' },
  EVENT:         { label: 'Event',          icon: Calendar,      bg: 'bg-purple-100 dark:bg-purple-900/30',text: 'text-purple-700 dark:text-purple-400',border: 'border-purple-200 dark:border-purple-700/40' },
  RESOURCE:      { label: 'Resource',       icon: BookOpen,      bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400',  border: 'border-green-200 dark:border-green-700/40' },
  SUCCESS_STORY: { label: 'Success Story',  icon: Star,          bg: 'bg-yellow-100 dark:bg-yellow-900/30',text: 'text-yellow-700 dark:text-yellow-400',border: 'border-yellow-200 dark:border-yellow-700/40' },
  DISCUSSION:    { label: 'Discussion',     icon: MessageSquare, bg: 'bg-orange-100 dark:bg-orange-900/30',text: 'text-orange-700 dark:text-orange-400',border: 'border-orange-200 dark:border-orange-700/40' },
};

const PostCard: React.FC<{
  post: BulletinPost;
  liked: boolean;
  onLike: () => void;
}> = ({ post, liked, onLike }) => {
  const cfg = CATEGORY_CONFIG[post.category] ?? CATEGORY_CONFIG.DISCUSSION;
  const Icon = cfg.icon;
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 200;

  return (
    <article className={`bg-white dark:bg-slate-800 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-soft overflow-hidden ${post.isPinned ? 'border-primary-200 dark:border-primary-700/40' : 'border-neutral-200 dark:border-slate-700/60'}`}>
      {/* Pin indicator */}
      {post.isPinned && (
        <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-1.5 flex items-center gap-1.5 border-b border-primary-100 dark:border-primary-700/30">
          <Pin className="w-3 h-3 text-primary-500" />
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">Pinned Post</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{post.author.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{post.author.name}</p>
            <p className="text-xs text-neutral-500 dark:text-slate-400">{timeAgo(post.createdAt)}</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-slate-400 leading-relaxed">
          {isLong && !expanded ? `${post.content.slice(0, 200)}…` : post.content}
        </p>
        {isLong && (
          <button onClick={() => setExpanded((p) => !p)} className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-1 hover:underline">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-slate-700 text-neutral-500 dark:text-slate-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-100 dark:border-slate-700">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-110 active:scale-95 ${liked ? 'text-red-500' : 'text-neutral-500 dark:text-slate-400 hover:text-red-400'}`}
          >
            <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-current' : ''}`} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Create Post Modal ────────────────────────────────────────────────────────
const CreatePostModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [category, setCategory] = useState('DISCUSSION');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft-lg w-full max-w-lg animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-slate-700">
          <h2 className="font-display font-bold text-gray-900 dark:text-slate-100">New Post</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-neutral-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-sm">
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a title…" className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts, resources, or announcements…" rows={5} className="input-field text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 dark:border-slate-600 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button
              disabled={!title.trim() || !content.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-bold rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const BulletinBoardPage: React.FC = () => {
  const { user } = useAuth();
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [likedPosts,   setLikedPosts]   = useState<Set<string>>(new Set());
  const [showCreate,   setShowCreate]   = useState(false);

  const filters = ['ALL', ...Object.keys(CATEGORY_CONFIG)];

  const filtered = MOCK_POSTS.filter((p) => {
    const matchFilter = activeFilter === 'ALL' || p.category === activeFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumb />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600 text-white shadow-soft-lg p-6">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <h1 className="font-display text-xl font-extrabold">Community Board</h1>
            </div>
            <p className="text-white/70 text-sm">Share stories, resources, and announcements with the community.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-white text-primary-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-50 hover:scale-105 transition-all flex-shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />New Post
          </button>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 input-field text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => {
            const cfg = f !== 'ALL' ? CATEGORY_CONFIG[f] : null;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  activeFilter === f
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400 hover:border-primary-300'
                }`}
              >
                {f === 'ALL' ? 'All Posts' : cfg?.label ?? f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-1">No posts found</h3>
            <p className="text-sm text-neutral-500 dark:text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filtered.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              liked={likedPosts.has(post.postId)}
              onLike={() => toggleLike(post.postId)}
            />
          ))
        )}
      </div>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default BulletinBoardPage;
