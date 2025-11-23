import React, { useState } from "react";
import { Zap, Users, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { themeClasses } from "../../utils/classes/themeClasses";

export default function Landing() {
  const theme = useSelector((s) => s.theme);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Lightning Fast Queries",
      description:
        "Run blazing-fast SQL, experiment instantly, and optimize like a pro.",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-400",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Team Collaboration",
      description:
        "Work with teammates, share results, and collaborate in real-time.",
      icon: Users,
      gradient: "from-purple-500 to-pink-400",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Secure & Reliable",
      description: "Your data stays protected with enterprise-grade security.",
      icon: Shield,
      gradient: "from-green-500 to-cyan-400",
      image:
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div
      className={`min-h-screen ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative px-6 py-20 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              The Future of SQL Development
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              BrewQuery
            </span>
          </h1>

          <p
            className={`text-xl ${themeClasses[theme].text} opacity-80 mb-8 leading-relaxed`}
          >
            A lightning-fast, modern SQL playground with powerful tools built
            for developers, teams, and data enthusiasts.
          </p>

          <div className="flex gap-4   justify-center flex-wrap">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className={`px-8 py-4 ${
                themeClasses[theme].cardBg
              } backdrop-blur-sm rounded-xl font-semibold border ${
                themeClasses[theme].border || "border-gray-700"
              } hover:opacity-90 transition-all duration-300 hover:scale-105`}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Glow effect */}
                <div
                  className={`absolute bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}
                ></div>

                {/* Card */}
                <div
                  className={`relative h-full ${
                    themeClasses[theme].cardBg
                  } backdrop-blur-xl rounded-2xl border ${
                    themeClasses[theme].border || "border-gray-700"
                  } overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl`}
                >
                  {/* Image with overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                    ></div>

                    {/* Floating icon */}
                    <div
                      className={`absolute top-4 right-4 p-3 bg-gradient-to-br ${
                        card.gradient
                      } rounded-xl shadow-lg transform transition-all duration-500 ${
                        hoveredCard === idx
                          ? "scale-110 rotate-12"
                          : "scale-100 rotate-0"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className={`text-2xl font-bold mb-3 ${themeClasses[theme].text} group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`${themeClasses[theme].text} opacity-70 text-sm leading-relaxed mb-4`}
                    >
                      {card.description}
                    </p>

                    <button
                      className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}
                    >
                      Learn More
                      <ArrowRight
                        className={`w-4 h-4 ${themeClasses[theme].text} opacity-60 group-hover:opacity-100 transition-all`}
                      />
                    </button>
                  </div>

                  {/* Animated border */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>


      
      </div>

      
    </div>
  );
}
