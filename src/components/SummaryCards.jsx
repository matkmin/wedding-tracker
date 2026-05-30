import React from "react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Total Keseluruhan</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {formatRM(totalKeseluruhan)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Total Dah Bayar</h3>
        <p className="text-2xl font-bold text-green-600 mt-2">
          {formatRM(totalDahBayar)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Baki Perlu Bayar</h3>
        <p className="text-2xl font-bold text-red-600 mt-2">
          {formatRM(bakiPerluBayar)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Status Item</h3>
        <div className="mt-2 space-y-1 text-sm font-medium">
          <div className="flex justify-between items-center text-red-600">
            <span>Belum:</span>
            <span className="bg-red-100 px-2 py-0.5 rounded-full">
              {countBelum}
            </span>
          </div>
          <div className="flex justify-between items-center text-yellow-600">
            <span>Deposit:</span>
            <span className="bg-yellow-100 px-2 py-0.5 rounded-full">
              {countDeposit}
            </span>
          </div>
          <div className="flex justify-between items-center text-green-600">
            <span>Selesai:</span>
            <span className="bg-green-100 px-2 py-0.5 rounded-full">
              {countSelesai}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
