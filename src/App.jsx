import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Plus } from "lucide-react";
import SummaryCards from "./components/SummaryCards";
import PaymentTable from "./components/PaymentTable";
import PaymentForm from "./components/PaymentForm";
import Countdown from "./components/Countdown";
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
      setError(
        "Gagal mengambil data. Sila periksa sambungan internet atau tetapan Supabase.",
      );
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
        // Update
        const { data, error } = await supabase
          .from("payments")
          .update(paymentData)
          .eq("id", editingPayment.id)
          .select()
          .single();

        if (error) throw error;
        setPayments(
          payments.map((p) => (p.id === editingPayment.id ? data : p)),
        );
      } else {
        // Insert
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

  const totalKeseluruhan = payments.reduce(
    (sum, p) => sum + (Number(p.jumlah_penuh) || 0),
    0,
  );
  const totalDahBayar = payments.reduce(
    (sum, p) => sum + (Number(p.deposit_dibayar) || 0),
    0,
  );
  const bakiPerluBayar = totalKeseluruhan - totalDahBayar;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl leading-none">
                W
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Wedding Tracker
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            30 Ogos 2026
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg shadow-sm"
            role="alert"
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <>
            <Countdown bakiPerluBayar={bakiPerluBayar} />

            <SummaryCards payments={payments} />

            {payments.length > 0 && (
              <Charts
                payments={payments}
                totalKeseluruhan={totalKeseluruhan}
                totalDahBayar={totalDahBayar}
                bakiPerluBayar={bakiPerluBayar}
              />
            )}

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

      {/* Floating Add Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-8 right-8 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40 focus:outline-none focus:ring-4 focus:ring-rose-500/30"
        title="Tambah Bayaran"
      >
        <Plus size={28} />
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
