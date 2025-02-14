interface StatCardProps {
  title: string;
  value: number | string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-card p-4 rounded-lg text-center">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold text-primary mt-1">{value}</p>
    </div>
  );
} 