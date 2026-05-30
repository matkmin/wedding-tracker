const formatRM = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount || 0);
};

export default function SummaryRow({ payments }) {
  const totalKeseluruhan = payments.reduce(
    (sum, p) => sum + (Number(p.jumlah_penuh) || 0),
    0,
  );
  const totalDahBayar = payments.reduce(
    (sum, p) => sum + (Number(p.deposit_dibayar) || 0),
    0,
  );
  const bakiPerluBayar = totalKeseluruhan - totalDahBayar;

  const weddingDate = new Date('2026-08-30');
  const today = new Date();
  const timeDiff = weddingDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const monthsDiff = Math.max(1, Math.ceil(daysDiff / 30));

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg mb-6 grid grid-cols-2 md:grid-cols-4 shadow-sm">
      <div className="p-4 border-b border-r border-[#e5e7eb] md:border-b-0">
        <div className="text-xs text-gray-500 mb-0.5">Total</div>
        <div className="text-sm sm:text-base font-medium text-slate-900 truncate">{formatRM(totalKeseluruhan)}</div>
      </div>
      <div className="p-4 border-b border-[#e5e7eb] md:border-b-0 md:border-r">
        <div className="text-xs text-gray-500 mb-0.5">Dah Bayar</div>
        <div className="text-sm sm:text-base font-medium text-slate-900 truncate">{formatRM(totalDahBayar)}</div>
      </div>
      <div className="p-4 border-r border-[#e5e7eb]">
        <div className="text-xs text-gray-500 mb-0.5">Baki</div>
        <div className="text-sm sm:text-base font-medium text-slate-900 truncate">{formatRM(bakiPerluBayar)}</div>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-0.5">Bulan Berbaki</div>
        <div className="text-sm sm:text-base font-medium text-slate-900 truncate">{monthsDiff} Bulan</div>
      </div>
    </div>
  );
}
