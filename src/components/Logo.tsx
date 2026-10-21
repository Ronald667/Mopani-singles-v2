export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="romanceSunset" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="heartGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Outer Glowing Circle */}
        <circle cx="50" cy="50" r="46" fill="url(#romanceSunset)" opacity="0.15" />
        <circle cx="50" cy="50" r="42" stroke="url(#romanceSunset)" strokeWidth="3.5" fill="#fff1f2" />

        {/* Romantic Heart Centerpiece with Two Lovers */}
        <g transform="translate(12, 10) scale(0.75)">
          {/* Glowing Heart Background */}
          <path d="M50 15 C40 2, 20 5, 20 25 C20 40, 50 62, 50 62 C50 62, 80 40, 80 25 C80 5, 60 2, 50 15 Z" fill="url(#heartGlow)" opacity="0.25" />

          {/* Left Lover Silhouette */}
          <path d="M32 45 C30 40, 29 32, 34 28 C39 24, 44 27, 46 32 C48 38, 47 44, 45 50 C43 58, 40 65, 38 78 C37 88, 36 95, 35 100 L27 100 C29 88, 32 72, 34 60 C35 54, 34 49, 32 45 Z" fill="#4c0519" />
          <circle cx="34" cy="26" r="7" fill="#4c0519" />
          <circle cx="29" cy="30" r="5" fill="#4c0519" />

          {/* Right Lover Silhouette */}
          <path d="M68 45 C70 40, 71 32, 66 28 C61 24, 56 27, 54 32 C52 38, 53 44, 55 50 C57 58, 60 65, 62 78 C63 88, 64 95, 65 100 L73 100 C71 88, 68 72, 66 60 C65 54, 66 49, 68 45 Z" fill="#4c0519" />
          <circle cx="66" cy="26" r="7" fill="#4c0519" />
          <circle cx="71" cy="30" r="5" fill="#4c0519" />

          {/* Embrace Bond */}
          <path d="M40 55 Q50 66 60 55 Q50 72 40 55 Z" fill="#881337" />
        </g>
      </svg>
    </div>
  )
}
