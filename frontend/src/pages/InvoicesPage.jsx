import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { distributors } from '../data/organizations.js';
import { analyzeInvoice } from '../utils/invoiceAnalyzer.js';
import Notice from '../components/common/Notice.jsx';

export default function InvoicesPage() {
  const { currentUser } = useAuth(); const { products, stores, invoices, addInvoice, invoiceNotice } = useData();
  const [file, setFile] = useState(null); const [analysis, setAnalysis] = useState(null);
  function submit(event) { event.preventDefault(); if (!file) return; const result = analyzeInvoice(file, stores, distributors, products);
    const record = { ...result, id: `inv${String(invoices.length + 1).padStart(3, '0')}` }; setAnalysis(record); addInvoice(record); }
  return <div className="container shopping-page"><p className="eyebrow">Análisis demo</p><h1>Facturas</h1><p>La carga y lectura son simuladas; no se ejecuta OCR real.</p><Notice notice={invoiceNotice} />
    <form className="shopping-panel invoice-form" onSubmit={submit}><label htmlFor="invoice-file">Factura PDF de demostración</label><input id="invoice-file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} /><button type="submit">Analizar factura</button></form>
    {analysis && <section className="shopping-panel"><h2>{analysis.fileName}</h2><p>Proveedor: {analysis.supplier?.name} · costo: {analysis.totalCost}</p><ul>{analysis.items.map(({ product, quantity, unitCost }) => <li key={product.id}>{product.name}: {quantity} a {unitCost} COP</li>)}</ul></section>}
    <section className="shopping-panel"><h2>Historial</h2><ul>{invoices.filter(({ storeId }) => storeId === currentUser.storeId).map((invoice) => <li key={invoice.id}>{invoice.fileName} · {invoice.date}</li>)}</ul></section></div>;
}
