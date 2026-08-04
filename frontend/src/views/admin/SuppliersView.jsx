import React from 'react';

const suppliers = [
  { id: 1, name: 'Carlos Rivas', company: 'TechPro S.A.', phone: '+56 9 1234 5678', email: 'ventas@techpro.cl' },
  { id: 2, name: 'María Pérez', company: 'PC Link', phone: '+56 2 3344 5566', email: 'contacto@pclink.cl' },
];

export default function SuppliersView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Proveedores</p>
            <h1 className="text-2xl font-semibold">Gestión de proveedores</h1>
          </div>
          <button className="rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold">+ Nuevo proveedor</button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Correo</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t border-slate-800 bg-slate-950/70">
                  <td className="px-4 py-3">{supplier.name}</td>
                  <td className="px-4 py-3">{supplier.company}</td>
                  <td className="px-4 py-3">{supplier.phone}</td>
                  <td className="px-4 py-3">{supplier.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
