import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calendar, Ruler, Thermometer } from "lucide-react";
import { useState } from "react";

export default function YieldPrediction() {
  const [formData, setFormData] = useState({
    cropType: "",
    area: "",
    soilType: "",
    season: "",
    rainfall: "",
    temperature: "",
    pesticides: "",
    fertilizers: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Yield prediction feature will be implemented with ML model integration!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Crop Yield Prediction</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Predict your crop yields using machine learning models trained on historical farming data and current conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Farm & Crop Details
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Farm Area (hectares)</Label>
                      <Input
                        id="area"
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Soil and Season */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="season">Growing Season</Label>
                      <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                          <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                          <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Climate Conditions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      Climate & Weather
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rainfall">Expected Rainfall (mm)</Label>
                        <Input
                          id="rainfall"
                          type="number"
                          placeholder="800"
                          value={formData.rainfall}
                          onChange={(e) => setFormData({...formData, rainfall: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Avg Temperature (°C)</Label>
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

                  {/* Farming Inputs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Farming Inputs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pesticides">Pesticides Used (kg/ha)</Label>
                        <Input
                          id="pesticides"
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={formData.pesticides}
                          onChange={(e) => setFormData({...formData, pesticides: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fertilizers">Fertilizers Used (kg/ha)</Label>
                        <Input
                          id="fertilizers"
                          type="number"
                          step="0.1"
                          placeholder="150"
                          value={formData.fertilizers}
                          onChange={(e) => setFormData({...formData, fertilizers: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    Predict Yield
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Prediction Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">92%</div>
                      <p className="text-sm text-muted-foreground">Average prediction accuracy</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-semibold">500K+</div>
                        <p className="text-sm text-muted-foreground">Predictions made</p>
                      </div>
                      <div>
                        <div className="text-xl font-semibold">15+</div>
                        <p className="text-sm text-muted-foreground">Crop varieties</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle>Sample Yield Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">Rice (2 ha)</h4>
                          <p className="text-sm text-green-600 dark:text-green-300">Kharif season</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-800 dark:text-green-200">8.5 tons</div>
                          <div className="text-xs text-green-600 dark:text-green-300">4.25 t/ha</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Wheat (3 ha)</h4>
                          <p className="text-sm text-yellow-600 dark:text-yellow-300">Rabi season</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-800 dark:text-yellow-200">12 tons</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-300">4.0 t/ha</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">Corn (1.5 ha)</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-300">Zaid season</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-800 dark:text-blue-200">9 tons</div>
                          <div className="text-xs text-blue-600 dark:text-blue-300">6.0 t/ha</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle>Factors Considered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Historical yield data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Weather patterns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Soil composition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Farming practices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Regional variations</span>
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