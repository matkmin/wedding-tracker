import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import SummaryCards from "./components/SummaryCards";
import PaymentTable from "./components/PaymentTable";
import PaymentForm from "./components/PaymentForm";

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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Wedding Payment Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Urus pembayaran perbelanjaan perkahwinan anda
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium transition-colors"
          >
            + Tambah Bayaran
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <SummaryCards payments={payments} />
            <PaymentTable
              payments={payments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </>
        )}
      </div>

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
