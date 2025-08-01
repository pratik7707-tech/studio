import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  valueClassName?: string;
}

export function MetricCard({ title, value, icon: Icon, description, valueClassName }: MetricCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body text-gray-500">{title}</CardTitle>
        <Icon className="h-6 w-6 text-orange-400" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold font-headline", valueClassName)}>{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
