import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export default function PriceEstimation() {
  const [formData, setFormData] = useState({
    cropType: "",
    quantity: "",
    quality: "",
    location: "",
    marketType: "",
    harvestDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Price estimation feature will be implemented with market data integration!");
  };

  const marketPrices = [
    { crop: "Rice", price: "₹2,100/quintal", trend: "↗️", change: "+2.5%" },
    { crop: "Wheat", price: "₹2,350/quintal", trend: "↗️", change: "+1.8%" },
    { crop: "Corn", price: "₹1,850/quintal", trend: "↘️", change: "-1.2%" },
    { crop: "Cotton", price: "₹6,200/quintal", trend: "↗️", change: "+3.1%" },
    { crop: "Sugarcane", price: "₹320/quintal", trend: "→", change: "0%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Crop Price Estimation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get real-time market price predictions for your crops to make informed selling decisions and maximize profits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Input Form */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Crop & Market Details
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
                          <SelectItem value="onion">Onion</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (quintals)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="50"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Quality and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality">Crop Quality</Label>
                      <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premium">Premium Grade</SelectItem>
                          <SelectItem value="grade-a">Grade A</SelectItem>
                          <SelectItem value="grade-b">Grade B</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="below-standard">Below Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Market Location</Label>
                      <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">Delhi APMC</SelectItem>
                          <SelectItem value="mumbai">Mumbai APMC</SelectItem>
                          <SelectItem value="chennai">Chennai APMC</SelectItem>
                          <SelectItem value="kolkata">Kolkata APMC</SelectItem>
                          <SelectItem value="bangalore">Bangalore APMC</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad APMC</SelectItem>
                          <SelectItem value="pune">Pune APMC</SelectItem>
                          <SelectItem value="ahmedabad">Ahmedabad APMC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Market Type and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marketType">Market Type</Label>
                      <Select value={formData.marketType} onValueChange={(value) => setFormData({...formData, marketType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wholesale">Wholesale Market</SelectItem>
                          <SelectItem value="retail">Retail Market</SelectItem>
                          <SelectItem value="direct">Direct to Consumer</SelectItem>
                          <SelectItem value="contract">Contract Farming</SelectItem>
                          <SelectItem value="export">Export Market</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="harvestDate">Expected Sale Date</Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        value={formData.harvestDate}
                        onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    Get Price Estimation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}