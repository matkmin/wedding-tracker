import { Edit, Trash2 } from "lucide-react";

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
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Belum
          </span>
        );
      case "Deposit":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Deposit
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-24">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Senarai Pembayaran
        </h2>

        {/* Filter Tabs Style */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          {["All", "Belum", "Deposit", "Selesai"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filterStatus === status
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {status === "All" ? "Semua" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Perkara
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Jumlah Penuh
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Deposit
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Baki
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tarikh Bayar
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Nota
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tindakan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {sortedPayments.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Tiada rekod pembayaran dijumpai.
                </td>
              </tr>
            ) : (
              sortedPayments.map((p, index) => {
                const baki =
                  (Number(p.jumlah_penuh) || 0) -
                  (Number(p.deposit_dibayar) || 0);

                // Check if overdue
                let isOverdue = false;
                if (p.tarikh_bayar && p.status !== "Selesai") {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDate = new Date(p.tarikh_bayar);
                  if (dueDate < today) {
                    isOverdue = true;
                  }
                }

                const zebraClass =
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50";

                return (
                  <tr
                    key={p.id}
                    className={`${zebraClass} hover:bg-slate-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {p.perkara}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {p.vendor || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 text-right">
                      {formatRM(p.jumlah_penuh)}
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-600 text-right">
                      {formatRM(p.deposit_dibayar)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-rose-500 text-right">
                      {formatRM(baki)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}
                    >
                      {formatDate(p.tarikh_bayar)}
                      {isOverdue && (
                        <span className="block text-[10px] text-red-500 mt-0.5">
                          Tamat tempoh
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(p.status)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-slate-500 max-w-[150px] truncate"
                      title={p.nota}
                    >
                      {p.nota || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => onEdit(p)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-md hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Adakah anda pasti untuk padam rekod ini?",
                              )
                            ) {
                              onDelete(p.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-50"
                          title="Padam"
                        >
                          <Trash2 size={18} />
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
