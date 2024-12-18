import { useState } from 'react';
import { TypingTest } from '@/components/TypingTest';
import { TypingHistory } from '@/components/TypingHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';

export function TypingPage() {
  const [activeTab, setActiveTab] = useState('practice');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Typing Practice</h1>
        <p className="text-muted-foreground">
          Improve your typing speed and accuracy with interactive exercises
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typing Test</CardTitle>
              <CardDescription>
                Type the text below as quickly and accurately as you can
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypingTest onComplete={handleComplete} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Track your typing speed and accuracy over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypingHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                See how you compare with other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const handleComplete = async (stats: {
  wpm: number;
  accuracy: number;
  time: number;
  totalWords: number;
  errors: number;
}) => {
  try {
    await api.typing.saveResult(stats);
  } catch (error) {
    console.error('Failed to save typing result:', error);
  }
};
