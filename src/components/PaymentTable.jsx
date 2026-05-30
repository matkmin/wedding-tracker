import { Edit2, Trash2 } from "lucide-react";

const formatRM = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function PaymentTable({
  payments,
  onEdit,
  onDelete,
  filterStatus,
  setFilterStatus,
}) {
  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "All") return true;
    return p.status === filterStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!a.tarikh_bayar) return 1;
    if (!b.tarikh_bayar) return -1;
    return new Date(a.tarikh_bayar) - new Date(b.tarikh_bayar);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Belum":
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Belum
          </span>
        );
      case "Deposit":
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            Deposit
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb] overflow-hidden mb-16 shadow-sm">
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-medium text-slate-800">
          Senarai Pembayaran
        </h2>

        <div className="flex gap-1 bg-[#f9fafb] p-1 rounded-md border border-[#e5e7eb]">
          {["All", "Belum", "Deposit", "Selesai"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filterStatus === status
                  ? "bg-white text-slate-800 shadow-sm border border-[#e5e7eb]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {status === "All" ? "Semua" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-600">
          <thead className="bg-white text-slate-400 border-b border-[#e5e7eb]">
            <tr>
              <th className="px-4 py-3 font-medium">Perkara</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium text-right">Jumlah</th>
              <th className="px-4 py-3 font-medium text-right">Deposit</th>
              <th className="px-4 py-3 font-medium text-right">Baki</th>
              <th className="px-4 py-3 font-medium">Tarikh</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium">Nota</th>
              <th className="px-4 py-3 font-medium text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                  Tiada rekod.
                </td>
              </tr>
            ) : (
              sortedPayments.map((p, index) => {
                const baki = (Number(p.jumlah_penuh) || 0) - (Number(p.deposit_dibayar) || 0);

                let isOverdue = false;
                if (p.tarikh_bayar && p.status !== "Selesai") {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDate = new Date(p.tarikh_bayar);
                  if (dueDate < today) isOverdue = true;
                }

                const zebraClass = index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]";

                return (
                  <tr
                    key={p.id}
                    className={`${zebraClass} hover:bg-[#f3f4f6] transition-colors border-b border-[#e5e7eb] last:border-0`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-1.5">
                      {isOverdue && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" title="Tamat tempoh"></span>}
                      {p.perkara}
                    </td>
                    <td className="px-4 py-3">{p.vendor || "-"}</td>
                    <td className="px-4 py-3 text-right">{formatRM(p.jumlah_penuh)}</td>
                    <td className="px-4 py-3 text-right">{formatRM(p.deposit_dibayar)}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{formatRM(baki)}</td>
                    <td className={`px-4 py-3 ${isOverdue ? "text-red-500" : ""}`}>
                      {formatDate(p.tarikh_bayar)}
                    </td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(p.status)}</td>
                    <td className="px-4 py-3 max-w-[120px] truncate" title={p.nota}>
                      {p.nota || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3 text-slate-400">
                        <button onClick={() => onEdit(p)} className="hover:text-slate-700 transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Padam rekod ini?")) onDelete(p.id);
                          }}
                          className="hover:text-red-500 transition-colors" title="Padam"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
