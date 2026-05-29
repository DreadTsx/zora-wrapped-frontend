export default function DashboardLoader() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "60vh", gap: 24,
    }}>
      {/* Loader rings */}
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <style>{`
          @keyframes zwRotate {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes zwRotateBack {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }

          /* Outer ring — amber */
          .zw-loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            border: 3px solid;
            border-color: #F5A623 #F5A623 transparent transparent;
            box-sizing: border-box;
            animation: zwRotate 1s linear infinite;
          }

          /* Middle ring — cream, spins backward */
          .zw-loader::after {
            content: '';
            box-sizing: border-box;
            position: absolute;
            left: 0; right: 0; top: 0; bottom: 0;
            margin: auto;
            border: 3px solid;
            border-color: transparent transparent #e5e2e1 #e5e2e1;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            animation: zwRotateBack 0.5s linear infinite;
            transform-origin: center center;
          }

          /* Inner ring — amber dim, spins forward slower */
          .zw-loader::before {
            content: '';
            box-sizing: border-box;
            position: absolute;
            left: 0; right: 0; top: 0; bottom: 0;
            margin: auto;
            border: 3px solid;
            border-color: #ffb955 #ffb955 transparent transparent;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            animation: zwRotate 1.5s linear infinite;
            transform-origin: center center;
          }
        `}</style>
        <span className="zw-loader" />
      </div>

      {/* Label */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{
          fontFamily: "var(--f-mono)", fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.18em",
          color: "#9f8e7a88",
        }}>
          Indexing contract
        </span>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 3, height: 3,
              background: "#F5A623",
              borderRadius: "50%",
              animation: "zwPulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              opacity: 0.5,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes zwPulse {
          0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
          50%       { transform: scaleY(1.4); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
