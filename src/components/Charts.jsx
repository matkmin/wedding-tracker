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
      <div className="bg-white px-3 py-2 border border-[#e5e7eb] shadow-sm rounded text-xs">
        <p className="font-medium text-slate-700">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>
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
      <div className="bg-white px-3 py-2 border border-[#e5e7eb] shadow-sm rounded text-xs">
        <p className="font-medium text-slate-700">
          {payload[0].payload.fullName}
        </p>
        <p className="text-slate-900">
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
}) {
  const totalBelum = payments.filter(p => p.status === 'Belum').reduce((sum, p) => sum + (Number(p.jumlah_penuh) || 0), 0);
  const totalDeposit = payments.filter(p => p.status === 'Deposit').reduce((sum, p) => sum + (Number(p.jumlah_penuh) || 0), 0);
  const totalSelesai = payments.filter(p => p.status === 'Selesai').reduce((sum, p) => sum + (Number(p.jumlah_penuh) || 0), 0);
  
  const donutData = [
    { name: "Belum", value: totalBelum },
    { name: "Deposit", value: totalDeposit },
    { name: "Selesai", value: totalSelesai },
  ].filter(d => d.value > 0);

  const COLORS = {
    "Belum": "#94a3b8",
    "Deposit": "#f59e0b",
    "Selesai": "#10b981"
  };

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
      name: key.length > 10 ? key.substring(0, 10) + ".." : key,
      fullName: key,
      Jumlah: categoryMap[key],
    }))
    .sort((a, b) => b.Jumlah - a.Jumlah)
    .slice(0, 7);

  const formatCompact = (val) => {
    if (val >= 1000) return `RM${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return `RM${val}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      {/* Bar Chart - 60% */}
      <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] flex-1 md:w-[60%] flex flex-col">
        <h3 className="text-xs text-gray-500 mb-6">Perbelanjaan by Kategori</h3>
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompact}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <BarTooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "#f9fafb" }}
              />
              <Bar
                dataKey="Jumlah"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart - 40% */}
      <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] w-full md:w-[40%] flex flex-col">
        <h3 className="text-xs text-gray-500 mb-2">By Status</h3>
        <div className="flex-1 relative min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name]}
                  />
                ))}
              </Pie>
              <PieTooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-medium text-slate-800">
              {formatCompact(totalKeseluruhan)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {donutData.map(d => {
             const pct = totalKeseluruhan > 0 ? ((d.value / totalKeseluruhan) * 100).toFixed(0) : 0;
             return (
               <div key={d.name} className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[d.name] }}></div>
                 <span className="text-[10px] text-gray-500">{d.name} {pct}%</span>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}
