import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
}

export function ToolCard({ title, description, icon: Icon, href, gradient }: ToolCardProps) {
  return (
    <Card className="group hover:shadow-farm transition-farm hover:-translate-y-1 card-gradient border-border/50">
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${gradient || 'bg-primary/10'}`}>
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="hero" className="w-full">
          <Link to={href}>Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  );
}