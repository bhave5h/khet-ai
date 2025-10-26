import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, MapPin, Thermometer, Droplets } from "lucide-react";
import { useState } from "react";

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      };

      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.recommended_crop);
      }
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center mb-4">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Crop Recommendation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered crop suggestions based on your soil composition, climate conditions, and location.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Input Form */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Soil Composition */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Soil Composition (NPK)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                        <Input
                          id="nitrogen"
                          type="number"
                          placeholder="mg"
                          value={formData.nitrogen}
                          onChange={(e) => setFormData({...formData, nitrogen: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                        <Input
                          id="phosphorus"
                          type="number"
                          placeholder="mg"
                          value={formData.phosphorus}
                          onChange={(e) => setFormData({...formData, phosphorus: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potassium">Potassium (K)</Label>
                        <Input
                          id="potassium"
                          type="number"
                          placeholder="mg"
                          value={formData.potassium}
                          onChange={(e) => setFormData({...formData, potassium: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>


                 {/* Climate Conditions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      Climate Conditions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          placeholder="25"
                          value={formData.temperature}
                          onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="humidity">Humidity (%)</Label>
                        <Input
                          id="humidity"
                          type="number"
                          placeholder="60"
                          value={formData.humidity}
                          onChange={(e) => setFormData({...formData, humidity: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Soil pH and Rainfall */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ph">Soil pH</Label>
                        <Input
                          id="ph"
                          type="number"
                          step="0.1"
                          placeholder="6.5"
                          value={formData.ph}
                          onChange={(e) => setFormData({...formData, ph: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                        <Input
                          id="rainfall"
                          type="number"
                          placeholder="1200"
                          value={formData.rainfall}
                          onChange={(e) => setFormData({...formData, rainfall: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Predicting..." : "Get Crop Recommendation"}
                  </Button>

                  {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                  {result && <p className="text-green-600 text-center mt-2 font-bold text-xl capitalize">🌱 Recommended Crop: <p className="text-2xl">{result}</p> </p>}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
