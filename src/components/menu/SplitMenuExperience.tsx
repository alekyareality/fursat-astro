import { useState, useMemo, useReducer, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DrinksCounterCanvas from './DrinksCounterCanvas';
import FoodTableCanvas from './FoodTableCanvas';
import CartDrawer from './CartDrawer';
import { type MenuItem, count, money, reducer, total, keyOf } from './cart';

type ActiveView = 'split' | 'drinks' | 'food';

export default function SplitMenuExperience({ items }: { items: MenuItem[] }) {
  const [view, setView] = useState<ActiveView>('split');
  const [drinkCat, setDrinkCat] = useState<string>('All');
  const [foodCat, setFoodCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [lines, dispatch] = useReducer(reducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const cartBtn = useRef<HTMLButtonElement>(null);

  // Filter Drinks vs Food (properly separating Sreemukhi's food vs drinks)
  const allDrinks = useMemo(() => items.filter(i => i.k === 'drink' || (i.k === 'sree' && i.c.toLowerCase().includes('drink'))), [items]);
  const allFood = useMemo(() => items.filter(i => i.k === 'food' || (i.k === 'sree' && !i.c.toLowerCase().includes('drink'))), [items]);

  // Categories
  const drinkCategories = useMemo(() => ['All', ...Array.from(new Set(allDrinks.map(i => i.c)))], [allDrinks]);
  const foodCategories = useMemo(() => ['All', ...Array.from(new Set(allFood.map(i => i.c)))], [allFood]);

  // Filtered lists
  const filteredDrinks = useMemo(() => {
    return allDrinks.filter(item => {
      const matchCat = drinkCat === 'All' || item.c === drinkCat;
      const matchSearch = !searchQuery || item.n.toLowerCase().includes(searchQuery.toLowerCase()) || (item.d && item.d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allDrinks, drinkCat, searchQuery]);

  const filteredFood = useMemo(() => {
    return allFood.filter(item => {
      const matchCat = foodCat === 'All' || item.c === foodCat;
      const matchSearch = !searchQuery || item.n.toLowerCase().includes(searchQuery.toLowerCase()) || (item.d && item.d.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDiet = dietFilter === 'all' || (dietFilter === 'veg' && item.v === 'veg') || (dietFilter === 'nonveg' && item.v === 'nonveg');
      return matchCat && matchSearch && matchDiet;
    });
  }, [allFood, foodCat, searchQuery, dietFilter]);

  const qtyOf = useCallback((i: MenuItem) => lines.find(l => l.key === keyOf(i))?.qty ?? 0, [lines]);
  const n = count(lines);

  return (
    <div className="relative w-full min-h-[92vh] bg-[#12190B] text-[#F4ECDA] overflow-hidden flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#E0A63C]/20 bg-[#17200F]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#E0A63C]">Interactive 3D Menu</span>
          <div className="h-4 w-[1px] bg-[#E0A63C]/30" />
          <p className="text-sm text-[#F4ECDA]/80 m-0">
            {view === 'split' && 'Click either 3D side to expand up to 3/4 screen'}
            {view === 'drinks' && '🍸 Drinks Counter (Expanded 3/4)'}
            {view === 'food' && '🍲 Royal Dining Table (Expanded 3/4)'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setView('split'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === 'split' 
                ? 'bg-[#E0A63C] text-[#1A1608] shadow-[0_0_15px_rgba(224,166,60,0.4)]' 
                : 'bg-[#F4ECDA]/5 text-[#F4ECDA] hover:bg-[#E0A63C]/20 border border-[#E0A63C]/30'
            }`}
          >
            ⚖️ 50 / 50 Split View
          </button>
          <button
            type="button"
            onClick={() => { setView('drinks'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === 'drinks' 
                ? 'bg-[#E0A63C] text-[#1A1608] shadow-[0_0_15px_rgba(224,166,60,0.4)]' 
                : 'bg-[#F4ECDA]/5 text-[#F4ECDA] hover:bg-[#E0A63C]/20 border border-[#E0A63C]/30'
            }`}
          >
            🍸 Drinks (3/4)
          </button>
          <button
            type="button"
            onClick={() => { setView('food'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === 'food' 
                ? 'bg-[#E0A63C] text-[#1A1608] shadow-[0_0_15px_rgba(224,166,60,0.4)]' 
                : 'bg-[#F4ECDA]/5 text-[#F4ECDA] hover:bg-[#E0A63C]/20 border border-[#E0A63C]/30'
            }`}
          >
            🍲 Food (3/4)
          </button>
        </div>
      </div>

      {/* Main 2-Half Split Container */}
      <div className="flex-1 flex flex-col md:flex-row relative w-full h-[calc(100vh-140px)] min-h-[640px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* ========================================================
            LEFT HALF: DRINKS COUNTER 3D MODEL
           ======================================================== */}
        <section 
          className={`relative flex flex-col border-b md:border-b-0 md:border-r border-[#E0A63C]/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            view === 'drinks' 
              ? 'md:w-3/4 w-full h-[75vh] md:h-full bg-gradient-to-br from-[#1C2713] to-[#12190B]' 
              : view === 'food' 
                ? 'md:w-1/4 w-full h-[25vh] md:h-full bg-[#0D1308] opacity-75 hover:opacity-100 cursor-pointer' 
                : 'md:w-1/2 w-full h-1/2 md:h-full bg-gradient-to-br from-[#1C2713] to-[#12190B] hover:border-[#E0A63C]/50 cursor-pointer'
          }`}
          onClick={() => {
            if (view !== 'drinks') {
              setView('drinks');
            }
          }}
        >
          {/* Header Overlay */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none max-w-sm">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E0A63C]/20 border border-[#E0A63C]/50 text-[#E0A63C] mb-2 backdrop-blur-md">
              Fursat Bar & Counter
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F4ECDA] m-0 drop-shadow-md">
              Drinks Counter
            </h2>
            <p className="text-xs md:text-sm text-[#F4ECDA]/70 mt-1 m-0">
              {view === 'drinks' ? 'Interactive 3D Bar Counter · Explore elixirs below' : 'Click to expand 3/4 screen & view cocktails, shakes & brews'}
            </p>
          </div>

          {/* Quick Peek Badge when Collapsed */}
          {view === 'food' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
              <span className="text-3xl mb-2">🍸</span>
              <b className="text-sm font-bold text-[#E0A63C]">Switch to Drinks Counter</b>
              <span className="text-xs text-[#F4ECDA]/60 mt-1">Expands to 3/4 screen</span>
            </div>
          )}

          {/* 3D Model Area */}
          <div className={`relative w-full ${view === 'drinks' ? 'h-[40vh] md:h-[45vh]' : 'h-full'} transition-all`}>
            <DrinksCounterCanvas isExpanded={view === 'drinks'} />
            
            {/* Interactive Badge Indicator */}
            {view === 'split' && (
              <div className="absolute bottom-6 left-6 z-10 pointer-events-none flex items-center gap-2 bg-[#17200F]/80 px-4 py-2 rounded-full border border-[#E0A63C]/40 backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E0A63C] animate-ping" />
                <span className="text-xs font-bold text-[#E0A63C]">Click to Expand to 3/4 Menu</span>
              </div>
            )}
          </div>

          {/* Interactive Menu List (Revealed when Drinks is 3/4) */}
          <AnimatePresence>
            {view === 'drinks' && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col overflow-hidden bg-[#12190B]/95 border-t border-[#E0A63C]/20 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search & Category Tabs */}
                <div className="p-4 border-b border-[#E0A63C]/15 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#17200F]/90">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                    {drinkCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setDrinkCat(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          drinkCat === cat 
                            ? 'bg-[#E0A63C] text-[#1A1608]' 
                            : 'bg-[#F4ECDA]/5 text-[#F4ECDA]/80 hover:bg-[#E0A63C]/10 border border-[#E0A63C]/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cocktails, shakes..."
                    className="bg-[#090D05] border border-[#E0A63C]/30 rounded-full px-4 py-1.5 text-xs text-[#F4ECDA] focus:outline-none focus:border-[#E0A63C] md:w-60"
                  />
                </div>

                {/* Drinks Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredDrinks.map((it) => (
                    <div 
                      key={keyOf(it)}
                      className="bg-[#17200F]/80 border border-[#E0A63C]/20 rounded-2xl p-4 flex flex-col justify-between hover:border-[#E0A63C]/50 transition-all hover:translate-y-[-2px] group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E0A63C]">{it.c}</span>
                          {it.a && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">21+</span>}
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#F4ECDA] group-hover:text-[#E0A63C] transition-colors m-0">
                          {it.n}
                        </h4>
                        {it.d && <p className="text-xs text-[#F4ECDA]/65 mt-1 line-clamp-2 m-0">{it.d}</p>}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F4ECDA]/10">
                        <b className="text-sm font-extrabold text-[#E0A63C]">{money(it.p)}</b>
                        <button
                          type="button"
                          onClick={() => dispatch({ t: 'add', item: it })}
                          className="px-3 py-1 rounded-full bg-[#E0A63C] text-[#1A1608] text-xs font-bold hover:bg-[#F4ECDA] transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <span>Add</span>
                          {qtyOf(it) > 0 && <span className="w-4 h-4 rounded-full bg-[#1A1608] text-[#E0A63C] text-[10px] grid place-items-center">{qtyOf(it)}</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>


        {/* ========================================================
            RIGHT HALF: FOOD IMAGES ON TABLE 3D MODEL
           ======================================================== */}
        <section 
          className={`relative flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            view === 'food' 
              ? 'md:w-3/4 w-full h-[75vh] md:h-full bg-gradient-to-bl from-[#251A0E] to-[#12190B]' 
              : view === 'drinks' 
                ? 'md:w-1/4 w-full h-[25vh] md:h-full bg-[#0D1308] opacity-75 hover:opacity-100 cursor-pointer' 
                : 'md:w-1/2 w-full h-1/2 md:h-full bg-gradient-to-bl from-[#251A0E] to-[#12190B] hover:border-[#E0A63C]/50 cursor-pointer'
          }`}
          onClick={() => {
            if (view !== 'food') {
              setView('food');
            }
          }}
        >
          {/* Header Overlay */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none max-w-sm">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E0A63C]/20 border border-[#E0A63C]/50 text-[#E0A63C] mb-2 backdrop-blur-md">
              Fursat Dining & Tandoor
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F4ECDA] m-0 drop-shadow-md">
              Food & Table Feast
            </h2>
            <p className="text-xs md:text-sm text-[#F4ECDA]/70 mt-1 m-0">
              {view === 'food' ? '3D Royal Dining Table · Click cloche to reveal secret dish' : 'Click to expand 3/4 screen & view kebabs, biryanis & curries'}
            </p>
          </div>

          {/* Quick Peek Badge when Collapsed */}
          {view === 'drinks' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
              <span className="text-3xl mb-2">🍲</span>
              <b className="text-sm font-bold text-[#E0A63C]">Switch to Food Table</b>
              <span className="text-xs text-[#F4ECDA]/60 mt-1">Expands to 3/4 screen</span>
            </div>
          )}

          {/* 3D Model Area */}
          <div className={`relative w-full ${view === 'food' ? 'h-[40vh] md:h-[45vh]' : 'h-full'} transition-all`}>
            <FoodTableCanvas isExpanded={view === 'food'} />
            
            {/* Interactive Badge Indicator */}
            {view === 'split' && (
              <div className="absolute bottom-6 right-6 z-10 pointer-events-none flex items-center gap-2 bg-[#17200F]/80 px-4 py-2 rounded-full border border-[#E0A63C]/40 backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E0A63C] animate-ping" />
                <span className="text-xs font-bold text-[#E0A63C]">Click to Expand to 3/4 Menu</span>
              </div>
            )}
          </div>

          {/* Interactive Menu List (Revealed when Food is 3/4) */}
          <AnimatePresence>
            {view === 'food' && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col overflow-hidden bg-[#12190B]/95 border-t border-[#E0A63C]/20 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search, Diet Filter & Category Tabs */}
                <div className="p-4 border-b border-[#E0A63C]/15 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#17200F]/90">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                    {foodCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFoodCat(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          foodCat === cat 
                            ? 'bg-[#E0A63C] text-[#1A1608]' 
                            : 'bg-[#F4ECDA]/5 text-[#F4ECDA]/80 hover:bg-[#E0A63C]/10 border border-[#E0A63C]/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Veg / Non-Veg Toggle */}
                    <div className="flex bg-[#090D05] p-1 rounded-full border border-[#E0A63C]/30 text-[11px] font-bold">
                      <button 
                        type="button" 
                        onClick={() => setDietFilter('all')}
                        className={`px-2.5 py-1 rounded-full ${dietFilter === 'all' ? 'bg-[#E0A63C] text-[#1A1608]' : 'text-[#F4ECDA]/70'}`}
                      >
                        All
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDietFilter('veg')}
                        className={`px-2.5 py-1 rounded-full ${dietFilter === 'veg' ? 'bg-green-600 text-white' : 'text-green-400'}`}
                      >
                        Veg
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDietFilter('nonveg')}
                        className={`px-2.5 py-1 rounded-full ${dietFilter === 'nonveg' ? 'bg-red-600 text-white' : 'text-red-400'}`}
                      >
                        Non-Veg
                      </button>
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search kebabs, biryanis..."
                      className="bg-[#090D05] border border-[#E0A63C]/30 rounded-full px-4 py-1.5 text-xs text-[#F4ECDA] focus:outline-none focus:border-[#E0A63C] w-48"
                    />
                  </div>
                </div>

                {/* Food Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredFood.map((it) => (
                    <div 
                      key={keyOf(it)}
                      className="bg-[#17200F]/80 border border-[#E0A63C]/20 rounded-2xl p-4 flex flex-col justify-between hover:border-[#E0A63C]/50 transition-all hover:translate-y-[-2px] group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E0A63C]">{it.c}</span>
                          <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${it.v === 'veg' ? 'border-green-500' : 'border-red-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${it.v === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#F4ECDA] group-hover:text-[#E0A63C] transition-colors m-0">
                          {it.n}
                        </h4>
                        {it.d && <p className="text-xs text-[#F4ECDA]/65 mt-1 line-clamp-2 m-0">{it.d}</p>}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F4ECDA]/10">
                        <b className="text-sm font-extrabold text-[#E0A63C]">{money(it.p)}</b>
                        <button
                          type="button"
                          onClick={() => dispatch({ t: 'add', item: it })}
                          className="px-3 py-1 rounded-full bg-[#E0A63C] text-[#1A1608] text-xs font-bold hover:bg-[#F4ECDA] transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <span>Add</span>
                          {qtyOf(it) > 0 && <span className="w-4 h-4 rounded-full bg-[#1A1608] text-[#E0A63C] text-[10px] grid place-items-center">{qtyOf(it)}</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Bottom Floating Order / Cart Bar */}
      <AnimatePresence>
        {n > 0 && !cartOpen && (
          <motion.div
            key="cart-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none"
          >
            <button
              ref={cartBtn}
              onClick={() => setCartOpen(true)}
              className="pointer-events-auto flex items-center justify-between gap-6 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E0A63C] to-[#C88D25] text-[#1A1608] font-bold text-sm shadow-[0_10px_35px_rgba(224,166,60,0.5)] transition-transform active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1A1608] text-[#E0A63C] text-xs font-extrabold grid place-items-center">{n}</span>
                <span>Review Selections</span>
              </div>
              <span className="text-base font-extrabold tabular-nums">{money(total(lines))}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} lines={lines} dispatch={dispatch} onClose={() => setCartOpen(false)} />
    </div>
  );
}
