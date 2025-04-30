import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 h-full w-full">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* 3x3 Animated Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-2xl ${
                i % 2 === 0
                  ? "bg-primary animate-pulse"
                  : "bg-primary/30"
              }`}
              style={{
                animationDelay: `${(i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
        {/* Text Content */}
        <h2 className="text-2xl font-bold mb-4 text-base-content">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;