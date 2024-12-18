import { useTypingStore } from '@/store/typing-store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TypingHistory() {
  const { history } = useTypingStore();

  const chartData = [...history]
    .reverse()
    .map((stat, index) => ({
      attempt: index + 1,
      wpm: stat.wpm,
      accuracy: stat.accuracy
    }));

  return (
    <div className="space-y-8">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="attempt" 
              label={{ value: 'Attempts', position: 'bottom' }}
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wpm"
              name="WPM"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Accuracy %"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attempt</TableHead>
            <TableHead>WPM</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...history].reverse().map((stat, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{stat.wpm}</TableCell>
              <TableCell>{stat.accuracy}%</TableCell>
              <TableCell>{stat.time}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 