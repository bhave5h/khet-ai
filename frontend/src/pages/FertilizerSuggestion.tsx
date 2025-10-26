import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, FlaskConical, Leaf, Target } from "lucide-react";
import { useState } from "react";

export default function FertilizerSuggestion() {
  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    moisture: "",
    temperature: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Fertilizer suggestion feature will be implemented with AI model integration!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 flex items-center justify-center mb-4">
              <Droplets className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Fertilizer Suggestion</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered fertilizer recommendations tailored to your crop type, soil conditions, and nutrient requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Soil & Crop Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Select value={formData.cropType} onValueChange={(value) => setFormData({...formData, cropType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="barley">Barley</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="potato">Potato</SelectItem>
                          <SelectItem value="tomato">Tomato</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={formData.soilType} onValueChange={(value) => setFormData({...formData, soilType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="silt">Silt</SelectItem>
                          <SelectItem value="peaty">Peaty</SelectItem>
                          <SelectItem value="chalky">Chalky</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* NPK Values */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Current Soil Nutrients (NPK)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nitrogen">Nitrogen (N) mg/kg</Label>
                        <Input
                          id="nitrogen"
                          type="number"
                          placeholder="40"
                          value={formData.nitrogen}
                          onChange={(e) => setFormData({...formData, nitrogen: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phosphorus">Phosphorus (P) mg/kg</Label>
                        <Input
                          id="phosphorus"
                          type="number"
                          placeholder="20"
                          value={formData.phosphorus}
                          onChange={(e) => setFormData({...formData, phosphorus: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potassium">Potassium (K) mg/kg</Label>
                        <Input
                          id="potassium"
                          type="number"
                          placeholder="30"
                          value={formData.potassium}
                          onChange={(e) => setFormData({...formData, potassium: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Soil Conditions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Soil Conditions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <Label htmlFor="moisture">Moisture (%)</Label>
                        <Input
                          id="moisture"
                          type="number"
                          placeholder="25"
                          value={formData.moisture}
                          onChange={(e) => setFormData({...formData, moisture: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    Get Fertilizer Recommendation
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Fertilizer Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Nitrogen (N)</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Promotes leaf growth and green color</p>
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Urea, Ammonium Sulfate</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Phosphorus (P)</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-300">Supports root development and flowering</p>
                      <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">DAP, SSP, TSP</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Potassium (K)</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Improves disease resistance and fruit quality</p>
                      <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">MOP, SOP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Sample Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">Rice - Loamy Soil</h4>
                          <p className="text-sm text-green-600 dark:text-green-300">NPK 12:32:16</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-800 dark:text-green-200">125 kg/ha</div>
                          <div className="text-xs text-green-600 dark:text-green-300">Split application</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Wheat - Clay Soil</h4>
                          <p className="text-sm text-yellow-600 dark:text-yellow-300">NPK 10:26:26</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">100 kg/ha</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-300">Basal application</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-orange-800 dark:text-orange-200">Corn - Sandy Soil</h4>
                          <p className="text-sm text-orange-600 dark:text-orange-300">NPK 14:35:14</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-orange-800 dark:text-orange-200">150 kg/ha</div>
                          <div className="text-xs text-orange-600 dark:text-orange-300">2 split doses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle>Application Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Apply fertilizers during cool hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Ensure adequate soil moisture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Split application for better uptake</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Mix with soil after application</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Follow crop-specific timing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}