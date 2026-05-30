const formatRM = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount || 0);
};

export default function SummaryCards({ payments }) {
  const totalKeseluruhan = payments.reduce(
    (sum, p) => sum + (Number(p.jumlah_penuh) || 0),
    0,
  );
  const totalDahBayar = payments.reduce(
    (sum, p) => sum + (Number(p.deposit_dibayar) || 0),
    0,
  );
  const bakiPerluBayar = totalKeseluruhan - totalDahBayar;

  const countBelum = payments.filter((p) => p.status === "Belum").length;
  const countDeposit = payments.filter((p) => p.status === "Deposit").length;
  const countSelesai = payments.filter((p) => p.status === "Selesai").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
          Total Keseluruhan
        </h3>
        <p className="text-2xl font-bold text-slate-800 mt-2">
          {formatRM(totalKeseluruhan)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
          Total Dah Bayar
        </h3>
        <p className="text-2xl font-bold text-emerald-600 mt-2">
          {formatRM(totalDahBayar)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
          Baki Perlu Bayar
        </h3>
        <p className="text-2xl font-bold text-rose-500 mt-2">
          {formatRM(bakiPerluBayar)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-3">
          Status Item
        </h3>
        <div className="space-y-2 text-sm font-medium">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Belum</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {countBelum}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Deposit</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
              {countDeposit}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Selesai</span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
              {countSelesai}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
