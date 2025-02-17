import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Tutorial } from '../types';
import { formatDate } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Link to={`/tutorials/${tutorial._id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{tutorial.title}</CardTitle>
          <CardDescription>{tutorial.description}</CardDescription>
          <div className="flex gap-2 mt-2">
            {tutorial.tags?.map(tag => (
              <span key={tag} className="bg-secondary px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}