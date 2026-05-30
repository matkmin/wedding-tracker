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
    <div className="fixed inset-0 bg-slate-900/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#e5e7eb] text-sm overflow-y-auto max-h-[90vh]">
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[#e5e7eb] flex justify-between items-center bg-[#f9fafb] rounded-t-lg sticky top-0 z-10">
          <h2 className="font-medium text-slate-800">
            {payment ? "Edit Pembayaran" : "Tambah Pembayaran"}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Perkara *</label>
              <input
                type="text"
                name="perkara"
                required
                value={formData.perkara}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
                placeholder="Contoh: Katering"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Vendor</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
                placeholder="Nama syarikat"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Jumlah Penuh (RM) *</label>
              <input
                type="number"
                name="jumlah_penuh"
                required
                min="0"
                step="0.01"
                value={formData.jumlah_penuh}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Deposit Dibayar (RM)</label>
              <input
                type="number"
                name="deposit_dibayar"
                min="0"
                step="0.01"
                value={formData.deposit_dibayar}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Tarikh Bayar</label>
              <input
                type="date"
                name="tarikh_bayar"
                value={formData.tarikh_bayar}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800 bg-white"
              >
                <option value="Belum">Belum</option>
                <option value="Deposit">Deposit</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Nota</label>
              <textarea
                name="nota"
                rows="2"
                value={formData.nota}
                onChange={handleChange}
                className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 text-xs text-slate-800"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 sm:py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 sm:py-1.5 rounded-md text-xs font-medium bg-[#1e293b] text-white hover:bg-slate-800 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
