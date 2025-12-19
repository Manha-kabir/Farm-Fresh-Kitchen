
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { COMMON_INGREDIENTS, FarmIcons, FARM_QUOTES } from './constants';
import { AppState, Recipe, Ingredient } from './types';
import { generateRecipes } from './services/gemini';
import FarmLoader from './components/FarmLoader';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('home');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [otherIngredients, setOtherIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [randomQuote, setRandomQuote] = useState('');
  const [visibleIngredients, setVisibleIngredients] = useState<Ingredient[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Initialize ingredients
  useEffect(() => {
    setVisibleIngredients(COMMON_INGREDIENTS.slice(0, 12));
  }, []);

  // Persist saved recipes
  useEffect(() => {
    const stored = localStorage.getItem('freshfarm_saved');
    if (stored) {
      try {
        setSavedRecipes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load saved recipes");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freshfarm_saved', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    setRandomQuote(FARM_QUOTES[Math.floor(Math.random() * FARM_QUOTES.length)]);
  }, [view]);

  const toggleIngredient = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const shuffleIngredients = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      // Logic: Keep selected ones in place, replace non-selected ones with others from the pool
      const selectedPool = COMMON_INGREDIENTS.filter(i => selectedIds.has(i.id));
      const availablePool = COMMON_INGREDIENTS.filter(i => !selectedIds.has(i.id));
      
      // Shuffle available
      const shuffled = [...availablePool].sort(() => Math.random() - 0.5);
      
      // Take enough to fill up to 12 or 16
      const nextBatch = shuffled.slice(0, Math.max(12, 16 - selectedPool.length));
      
      // Combine and deduplicate
      const combined = [...selectedPool, ...nextBatch];
      setVisibleIngredients(combined);
      setIsShuffling(false);
    }, 400); // Animation duration
  }, [selectedIds]);

  const handleGenerate = async () => {
    setError(null);
    const names = COMMON_INGREDIENTS
      .filter(i => selectedIds.has(i.id))
      .map(i => i.name);
    
    if (otherIngredients.trim()) {
      names.push(...otherIngredients.split(',').map(s => s.trim()));
    }

    if (names.length === 0) {
      setError("Please select at least one ingredient!");
      return;
    }

    setView('loading');
    try {
      const results = await generateRecipes(names);
      setRecipes(results);
      setView('recipes');
    } catch (err) {
      setError("Oops! The tractor got stuck. Please try again.");
      setView('fridge');
    }
  };

  const toggleSaveRecipe = (recipe: Recipe) => {
    if (savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const isSaved = (id: string) => savedRecipes.some(r => r.id === id);

  const reset = () => {
    setSelectedIds(new Set());
    setOtherIngredients('');
    setRecipes([]);
    setView('home');
  };

  return (
    <div className="min-h-screen farm-gradient pb-10">
      {/* Decorative background elements */}
      <div className="fixed top-10 right-10 opacity-30 pointer-events-none">
        <FarmIcons.Sun />
      </div>
      <div className="fixed bottom-10 left-10 opacity-20 pointer-events-none rotate-45">
        <FarmIcons.Leaf className="w-20 h-20 text-green-600" />
      </div>

      {/* Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300 border-8 border-white">
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-green-100 flex items-center justify-center text-2xl hover:bg-green-50 transition"
            >
              ✕
            </button>
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{selectedRecipe.difficulty}</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">⏳ {selectedRecipe.prepTime} Prep</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">🍳 {selectedRecipe.cookTime} Cook</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">👥 Serves {selectedRecipe.servings}</span>
              </div>
              <h2 className="text-4xl font-bold text-green-900 mb-4 font-comfortaa">{selectedRecipe.title}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed italic">"{selectedRecipe.description}"</p>

              <div className="grid md:grid-cols-2 gap-10">
                <section>
                  <h3 className="font-bold text-green-800 text-xl mb-4 flex items-center">
                    <span className="mr-2">🌾</span> Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-xl">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 shrink-0"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-bold text-blue-800 text-xl mt-8 mb-4 flex items-center">
                    <span className="mr-2">🥣</span> Tools Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.tools.map((tool, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-sm">
                        {tool}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 text-xl mb-4 flex items-center">
                    <span className="mr-2">🔥</span> Directions
                  </h3>
                  <ol className="space-y-4">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className="relative pl-8 text-gray-700 leading-relaxed">
                        <span className="absolute left-0 top-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              <div className="mt-10 p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-100 flex items-start gap-4">
                <span className="text-3xl">🧑‍🌾</span>
                <div>
                  <p className="font-bold text-yellow-900 mb-1 font-comfortaa">Chef's Farm Tip</p>
                  <p className="text-yellow-800 italic">{selectedRecipe.chefTip}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => toggleSaveRecipe(selectedRecipe)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 ${
                    isSaved(selectedRecipe.id) 
                    ? 'bg-red-50 text-red-600 border-2 border-red-100' 
                    : 'bg-green-500 text-white shadow-lg shadow-green-200'
                  }`}
                >
                  {isSaved(selectedRecipe.id) ? '❤️ Recipe Saved' : '🤍 Save for Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="max-w-3xl mx-auto px-4 pt-6 flex justify-between items-center relative z-10">
        <button 
          onClick={reset}
          className="text-2xl font-bold text-green-800 font-comfortaa flex items-center gap-2"
        >
          <span>🚜</span> FreshFarm
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('saved')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              view === 'saved' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-green-700 border-2 border-green-100'
            }`}
          >
            My Cookbook ({savedRecipes.length})
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-10">
        {/* Farm Quote Bubble */}
        {(view === 'home' || view === 'fridge' || view === 'saved') && (
          <div className="mb-8 text-center animate-in slide-in-from-top-4 duration-1000">
            <span className="inline-block px-6 py-3 bg-white/80 backdrop-blur rounded-3xl border border-green-100 text-green-800 font-medium italic shadow-sm relative">
              "{randomQuote}"
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 border-r border-b border-green-100 rotate-45"></div>
            </span>
          </div>
        )}

        {view === 'home' && (
          <div className="text-center space-y-8 py-10">
            <div className="relative inline-block">
              <span className="absolute -top-10 -right-10 text-6xl animate-bounce">👩‍🌾</span>
              <h1 className="text-6xl md:text-8xl font-bold text-green-800 drop-shadow-sm font-comfortaa">
                What's Cooking?
              </h1>
            </div>
            <p className="text-2xl text-green-700 max-w-md mx-auto leading-relaxed font-light">
              Your personal farm-to-table assistant. Let's make something delicious with what you have!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={() => setView('fridge')}
                className="px-12 py-6 bg-green-500 hover:bg-green-600 text-white rounded-[2.5rem] text-2xl font-bold shadow-xl shadow-green-200 transform transition active:scale-95 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Explore My Fridge</span>
                <span className="text-3xl">🧺</span>
              </button>
            </div>
          </div>
        )}

        {view === 'fridge' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold text-green-800 font-comfortaa">Harvest Time...</h2>
                <p className="text-green-600 mt-2">Pick your fresh ingredients!</p>
              </div>
              <button
                onClick={shuffleIngredients}
                className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3 rounded-full shadow-lg transform transition hover:rotate-2 active:scale-95"
              >
                <span className={isShuffling ? "animate-spin" : ""}>🔄</span>
                <span>Shuffle Pantry</span>
              </button>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all duration-300 ${isShuffling ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
              {visibleIngredients.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleIngredient(item.id)}
                  className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center space-y-2 shadow-md hover:rotate-2 group ${
                    selectedIds.has(item.id)
                      ? 'bg-green-100 border-green-500 scale-105 ring-8 ring-green-100 z-10'
                      : 'bg-white border-transparent hover:border-green-200'
                  }`}
                >
                  <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-bold text-green-900">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-green-50">
              <label className="block text-green-800 font-bold mb-4 font-comfortaa text-xl">Any other secret ingredients?</label>
              <input
                type="text"
                placeholder="e.g. kale, feta, pumpkin (comma separated)"
                className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-300 focus:bg-white outline-none transition text-gray-900 text-lg"
                value={otherIngredients}
                onChange={(e) => setOtherIngredients(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-center font-bold animate-bounce p-4 bg-red-50 rounded-2xl border border-red-100">{error}</p>}

            <div className="sticky bottom-6 flex space-x-4 bg-white/40 backdrop-blur-md p-2 rounded-3xl shadow-sm border border-white/50">
              <button
                onClick={() => setView('home')}
                className="flex-1 py-5 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl font-bold transition shadow-md border border-gray-100"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                className="flex-[2] py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition shadow-lg transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
              >
                <span className="text-xl">Let's Cook!</span>
                <span className="text-2xl">✨</span>
              </button>
            </div>
          </div>
        )}

        {view === 'loading' && <FarmLoader />}

        {(view === 'recipes' || view === 'saved') && (
          <div className="space-y-10 py-6 animate-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-4xl font-bold text-green-800 font-comfortaa">
                {view === 'saved' ? 'Your Personal Cookbook' : 'Fresh-Picked Recipes'}
              </h2>
              {view === 'recipes' && (
                <button
                  onClick={reset}
                  className="p-4 bg-green-100 text-green-700 rounded-3xl hover:bg-green-200 transition font-bold"
                >
                  Reset 🔄
                </button>
              )}
            </div>

            {(view === 'saved' && savedRecipes.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-green-200">
                <span className="text-7xl block mb-4 animate-float">📭</span>
                <p className="text-xl text-green-800 font-medium">Your cookbook is empty!</p>
                <button 
                  onClick={() => setView('fridge')}
                  className="mt-6 text-green-600 font-bold hover:underline"
                >
                  Start exploring my fridge 🧺
                </button>
              </div>
            ) : (
              <div className="grid gap-8">
                {(view === 'recipes' ? recipes : savedRecipes).map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="bg-white rounded-[3rem] p-8 shadow-xl border-b-8 border-green-500 cursor-pointer group hover:scale-[1.02] transition-all transform duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 flex flex-col gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition shadow-md bg-white border border-gray-100 hover:scale-110 ${isSaved(recipe.id) ? 'text-red-500' : 'text-gray-300'}`}
                      >
                        {isSaved(recipe.id) ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">⏱️ {recipe.prepTime}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">🌿 {recipe.difficulty}</span>
                    </div>

                    <h3 className="text-3xl font-bold text-green-900 mb-2 font-comfortaa group-hover:text-green-600 transition-colors">{recipe.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 italic">"{recipe.description}"</p>

                    <div className="flex justify-between items-center text-green-700 font-bold">
                      <span className="flex items-center gap-2">
                        <span>🥬</span> {recipe.ingredients.length} items
                      </span>
                      <span className="bg-green-50 px-4 py-2 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                        View Detailed Steps →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'recipes' && (
              <button
                onClick={() => setView('fridge')}
                className="w-full py-6 bg-white border-4 border-green-500 text-green-600 rounded-[2.5rem] font-bold text-2xl hover:bg-green-50 transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Need more options?</span>
                <span>🥒</span>
              </button>
            )}
          </div>
        )}
      </main>
      
      <footer className="text-center mt-20 text-green-600/50 text-sm font-medium">
        <p>Made with fresh air and sunshine at FreshFarm Kitchen</p>
      </footer>
    </div>
  );
};

export default App;
