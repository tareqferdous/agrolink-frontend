import { FarmerAnalyticsCard } from "./types";

interface AnalyticsStatsGridProps {
  cards: FarmerAnalyticsCard[];
}

export default function AnalyticsStatsGrid({ cards }: AnalyticsStatsGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {cards.map((card) => (
        <div
          key={card.label}
          className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group'>
          <div className={`h-1 bg-linear-to-r ${card.valueBg}`} />

          <div className='p-6'>
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-5 ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
              {card.icon}
            </div>

            <p className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
              {card.value}
            </p>

            <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1'>
              {card.label}
            </p>

            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
              {card.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
