function Bone({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "linear-gradient(90deg,#1c1b1b 25%,#2a2a2a 50%,#1c1b1b 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite", ...style,
    }} />
  );
}
export default function DashboardSkeleton() {
  return (
    <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[...Array(4)].map((_, i) => <Bone key={i} style={{ height: 90, border: "1px solid #2a2a2a" }} />)}
      </div>
      <Bone style={{ height: 300, border: "1px solid #2a2a2a" }} />
      <Bone style={{ height: 240, border: "1px solid #2a2a2a" }} />
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
