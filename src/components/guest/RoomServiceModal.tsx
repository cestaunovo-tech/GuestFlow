import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { MenuItem } from '../../types';
import { X, Plus, Minus, ShoppingBag, Clock, Sparkles, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const RoomServiceModal: React.FC<RoomServiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    t,
    currentRoom,
    menuItems,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    submitRoomServiceOrder,
  } = useGuestFlow();

  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [productCustomNote, setProductCustomNote] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProduct) {
          setSelectedProduct(null);
        } else if (showCartDrawer) {
          setShowCartDrawer(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedProduct, showCartDrawer, onClose]);

  if (!isOpen) return null;

  const categories = ['Todos', 'Desayuno', 'Entradas', 'Platos principales', 'Postres', 'Bebidas'];

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === 'Todos') return true;
    return item.category === activeCategory;
  });

  const totalAmount = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    try {
      const order = submitRoomServiceOrder(kitchenNotes);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      onSuccess(order.code);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddModalProduct = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, productCustomNote);
      setSelectedProduct(null);
      setProductCustomNote('');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
                🍽️
              </div>
              <div>
                <h3 className="text-lg font-bold">Room Service Gourmet</h3>
                <p className="text-xs text-teal-200/80">
                  Entrega directa a Hab. {currentRoom?.number || 'Sin asignar'} • Tiempo estimado: 20-25 min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart trigger button */}
              <button
                type="button"
                onClick={() => setShowCartDrawer(!showCartDrawer)}
                className="relative px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>${totalAmount}</span>
                {totalItemsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer border border-white/15"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-teal-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area: Grid of dishes + Floating Cart Drawer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((dish) => {
              const inCartItem = cart.find((i) => i.id === dish.id);

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white font-extrabold text-xs">
                      ${dish.price} USD
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-700 font-semibold text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>{dish.preparationTimeMinutes} min</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold uppercase text-teal-700 tracking-wider">
                          {dish.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-1">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>

                      {dish.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {dish.allergens.map((alg) => (
                            <span
                              key={alg}
                              className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-semibold"
                            >
                              {alg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {inCartItem ? (
                        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateCartQuantity(dish.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-teal-800 font-bold hover:bg-teal-100 flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-teal-900 px-1">
                            {inCartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(dish.id, 1)}
                            className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 flex items-center justify-center text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(dish)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addToCart}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedProduct(dish)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition underline"
                      >
                        Personalizar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Sidebar / Drawer */}
          {showCartDrawer && (
            <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl p-5 flex flex-col z-20 animate-in slide-in-from-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal-600" />
                  <h4 className="text-base font-bold text-slate-900">{t.cart}</h4>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">{t.emptyCart}</p>
                    <p className="text-[11px] mt-1">Elige tus platillos favoritos del menú.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-teal-700 font-extrabold">
                          ${item.price} x {item.quantity} = ${item.price * item.quantity} USD
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">Nota: {item.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.orderNotes}
                    </label>
                    <input
                      type="text"
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      placeholder="Ej: salsa aparte, sin picante, etc."
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm font-extrabold text-slate-900">
                    <span>{t.total}:</span>
                    <span className="text-lg text-teal-700">${totalAmount} USD</span>
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.confirmOrder}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar with cart summary or quick actions */}
        {!showCartDrawer && (
          <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between px-4 sm:px-6 shrink-0 shadow-lg gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Cerrar menú</span>
            </button>

            {cart.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {totalItemsCount}
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 leading-none">{totalItemsCount} platos</p>
                    <p className="text-sm font-black text-slate-900 leading-tight">${totalAmount} USD</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCartDrawer(true)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition cursor-pointer"
                >
                  <span>Ver Pedido & Confirmar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Selecciona platos arriba o:</span>
                <button
                  type="button"
                  onClick={() => {
                    const firstItem = menuItems[0];
                    if (firstItem) {
                      addToCart(firstItem);
                      setShowCartDrawer(true);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pedir Desayuno Continental ($18)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Customization modal */}
        {selectedProduct && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProduct(null);
            }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl cursor-default"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">Personalizar: {selectedProduct.name}</h4>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Cerrar personalización"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">{selectedProduct.description}</p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instrucciones especiales para cocina
                </label>
                <textarea
                  value={productCustomNote}
                  onChange={(e) => setProductCustomNote(e.target.value)}
                  placeholder="Ej: término de carne bien cocido, sin aderezo, alérgico a la nuez..."
                  rows={3}
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 resize-none text-slate-800"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddModalProduct}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  Agregar al pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
