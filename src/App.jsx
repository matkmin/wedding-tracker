import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Plus } from "lucide-react";
import SummaryRow from "./components/SummaryRow";
import PaymentTable from "./components/PaymentTable";
import PaymentForm from "./components/PaymentForm";
import Charts from "./components/Charts";

function App() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error.message);
      setError("Gagal mengambil data. Sila periksa sambungan internet atau tetapan Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAdd = () => {
    setEditingPayment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("payments").delete().eq("id", id);
      if (error) throw error;
      setPayments(payments.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting payment:", error.message);
      alert("Gagal memadam data.");
    }
  };

  const handleSavePayment = async (paymentData) => {
    try {
      if (editingPayment) {
        const { data, error } = await supabase
          .from("payments")
          .update(paymentData)
          .eq("id", editingPayment.id)
          .select()
          .single();

        if (error) throw error;
        setPayments(payments.map((p) => (p.id === editingPayment.id ? data : p)));
      } else {
        const { data, error } = await supabase
          .from("payments")
          .insert([paymentData])
          .select()
          .single();

        if (error) throw error;
        setPayments([data, ...payments]);
      }
      setIsFormOpen(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Error saving payment:", error.message);
      alert("Gagal menyimpan data.");
    }
  };

  const totalKeseluruhan = payments.reduce((sum, p) => sum + (Number(p.jumlah_penuh) || 0), 0);
  const totalDahBayar = payments.reduce((sum, p) => sum + (Number(p.deposit_dibayar) || 0), 0);
  const bakiPerluBayar = totalKeseluruhan - totalDahBayar;

  const weddingDate = new Date('2026-08-30');
  const today = new Date();
  const daysDiff = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium text-slate-800">
              Wedding Tracker
            </h1>
          </div>
          <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
              30 Ogos 2026
            </div>
            <div className="text-[10px] sm:text-xs font-medium bg-[#f3f4f6] text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md whitespace-nowrap">
              {daysDiff > 0 ? `${daysDiff} hari lagi` : 'Hari ini!'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-xs text-slate-500">Memuatkan data...</div>
          </div>
        ) : (
          <>
            {payments.length > 0 && (
              <Charts
                payments={payments}
                totalKeseluruhan={totalKeseluruhan}
                totalDahBayar={totalDahBayar}
                bakiPerluBayar={bakiPerluBayar}
              />
            )}

            <SummaryRow payments={payments} />

            <PaymentTable
              payments={payments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </>
        )}
      </main>

      <button
        onClick={handleAdd}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#1e293b] hover:bg-slate-800 text-white rounded-full shadow flex items-center justify-center transition-colors z-40 focus:outline-none"
        title="Tambah Bayaran"
      >
        <Plus size={20} />
      </button>

      {isFormOpen && (
        <PaymentForm
          payment={editingPayment}
          onSave={handleSavePayment}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
