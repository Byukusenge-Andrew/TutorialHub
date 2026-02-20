import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const DIFF_STYLES: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const diffClass = tutorial.difficulty ? (DIFF_STYLES[tutorial.difficulty.toLowerCase()] || 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground';

  return (
    <Link to={`/tutorials/${tutorial._id}`} className="group block h-full">
      <div className="h-full bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
        {/* Top labels */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full truncate">
            {tutorial.category || 'General'}
          </span>
          {tutorial.difficulty && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${diffClass}`}>
              {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {tutorial.title}
        </h3>

        {/* Description */}
        {tutorial.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {tutorial.description}
          </p>
        )}

        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tutorial.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
            {tutorial.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{tutorial.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 text-primary text-xs font-medium mt-auto pt-2">
          <BookOpen className="h-3.5 w-3.5" />
          Read Tutorial
          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}