// import { Navbar } from "../components/Navbar";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Camera, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react";
// import { useState, useRef } from "react";

// export default function DiseaseDetection() {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!selectedImage) return;
    
//     setIsAnalyzing(true);
//     // Simulate AI analysis
//     setTimeout(() => {
//       setIsAnalyzing(false);
//       alert("Disease detection feature will be implemented with AI model integration!");
//     }, 2000);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <div className="container py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-red-400/20 to-red-600/20 flex items-center justify-center mb-4">
//               <Camera className="h-8 w-8 text-primary" />
//             </div>
//             <h1 className="text-4xl font-bold mb-4">Plant Disease Detection</h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Upload images of your plants to detect diseases early and get treatment recommendations using AI.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
//             {/* Upload Section */}
//             <Card className="shadow-farm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Upload className="h-5 w-5" />
//                   Upload Plant Image
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Image Upload Area */}
//                 <div className="space-y-4">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
                  
//                   {!imagePreview ? (
//                     <div
//                       onClick={triggerFileInput}
//                       className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
//                     >
//                       <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                       <h3 className="text-lg font-medium mb-2">Choose an image</h3>
//                       <p className="text-muted-foreground mb-4">
//                         Click to select a photo of your plant leaves or affected areas
//                       </p>
//                       <Button variant="outline">Select Image</Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="relative">
//                         <img
//                           src={imagePreview}
//                           alt="Plant preview"
//                           className="w-full h-64 object-cover rounded-lg"
//                         />
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           onClick={triggerFileInput}
//                           className="absolute top-2 right-2"
//                         >
//                           Change Image
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Analyze Button */}
//                 {selectedImage && (
//                   <Button
//                     onClick={handleAnalyze}
//                     variant="hero"
//                     className="w-full"
//                     size="lg"
//                     disabled={isAnalyzing}
//                   >
//                     {isAnalyzing ? "Analyzing..." : "Analyze for Diseases"}
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Camera, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict_disease", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Prediction failed");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

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

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
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

                {/* Result Section */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                )}

                {result && (
                  <div className="p-6 rounded-lg bg-green-50 border border-green-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      ✅ Detected Disease:
                    </h3>
                    <p className="text-lg font-medium text-green-700">
                      {result.prediction}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Confidence: {result.confidence}%
                    </p>

                    <div className="mt-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Top 3 Predictions:
                      </h4>
                      <ul className="list-disc ml-6 text-green-700">
                        {result.top_3.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.class} — {item.confidence}%
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
