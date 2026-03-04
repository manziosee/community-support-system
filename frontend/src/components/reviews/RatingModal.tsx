import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import StarRating from '../common/StarRating';
import type { Assignment } from '../../types';
import toast from 'react-hot-toast';

interface RatingModalProps {
  assignment: Assignment;
  onClose: () => void;
  onSubmit: (score: number, review: string) => Promise<void>;
}

const RatingModal: React.FC<RatingModalProps> = ({ assignment, onClose, onSubmit }) => {
  const [score,   setScore]   = useState(0);
  const [review,  setReview]  = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_REVIEWS = [
    'Very helpful and punctual!',
    'Excellent service, highly recommend!',
    'Friendly and professional',
    'Got the job done perfectly',
    'Would request again!',
  ];

  const handleSubmit = async () => {
    if (score === 0) { toast.error('Please select a rating'); return; }
    try {
      setLoading(true);
      await onSubmit(score, review);
      toast.success('Thank you for your feedback! 🎉');
      onClose();
    } catch {
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreLabel = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][score] ?? '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft-lg w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-slate-700">
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-slate-100">Rate Your Experience</h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Help us recognize great volunteers
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-neutral-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Volunteer Info */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{assignment.volunteer.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{assignment.volunteer.name}</p>
              <p className="text-xs text-neutral-500 dark:text-slate-400 truncate">{assignment.request?.title}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">How was your experience?</p>
            <div className="flex justify-center">
              <StarRating value={score} onChange={setScore} size="lg" max={5} />
            </div>
            {score > 0 && (
              <p className={`text-sm font-bold mt-2 transition-all ${
                score >= 4 ? 'text-green-600 dark:text-green-400' :
                score >= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {scoreLabel}
              </p>
            )}
          </div>

          {/* Quick Reviews */}
          {score >= 4 && (
            <div>
              <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-2">Quick Review</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REVIEWS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setReview(q)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                      review === q
                        ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'border-neutral-200 dark:border-slate-600 text-neutral-600 dark:text-slate-400 hover:border-primary-300 hover:text-primary-600'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Review Text */}
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">
              Written Review <span className="text-neutral-400 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this volunteer…"
              rows={3}
              className="w-full input-field text-sm resize-none"
              maxLength={500}
            />
            <p className="text-xs text-neutral-400 dark:text-slate-500 text-right mt-1">{review.length}/500</p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || score === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Send className="w-4 h-4" />Submit Rating</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
