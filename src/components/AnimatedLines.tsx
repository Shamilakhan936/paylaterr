const AnimatedLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(174 72% 56%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(174 72% 56%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(262 83% 68%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(262 83% 68%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(199 89% 48%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(174 72% 56%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Flowing Lines */}
        <path
          d="M-100,200 Q300,100 600,200 T1300,200"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="2"
          className="animate-line-flow"
          style={{ animationDuration: '4s' }}
        />
        <path
          d="M-100,350 Q400,250 700,350 T1300,350"
          fill="none"
          stroke="url(#lineGradient2)"
          strokeWidth="1.5"
          className="animate-line-flow"
          style={{ animationDuration: '5s', animationDelay: '0.5s' }}
        />
        <path
          d="M-100,500 Q350,400 650,500 T1300,500"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="1"
          className="animate-line-flow"
          style={{ animationDuration: '6s', animationDelay: '1s' }}
        />

        {/* Connection Dots */}
        <circle cx="300" cy="200" r="4" fill="hsl(174 72% 56%)" className="animate-pulse-slow" />
        <circle cx="600" cy="350" r="3" fill="hsl(199 89% 48%)" className="animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
        <circle cx="900" cy="200" r="5" fill="hsl(262 83% 68%)" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <circle cx="450" cy="500" r="3" fill="hsl(174 72% 56%)" className="animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <circle cx="750" cy="350" r="4" fill="hsl(199 89% 48%)" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </svg>
    </div>
  );
};

export default AnimatedLines;
