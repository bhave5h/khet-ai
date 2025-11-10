import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Droplets, FlaskConical } from "lucide-react";
import { useState } from "react";

export default function FertilizerSuggestion() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://khet-ai.onrender.com/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: formData.nitrogen,
          phosphorus: formData.phosphorus,
          potassium: formData.potassium,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.recommended_fertilizer);
      } else {
        setError(data.error || "Failed to get recommendation.");
      }
    } catch (err) {
      setError("⚠️ Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 flex items-center justify-center mb-4">
              <Droplets className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Fertilizer Suggestion</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered fertilizer recommendations based on your soil’s NPK levels.
            </p>
          </div>

          {/* Input Form */}
          <Card className="shadow-farm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Soil Nutrients (NPK)
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      placeholder="e.g. 40"
                      value={formData.nitrogen}
                      onChange={(e) =>
                        setFormData({ ...formData, nitrogen: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                    <Input
                      id="phosphorus"
                      type="number"
                      placeholder="e.g. 20"
                      value={formData.phosphorus}
                      onChange={(e) =>
                        setFormData({ ...formData, phosphorus: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      placeholder="e.g. 30"
                      value={formData.potassium}
                      onChange={(e) =>
                        setFormData({ ...formData, potassium: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Predicting..." : "Get Fertilizer Recommendation"}
                </Button>
              </form>

              {/* Result or Error */}
              {result && (
                <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 text-center font-medium">
                  🌿 Recommended Fertilizer: <strong>{result}</strong>
                </div>
              )}
              {error && (
                <div className="mt-6 p-4 bg-red-100 rounded-lg text-red-800 text-center font-medium">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
