export default function Countdown({ bakiPerluBayar }) {
  // Wedding date: 30/08/2026 (YYYY-MM-DD format for Date object)
  const weddingDate = new Date('2026-08-30');
  const today = new Date();
  
  // Calculate difference in time
  const timeDiff = weddingDate.getTime() - today.getTime();
  
  // Calculate days difference
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Calculate months remaining (approximate)
  const monthsDiff = Math.max(1, Math.ceil(daysDiff / 30));
  
  // Monthly budget needed
  const monthlyBudget = bakiPerluBayar > 0 ? bakiPerluBayar / monthsDiff : 0;
  
  // Urgency color logic
  let urgencyColor = 'text-green-600';
  let urgencyBg = 'bg-green-50';
  let urgencyBorder = 'border-green-200';
  
  if (daysDiff < 90) {
    urgencyColor = 'text-red-600';
    urgencyBg = 'bg-red-50';
    urgencyBorder = 'border-red-200';
  } else if (daysDiff <= 180) {
    urgencyColor = 'text-yellow-600';
    urgencyBg = 'bg-yellow-50';
    urgencyBorder = 'border-yellow-200';
  }

  const formatRM = (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount || 0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-left flex-1">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Menjelang Hari Bahagia</h2>
        <div className={`inline-flex items-baseline px-4 py-2 rounded-lg border ${urgencyBg} ${urgencyBorder}`}>
          <span className={`text-4xl font-bold ${urgencyColor}`}>{daysDiff > 0 ? daysDiff : 0}</span>
          <span className={`ml-2 text-sm font-medium ${urgencyColor}`}>Hari Lagi</span>
        </div>
      </div>
      
      <div className="hidden md:block w-px h-16 bg-slate-200"></div>
      
      <div className="text-center md:text-right flex-1">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Anggaran Simpanan Diperlukan</h2>
        <div className="text-3xl font-bold text-slate-800">
          {formatRM(monthlyBudget)}
          <span className="text-sm font-normal text-slate-500 ml-1">/ bulan</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Berdasarkan baki {formatRM(bakiPerluBayar)} dalam {monthsDiff} bulan</p>
      </div>
    </div>
  );
}
