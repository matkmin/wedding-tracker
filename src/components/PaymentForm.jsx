import { useState, useEffect } from "react";

export default function PaymentForm({ payment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    perkara: "",
    vendor: "",
    jumlah_penuh: "",
    deposit_dibayar: "",
    tarikh_bayar: "",
    status: "Belum",
    nota: "",
  });

  useEffect(() => {
    if (payment) {
      // Use setTimeout to avoid synchronous state update during render
      setTimeout(() => {
        setFormData({
          perkara: payment.perkara || "",
          vendor: payment.vendor || "",
          jumlah_penuh: payment.jumlah_penuh || "",
          deposit_dibayar: payment.deposit_dibayar || "",
          tarikh_bayar: payment.tarikh_bayar || "",
          status: payment.status || "Belum",
          nota: payment.nota || "",
        });
      }, 0);
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      jumlah_penuh: formData.jumlah_penuh ? Number(formData.jumlah_penuh) : 0,
      deposit_dibayar: formData.deposit_dibayar
        ? Number(formData.deposit_dibayar)
        : 0,
      tarikh_bayar: formData.tarikh_bayar || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {payment ? "Edit Pembayaran" : "Tambah Pembayaran"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Perkara *
              </label>
              <input
                type="text"
                name="perkara"
                required
                value={formData.perkara}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                placeholder="Contoh: Katering, Pelamin..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Vendor
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                placeholder="Nama syarikat/vendor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Jumlah Penuh (RM) *
              </label>
              <input
                type="number"
                name="jumlah_penuh"
                required
                min="0"
                step="0.01"
                value={formData.jumlah_penuh}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Deposit Dibayar (RM)
              </label>
              <input
                type="number"
                name="deposit_dibayar"
                min="0"
                step="0.01"
                value={formData.deposit_dibayar}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tarikh Bayar
              </label>
              <input
                type="date"
                name="tarikh_bayar"
                value={formData.tarikh_bayar}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900 bg-white"
              >
                <option value="Belum">Belum</option>
                <option value="Deposit">Deposit</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nota
              </label>
              <textarea
                name="nota"
                rows="3"
                value={formData.nota}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg shadow-sm p-2.5 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                placeholder="Nota tambahan..."
              ></textarea>
            </div>
          </div>

          <div className="pt-5 flex justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-rose-500 hover:bg-rose-600 font-medium transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
