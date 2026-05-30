import { useState, useEffect } from 'react';

export default function PaymentForm({ payment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    perkara: '',
    vendor: '',
    jumlah_penuh: '',
    deposit_dibayar: '',
    tarikh_bayar: '',
    status: 'Belum',
    nota: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        perkara: payment.perkara || '',
        vendor: payment.vendor || '',
        jumlah_penuh: payment.jumlah_penuh || '',
        deposit_dibayar: payment.deposit_dibayar || '',
        tarikh_bayar: payment.tarikh_bayar || '',
        status: payment.status || 'Belum',
        nota: payment.nota || ''
      });
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
      deposit_dibayar: formData.deposit_dibayar ? Number(formData.deposit_dibayar) : 0,
      tarikh_bayar: formData.tarikh_bayar || null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {payment ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Perkara *</label>
              <input
                type="text"
                name="perkara"
                required
                value={formData.perkara}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Katering, Pelamin..."
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama syarikat/vendor"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penuh (RM) *</label>
              <input
                type="number"
                name="jumlah_penuh"
                required
                min="0"
                step="0.01"
                value={formData.jumlah_penuh}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Dibayar (RM)</label>
              <input
                type="number"
                name="deposit_dibayar"
                min="0"
                step="0.01"
                value={formData.deposit_dibayar}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Bayar</label>
              <input
                type="date"
                name="tarikh_bayar"
                value={formData.tarikh_bayar}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Belum">Belum</option>
                <option value="Deposit">Deposit</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
              <textarea
                name="nota"
                rows="3"
                value={formData.nota}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nota tambahan..."
              ></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-medium"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
