const formatRM = (amount) => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export default function PaymentTable({
  payments,
  onEdit,
  onDelete,
  filterStatus,
  setFilterStatus
}) {
  const filteredPayments = payments.filter((p) => {
    if (filterStatus === 'All') return true;
    return p.status === filterStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!a.tarikh_bayar) return 1;
    if (!b.tarikh_bayar) return -1;
    return new Date(a.tarikh_bayar) - new Date(b.tarikh_bayar);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Belum':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Belum</span>;
      case 'Deposit':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Deposit</span>;
      case 'Selesai':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Senarai Pembayaran</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600 font-medium">Filter Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md text-sm p-1.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">Semua</option>
            <option value="Belum">Belum</option>
            <option value="Deposit">Deposit</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perkara</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Penuh</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deposit</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Baki</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarikh Bayar</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  Tiada rekod pembayaran dijumpai.
                </td>
              </tr>
            ) : (
              sortedPayments.map((p) => {
                const baki = (Number(p.jumlah_penuh) || 0) - (Number(p.deposit_dibayar) || 0);
                
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.perkara}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.vendor}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatRM(p.jumlah_penuh)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{formatRM(p.deposit_dibayar)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">{formatRM(baki)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.tarikh_bayar)}</td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={p.nota}>{p.nota || '-'}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Adakah anda pasti untuk padam rekod ini?')) {
                              onDelete(p.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Padam
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
