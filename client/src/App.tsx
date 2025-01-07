import { Switch, Route } from "wouter";
import { ModelRouter } from "@/components/model-router";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <main className="w-full max-w-full">
        <ModelRouter />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-x-hidden">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">404 Page Not Found</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;