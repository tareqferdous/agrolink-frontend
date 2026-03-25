import { AdminStatCard } from "./types";

interface AnalyticsStatsGridProps {
  loading: boolean;
  cards: AdminStatCard[];
}

export default function AnalyticsStatsGrid({
  loading,
  cards,
}: AnalyticsStatsGridProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl border border-gray-100 p-6 space-y-4'>
            <div className='w-12 h-12 rounded-xl bg-gray-100 animate-pulse' />
            <div className='h-8 bg-gray-100 rounded animate-pulse w-24' />
            <div className='h-3 bg-gray-100 rounded animate-pulse w-32' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
      {cards.map((card) => (
        <div
          key={card.label}
          className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group'>
          <div className={`h-1 bg-gradient-to-r ${card.valueBg}`} />

          <div className='p-6'>
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-5 ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
              {card.icon}
            </div>

            <p className='text-3xl font-bold text-gray-900 tracking-tight'>
              {card.value}
            </p>
            <p className='text-sm font-semibold text-gray-700 mt-1'>
              {card.label}
            </p>
            <p className='text-xs text-gray-400 mt-1'>{card.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
