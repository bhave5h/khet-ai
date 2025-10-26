import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      alert("Disease detection feature will be implemented with AI model integration!");
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-red-400/20 to-red-600/20 flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Plant Disease Detection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload images of your plants to detect diseases early and get treatment recommendations using AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Plant Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  
                  {!imagePreview ? (
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Choose an image</h3>
                      <p className="text-muted-foreground mb-4">
                        Click to select a photo of your plant leaves or affected areas
                      </p>
                      <Button variant="outline">Select Image</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Plant preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={triggerFileInput}
                          className="absolute top-2 right-2"
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analyze Button */}
                {selectedImage && (
                  <Button
                    onClick={handleAnalyze}
                    variant="hero"
                    className="w-full"
                    size="lg"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze for Diseases"}
                  </Button>
                )}

                {/* Tips */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Photography Tips
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take clear, well-lit photos</li>
                    <li>• Focus on affected leaves or areas</li>
                    <li>• Avoid blurry or dark images</li>
                    <li>• Include multiple angles if possible</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle>Supported Plant Diseases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: "Tomato Blight", severity: "High" },
                      { name: "Potato Late Blight", severity: "High" },
                      { name: "Corn Rust", severity: "Medium" },
                      { name: "Rice Blast", severity: "High" },
                      { name: "Wheat Rust", severity: "Medium" },
                      { name: "Apple Scab", severity: "Medium" },
                    ].map((disease, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">{disease.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          disease.severity === 'High' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {disease.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm">
                <CardHeader>
                  <CardTitle>AI Detection Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">1</div>
                      <div>
                        <h4 className="font-medium">Image Processing</h4>
                        <p className="text-sm text-muted-foreground">AI analyzes leaf patterns, discoloration, and symptoms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">2</div>
                      <div>
                        <h4 className="font-medium">Disease Identification</h4>
                        <p className="text-sm text-muted-foreground">Compares with trained models of known plant diseases</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">3</div>
                      <div>
                        <h4 className="font-medium">Treatment Suggestions</h4>
                        <p className="text-sm text-muted-foreground">Provides recommendations for prevention and treatment</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-farm border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">Early Detection is Key</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Detecting plant diseases early can save your entire crop. Regular monitoring and AI-assisted detection help prevent widespread damage.
                      </p>
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