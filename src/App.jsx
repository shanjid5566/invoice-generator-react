import React, { useState, useEffect } from "react";
import { Plus, Trash2, Printer, DollarSign } from "lucide-react";
import axios from "axios";

const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

function App() {
  const [invoice, setInvoice] = useState({
    sender: {
      name: "Your Company Name",
      address: "123 Business Road",
      city: "Anytown, TX 77001",
      email: "billing@yourcompany.com",
      phone: "(555) 123-4567",
    },
    recipient: {
      name: "Client Name Inc.",
      address: "456 Client Street",
      city: "Client City, CA 90210",
      email: "accounts@clientname.com",
      phone: "(555) 987-6543",
    },
    invoiceDetails: {
      number: "INV-2025-0001",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "BDT",
    },
    items: [],
    taxRate: "8.25",
    notes:
      "Payment is due within 7 days. A late fee of 1.5% per month will apply to overdue balances. Thank you for your business!",
  });
  console.log(invoice)
  console.log(invoice.items)

  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });

  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);

    const taxRate = parseFloat(invoice.taxRate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    setTotals({ subtotal, taxAmount, total });
  }, [invoice.items, invoice.taxRate]);

  const addItem = () => {
    const newId = Date.now().toString();
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: "",
          quantity: "1",
          unitPrice: "0",
        },
      ],
    }));
  };

  const deleteItem = (id) => {
    if (invoice.items.length === 1) return;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateDetail = (section, field, value) => {
    if (section === "taxRate" || section === "notes") {
      setInvoice((prev) => ({ ...prev, [section]: value }));
    } else {
      setInvoice((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handlePrint = () => {

    axios.post('http://localhost:5000/api/invoices',invoice)
    window.print()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 font-sans p-4 sm:p-8">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
        .input-field {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
          background: white;
        }
        .input-field:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
      `}</style>

      {/* Control Panel */}
      <div className="print:hidden flex justify-center sticky top-0 z-50 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-2xl flex space-x-4">
          <button
            onClick={addItem}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
          >
            <Printer size={18} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-7xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-10 border-b-2 border-indigo-100 pb-6">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              INVOICE
            </h1>
            <div className="mt-3 flex items-center space-x-2">
              <DollarSign size={20} className="text-indigo-500" />
              <input
                type="text"
                className="input-field font-mono text-gray-700 font-semibold"
                value={invoice.invoiceDetails.number}
                onChange={(e) =>
                  updateDetail("invoiceDetails", "number", e.target.value)
                }
              />
            </div>
          </div>

          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-end items-center space-x-2">
              <span className="w-28 text-gray-600 font-semibold">
                Invoice Date:
              </span>
              <input
                type="date"
                className="input-field w-36"
                value={invoice.invoiceDetails.date}
                onChange={(e) =>
                  updateDetail("invoiceDetails", "date", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end items-center space-x-2">
              <span className="w-28 text-gray-600 font-semibold">
                Due Date:
              </span>
              <input
                type="date"
                className="input-field w-36 font-bold text-red-600"
                value={invoice.invoiceDetails.dueDate}
                onChange={(e) =>
                  updateDetail("invoiceDetails", "dueDate", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end items-center space-x-2">
              <span className="w-28 text-gray-600 font-semibold">
                Currency:
              </span>
              <select
                className="input-field w-36 font-semibold"
                value={invoice.invoiceDetails.currency}
                onChange={(e) =>
                  updateDetail("invoiceDetails", "currency", e.target.value)
                }
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Blocks */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Billed By */}
          <div className="flex flex-col space-y-1 p-4 bg-white rounded-xl shadow-lg">
            <h3 className="font-extrabold text-lg text-indigo-700 border-b-2 border-indigo-100 pb-1 mb-2">
              Billed By
            </h3>
            <input
              type="text"
              className="input-field font-semibold text-gray-800 text-xl"
              value={invoice.sender.name}
              onChange={(e) => updateDetail("sender", "name", e.target.value)}
            />
            <input
              type="text"
              className="input-field text-gray-600"
              value={invoice.sender.address}
              onChange={(e) =>
                updateDetail("sender", "address", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field text-gray-600"
              value={invoice.sender.city}
              onChange={(e) => updateDetail("sender", "city", e.target.value)}
            />
            <input
              type="email"
              className="input-field text-indigo-500"
              value={invoice.sender.email}
              onChange={(e) => updateDetail("sender", "email", e.target.value)}
            />
            <input
              type="tel"
              className="input-field text-gray-500"
              value={invoice.sender.phone}
              onChange={(e) => updateDetail("sender", "phone", e.target.value)}
            />
          </div>

          {/* Billed To */}
          <div className="flex flex-col space-y-1 p-4 bg-white rounded-xl shadow-lg">
            <h3 className="font-extrabold text-lg text-indigo-700 border-b-2 border-indigo-100 pb-1 mb-2">
              Billed To
            </h3>
            <input
              type="text"
              className="input-field font-semibold text-gray-800 text-xl"
              value={invoice.recipient.name}
              onChange={(e) =>
                updateDetail("recipient", "name", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field text-gray-600"
              value={invoice.recipient.address}
              onChange={(e) =>
                updateDetail("recipient", "address", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field text-gray-600"
              value={invoice.recipient.city}
              onChange={(e) =>
                updateDetail("recipient", "city", e.target.value)
              }
            />
            <input
              type="email"
              className="input-field text-indigo-500"
              value={invoice.recipient.email}
              onChange={(e) =>
                updateDetail("recipient", "email", e.target.value)
              }
            />
            <input
              type="tel"
              className="input-field text-gray-500"
              value={invoice.recipient.phone}
              onChange={(e) =>
                updateDetail("recipient", "phone", e.target.value)
              }
            />
          </div>
        </div>

        {/* Items Table */}
        <section className="mb-8 overflow-x-auto">
          <table className="min-w-full bg-white border-collapse rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="text-left px-4 py-4 font-bold">Description</th>
                <th className="text-center px-4 py-4 font-bold w-24">Qty</th>
                <th className="text-right px-4 py-4 font-bold w-32">
                  Unit Price
                </th>
                <th className="text-right px-4 py-4 font-bold w-32">Amount</th>
                <th className="px-4 py-4 w-16 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.unitPrice) || 0;
                const amount = qty * price;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-indigo-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="input-field font-medium w-full"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="input-field w-full text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="input-field w-full text-right"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, "unitPrice", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-right text-gray-800">
                      {formatCurrency(amount, invoice.invoiceDetails.currency)}
                    </td>
                    <td className="px-4 py-3 text-center print:hidden">
                      <button
                        onClick={() => deleteItem(item.id)}
                        disabled={invoice.items.length === 1}
                        className={`text-red-500 hover:text-red-700 p-2 rounded transition ${
                          invoice.items.length === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="grid md:grid-cols-3 gap-8 pt-6 border-t-2 border-gray-100">
          <div className="md:col-span-2">
            <h4 className="font-bold text-gray-800 mb-3 text-lg">
              Payment Terms & Notes
            </h4>
            <textarea
              className="input-field w-full h-32 text-sm resize-none"
              value={invoice.notes}
              onChange={(e) => updateDetail("notes", null, e.target.value)}
            />
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(
                    totals.subtotal,
                    invoice.invoiceDetails.currency
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-700">
                <label className="font-semibold">Tax Rate</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="input-field w-20 text-right font-semibold mr-1"
                    value={invoice.taxRate}
                    onChange={(e) =>
                      updateDetail("taxRate", null, e.target.value)
                    }
                  />
                  <span className="font-semibold">%</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-gray-700 border-b-2 pb-3 border-indigo-200">
                <span className="font-semibold">Tax Amount</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(
                    totals.taxAmount,
                    invoice.invoiceDetails.currency
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pt-3">
                <span>TOTAL DUE</span>
                <span>
                  {formatCurrency(
                    totals.total,
                    invoice.invoiceDetails.currency
                  )}
                </span>
              </div>
            </div>
          </div>
        </footer>

        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
