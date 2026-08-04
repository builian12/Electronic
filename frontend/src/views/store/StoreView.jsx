import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from '../../services/authService';
import apiClient from '../../services/api';

export default function StoreView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const history = useHistory();

  const load = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('productos/'),
        apiClient.get('categorias/'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error al cargar tienda', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLogout = () => {
    logout();
    history.push('/auth/login');
  };

  const getCategoryName = (catId) => {
    if (typeof catId === 'object' && catId !== null) return catId.nombre;
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.nombre : '—';
  };

  const filteredProducts = selectedCat === 'all'
    ? products
    : products.filter(p => (typeof p.categoria === 'object' ? p.categoria.id : p.categoria) === parseInt(selectedCat));

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[productId] <= 1) delete next[productId];
      else next[productId]--;
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find(p => p.id === parseInt(id));
    return sum + (prod ? parseFloat(prod.precio_unitario) * qty : 0);
  }, 0);

  const handleBuy = async () => {
    if (cartCount === 0) return;
    setBuying(true);
    setSuccessMsg('');
    try {
      const detalles = Object.entries(cart).map(([id, qty]) => {
        const prod = products.find(p => p.id === parseInt(id));
        return {
          producto: parseInt(id),
          cantidad: qty,
          precio_unitario_historico: parseFloat(prod.precio_unitario),
          subtotal: parseFloat(prod.precio_unitario) * qty,
        };
      });

      await apiClient.post('ventas/', {
        total_venta: cartTotal.toFixed(2),
        estado: 'Completado',
        detalles,
      });

      setCart({});
      setSuccessMsg(`¡Compra realizada con éxito! Total: $${cartTotal.toFixed(2)}`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Error al comprar', err);
      setSuccessMsg('');
    } finally {
      setBuying(false);
    }
  };

  const username = localStorage.getItem('username') || 'cliente';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <i className="fas fa-bolt"></i>
            </div>
            <h1 className="text-xl font-bold">Tienda Electronic</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">
              <i className="fas fa-user-circle mr-1"></i> {username}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors border border-white/20"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Banner */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a la tienda</h2>
          <p className="text-gray-600">Los mejores productos de tecnología al mejor precio.</p>
        </div>

        {successMsg && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <i className="fas fa-check-circle"></i> {successMsg}
          </div>
        )}

        {/* Category filter + Cart */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCat('all')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCat === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <i className="fas fa-shopping-cart mr-1 text-indigo-600"></i>
              <span className="font-semibold">{cartCount}</span> items
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleBuy}
              disabled={cartCount === 0 || buying}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buying ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-shopping-bag mr-2"></i>}
              Comprar
            </button>
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-3xl text-indigo-600 mb-3"></i>
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <i className="fas fa-microchip text-indigo-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900">{product.nombre}</h3>
                <p className="text-xs text-indigo-500 font-medium mb-1">{getCategoryName(product.categoria)}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.descripcion || ''}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-indigo-600">$ {parseFloat(product.precio_unitario).toFixed(2)}</span>
                  <span className={`text-xs font-medium ${product.stock_disponible > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock_disponible > 0 ? `${product.stock_disponible} disponibles` : 'Agotado'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock_disponible <= 0}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-cart-plus mr-1"></i> Agregar
                  </button>
                  {cart[product.id] > 0 && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-6 text-center font-bold text-gray-900">{cart[product.id]}</span>
                      <button onClick={() => addToCart(product.id)} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}