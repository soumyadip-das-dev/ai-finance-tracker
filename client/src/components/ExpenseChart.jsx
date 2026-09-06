import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#00ff88", // Accent Green
  "#38bdf8", // Sky Blue
  "#f59e0b", // Amber
  "#ff4d6d", // Coral/Red
  "#a78bfa", // Purple
  "#34d399", // Emerald
  "#94a3b8", // Slate
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          background: "rgba(17, 24, 39, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          color: "#f8fafc",
          fontFamily: "'Sora', sans-serif",
          fontSize: "12px",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: data.payload.fill }}>
          {data.name}
        </p>
        <p style={{ margin: "2px 0 0", fontFamily: "'DM Mono', monospace" }}>
          ₹{Number(data.value).toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ transactions = [] }) => {
  const dataMap = {};

  transactions.forEach((t) => {
    const cat = t.category || "Other";
    if (!dataMap[cat]) dataMap[cat] = 0;
    dataMap[cat] += t.amount;
  });

  const chartData = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
  }));

  if (chartData.length === 0) {
    return (
      <div
        style={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: "0.85rem",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        No expense data recorded
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={3}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#0d1422"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              fontFamily: "'Sora', sans-serif",
              paddingTop: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;