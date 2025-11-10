import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { DollarSign, TrendingUp } from "lucide-react";

export default function PriceEstimation() {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    market: "",
    crop: "",
    variety: "",
    date: ""
  });

  const [options, setOptions] = useState({
    states: [] as string[],
    districts: [] as string[],
    markets: [] as string[],
    crops: [] as string[],
    varieties: [] as string[]
  });

  const [result, setResult] = useState<{
    price?: number;
    currency?: string;
    unit?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const API_BASE = "http://127.0.0.1:5000"; // ⚙️ Flask backend URL

  // ------------------------------------------------------------
  // Fetch options dynamically
  // ------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_BASE}/get_states`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, states: data })))
      .catch(() => setOptions((prev) => ({ ...prev, states: [] })));
  }, []);

  useEffect(() => {
    if (!formData.state) return;
    fetch(`${API_BASE}/get_districts/${formData.state}`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, districts: data, markets: [], crops: [], varieties: [] })));
  }, [formData.state]);

  useEffect(() => {
    if (!formData.district) return;
    fetch(`${API_BASE}/get_markets/${formData.state}/${formData.district}`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, markets: data, crops: [], varieties: [] })));
  }, [formData.district]);

  useEffect(() => {
    if (!formData.market) return;
    fetch(`${API_BASE}/get_crops/${formData.state}/${formData.district}/${formData.market}`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, crops: data, varieties: [] })));
  }, [formData.market]);

  useEffect(() => {
    if (!formData.crop) return;
    fetch(`${API_BASE}/get_varieties/${formData.state}/${formData.district}/${formData.market}/${formData.crop}`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, varieties: data })));
  }, [formData.crop]);

  // ------------------------------------------------------------
  // Submit form (Predict Price)
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult({});

    try {
      const res = await fetch(`${API_BASE}/predict_price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.status === "success") {
        setResult({
          price: data.predicted_price_per_kg,
          currency: data.currency,
          unit: data.unit
        });
      } else {
        setResult({});
        alert(data.error || "Prediction failed.");
      }
    } catch (err) {
      alert("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Render UI
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      
      <Navbar />

      
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Crop Price Estimation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get real-time market price predictions for your crops to make informed selling decisions and maximize profits.
            </p>
          </div>

          <Card className="shadow-farm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Crop Price Prediction
              </CardTitle>
            </CardHeader>

            

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State */}
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(v) =>
                        setFormData({ state: v, district: "", market: "", crop: "", variety: "", date: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.states.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(v) =>
                        setFormData({ ...formData, district: v, market: "", crop: "", variety: "" })
                      }
                      disabled={!options.districts.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Market */}
                  <div className="space-y-2">
                    <Label>Market</Label>
                    <Select
                      value={formData.market}
                      onValueChange={(v) =>
                        setFormData({ ...formData, market: v, crop: "", variety: "" })
                      }
                      disabled={!options.markets.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Market" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.markets.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crop */}
                  <div className="space-y-2">
                    <Label>Crop</Label>
                    <Select
                      value={formData.crop}
                      onValueChange={(v) => setFormData({ ...formData, crop: v, variety: "" })}
                      disabled={!options.crops.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.crops.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Variety */}
                  <div className="space-y-2">
                    <Label>Variety</Label>
                    <Select
                      value={formData.variety}
                      onValueChange={(v) => setFormData({ ...formData, variety: v })}
                      disabled={!options.varieties.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Variety" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.varieties.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Predicting..." : "Predict Price"}
                </Button>

                {/* Prediction Result */}
                {result.price && (
                  <div className="mt-6 text-center text-lg font-semibold">
                    💰 Predicted Price:{" "}
                    <span className="text-green-600 font-bold">
                      {result.currency} {result.price.toFixed(2)} {result.unit === "per_kg" ? "/kg" : ""}
                    </span>
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
