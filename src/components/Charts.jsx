import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as PieTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
} from "recharts";

const formatRM = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-lg">
        <p className="text-sm font-medium text-slate-700">{payload[0].name}</p>
        <p
          className="text-lg font-bold"
          style={{ color: payload[0].payload.fill }}
        >
          {formatRM(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-lg">
        <p className="text-sm font-medium text-slate-700">
          {payload[0].payload.fullName}
        </p>
        <p className="text-lg font-bold text-rose-500">
          {formatRM(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({
  payments,
  totalKeseluruhan,
  totalDahBayar,
  bakiPerluBayar,
}) {
  // --- Donut Chart Data ---
  const donutData = [
    { name: "Dah Bayar", value: totalDahBayar },
    { name: "Baki", value: bakiPerluBayar > 0 ? bakiPerluBayar : 0 },
  ];
  const COLORS = ["#10b981", "#ef4444"]; // Green for paid, Red for remaining

  // --- Bar Chart Data (Top 5 Categories by Total Cost) ---
  // Group by perkara
  const categoryMap = {};
  payments.forEach((p) => {
    const perkara = p.perkara || "Lain-lain";
    if (!categoryMap[perkara]) {
      categoryMap[perkara] = 0;
    }
    categoryMap[perkara] += Number(p.jumlah_penuh) || 0;
  });

  const barData = Object.keys(categoryMap)
    .map((key) => ({
      name: key.length > 15 ? key.substring(0, 15) + "..." : key,
      fullName: key,
      Jumlah: categoryMap[key],
    }))
    .sort((a, b) => b.Jumlah - a.Jumlah)
    .slice(0, 5); // Take top 5

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Donut Chart Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Status Keseluruhan
        </h3>
        <div className="flex-1 relative min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <PieTooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total
            </span>
            <span className="text-xl font-bold text-slate-800">
              {formatRM(totalKeseluruhan)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className="text-sm text-slate-600">Dah Bayar</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-slate-600">Baki</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Perbelanjaan Tertinggi
        </h3>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                type="number"
                tickFormatter={(val) => `RM${val / 1000}k`}
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#475569" }}
              />
              <BarTooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar
                dataKey="Jumlah"
                fill="#f43f5e"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
