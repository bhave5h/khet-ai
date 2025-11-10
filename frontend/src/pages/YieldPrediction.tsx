import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { TrendingUp, Ruler } from "lucide-react";

export default function YieldPrediction() {
  const [formData, setFormData] = useState({
    cropType: "",
    area: "",
    rainfall: "",
    temperature: "",
    pesticides: "",
    fertilizers: "",
  });

  const [crops, setCrops] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Fetch unique crop list from backend
  useEffect(() => {
    fetch("https://khet-ai.onrender.com/crops")
      .then((res) => res.json())
      .then((data) => setCrops(data.crops || []))
      .catch(() => setErrorMsg("Unable to load crop list from backend"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch("https://khet-ai.onrender.com/predict_yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.predicted_yield) {
        setResult(data.predicted_yield);
      } else {
        setErrorMsg(data.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Crop Yield Prediction</h1>
            <p className="text-muted-foreground">
              Predict the estimated yield of your crop based on weather and input data.
            </p>
          </div>

          <Card className="shadow-farm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Enter Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select
                      value={formData.cropType}
                      onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.length > 0 ? (
                          crops.map((crop, index) => (
                            <SelectItem key={index} value={crop}>
                              {crop.charAt(0).toUpperCase() + crop.slice(1)}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>Loading crops...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div className="space-y-2">
                    <Label htmlFor="area">Farm Area (hectares)</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Weather Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <Input
                      id="rainfall"
                      type="number"
                      placeholder="800"
                      value={formData.rainfall}
                      onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="28"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pesticides">Pesticides (kg/ha)</Label>
                    <Input
                      id="pesticides"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formData.pesticides}
                      onChange={(e) => setFormData({ ...formData, pesticides: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fertilizers">Fertilizers (kg/ha)</Label>
                    <Input
                      id="fertilizers"
                      type="number"
                      step="0.1"
                      placeholder="150"
                      value={formData.fertilizers}
                      onChange={(e) => setFormData({ ...formData, fertilizers: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Predicting..." : "Predict Yield"}
                </Button>

                {/* Display Results */}
                {result && (
                  <div className="mt-4 text-center font-semibold text-lg text-primary">
                    Predicted Yield: {result} tons/hectare
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-4 text-center text-red-500 font-medium">
                    {errorMsg}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
