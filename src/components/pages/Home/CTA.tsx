import Link from "next/link";

const CTA = () => {
  return (
    <section className='px-6 pb-24 pt-4'>
      <div className='max-w-5xl mx-auto rounded-3xl overflow-hidden'>
        {/* Top decorative band */}
        <div className='h-1.5 bg-gradient-to-r from-green-400 via-green-600 to-emerald-500' />
        <div className='px-8 py-16 md:py-20 text-center bg-gradient-to-br from-green-600 via-green-700 to-emerald-800'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-7'>
            <span className='w-2 h-2 rounded-full bg-green-300 animate-pulse' />
            <span className='text-white/90 text-xs font-semibold tracking-wider uppercase'>
              Free Registration — কোনো hidden charge নেই
            </span>
          </div>
          <h2 className='text-[clamp(2rem,6vw,3.75rem)] font-black text-white mb-4 leading-tight'>
            আজই শুরু করুন
          </h2>
          <p className='text-green-100/80 mb-10 max-w-sm mx-auto text-sm leading-relaxed'>
            Join farmers who have taken back control of their prices. Fair
            trade, every harvest.
          </p>
          <div className='flex flex-wrap gap-3 justify-center'>
            <Link
              href='/register'
              className='px-9 py-3.5 rounded-xl bg-white text-green-700 text-sm font-bold hover:bg-green-50 active:scale-95 transition-all shadow-xl'>
              Register as Farmer
            </Link>
            <Link
              href='/register'
              className='px-9 py-3.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all'>
              Register as Buyer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
