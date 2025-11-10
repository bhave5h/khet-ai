import { ToolCard } from "../components/ToolCard";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { 
  Sprout, 
  TrendingUp, 
  Droplets, 
  DollarSign, 
  Camera,
  Leaf,
  Users,
  Award
} from "lucide-react";
import farmHeroImage from "../assets/farm-hero.jpg";

const Home = () => {
  const tools = [
    {
      title: "Crop Recommendation",
      description: "Get AI-powered suggestions for the best crops to grow based on your soil, climate, and farming conditions.",
      icon: Sprout,
      href: "/crop-recommendation",
      gradient: "bg-gradient-to-br from-green-400/20 to-green-600/20"
    },
    {
      title: "Yield Prediction",
      description: "Predict your crop yields using machine learning models and historical farming data.",
      icon: TrendingUp,
      href: "/yield-prediction",
      gradient: "bg-gradient-to-br from-blue-400/20 to-blue-600/20"
    },
    {
      title: "Fertilizer Suggestion",
      description: "Optimize your fertilizer usage with AI recommendations tailored to your crops and soil conditions.",
      icon: Droplets,
      href: "/fertilizer-suggestion",
      gradient: "bg-gradient-to-br from-orange-400/20 to-orange-600/20"
    },
    {
      title: "Price Estimation",
      description: "Get current market price predictions for your crops to make informed selling decisions.",
      icon: DollarSign,
      href: "/price-estimation",
      gradient: "bg-gradient-to-br from-purple-400/20 to-purple-600/20"
    },
    {
      title: "Disease Detection",
      description: "Upload plant images to detect diseases early and get treatment recommendations.",
      icon: Camera,
      href: "/disease-detection",
      gradient: "bg-gradient-to-br from-red-400/20 to-red-600/20"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Farmers Helped" },
    { icon: Leaf, value: "95%", label: "Accuracy Rate" },
    { icon: Award, value: "50+", label: "Crop Types Supported" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={farmHeroImage} 
            alt="Agricultural landscape" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 hero-gradient opacity-10"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Smart Farming with{" "}
            <span className="bg-gradient-to-r from-primary to-farm-green-light bg-clip-text text-transparent">
              Khet-AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Empower your farming decisions with AI tools. From crop recommendations to disease detection, 
            we help farmers optimize their yield and maximize profits.
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              Explore Tools
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div> */}

        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Tools Section */}
      <section className="py-20 px-4">
        <div className="container">
          {/* <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Farming Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive suite of AI tools designed to help modern farmers 
              make data-driven decisions and increase productivity.
            </p>
          </div> */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Khet AI</span>
          </div>
          <p className="text-muted-foreground">
            Empowering farmers with artificial intelligence for sustainable agriculture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
