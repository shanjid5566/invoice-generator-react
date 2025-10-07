import React, { useState, useEffect } from "react";
import { Plus, Trash2, Printer, DollarSign } from "lucide-react";

const initialInvoiceData = {
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
    currency: "USD",
  },
  items: [
    {
      id: crypto.randomUUID(),
      description: "Phase 1: Project Scoping & Planning",
      quantity: 1,
      unitPrice: 1200.0,
    },
    {
      id: crypto.randomUUID(),
      description: "Phase 2: UI/UX Design & Prototyping",
      quantity: 20,
      unitPrice: 75.0,
    },
  ],
  taxRate: 8.25,
  subtotal: 0,
  taxAmount: 0,
  total: 0,
};
function App() {
  const [invoice, setInvoice] = useState(initialInvoiceData);
  //  Action Handlers (Add/Delete)
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
      ],
    }));
  };

  // Print full document

  const handlePrint = () => window.print();

  // Invoice number handeler
  const handleDetailChange = (section, field, value) => {
    if (section === "taxRate") {
      setInvoice((prev) => ({
        ...prev,
        taxRate: parseFloat(value) || 0,
      }));
      return;
    }

    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Component for editing address blocks
  const AddressBlock = ({ title, data, section }) => (
    <div className="flex flex-col space-y-1 p-4 bg-white rounded-xl shadow-lg h-full">
      <h3 className="font-extrabold text-lg text-indigo-700 border-b-2 border-indigo-100 pb-1 mb-2">
        {title}
      </h3>
      <input
        type="text"
        className="input-field font-semibold text-gray-800 text-xl"
        placeholder={`${title} Name`}
        value={data.name}
        onChange={(e) => handleDetailChange(section, "name", e.target.value)}
      />
      <input
        type="text"
        className="input-field text-gray-600"
        placeholder="Address"
        value={data.address}
        onChange={(e) => handleDetailChange(section, "address", e.target.value)}
      />
      <input
        type="text"
        className="input-field text-gray-600"
        placeholder="City, ST Zip"
        value={data.city}
        onChange={(e) => handleDetailChange(section, "city", e.target.value)}
      />
      <input
        type="email"
        className="input-field text-indigo-500"
        placeholder="Email"
        value={data.email}
        onChange={(e) => handleDetailChange(section, "email", e.target.value)}
      />
      <input
        type="tel"
        className="input-field text-gray-500"
        placeholder="Phone"
        value={data.phone}
        onChange={(e) => handleDetailChange(section, "phone", e.target.value)}
      />
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      {/* Control Panel (Hidden when printing) */}
      <div className="print:hidden flex justify-center sticky top-0 z-50 mb-8">
        <div className="bg-indigo-600 p-3 rounded-xl shadow-2xl flex space-x-4">
          <button
            onClick={addItem}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition shadow-md"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-md"
          >
            <Printer size={18} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice container */}
      <div
        id="invoice-document"
        className="max-w-7xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-100"
      >
        {/* Invoice header */}
        <header className="flex flex-col sm:flex-row justify-between items-start mb-10 border-b pb-6">
          {/* left side */}
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl font-black text-indigo-700 tracking-tighter">
              INVOICE
            </h1>
            <div className="mt-2 flex items-center space-x-2">
              <DollarSign size={20} className="text-indigo-500" />
              <input
                type="text"
                className="input-field font-mono text-gray-600"
                placeholder="Invoice Number"
                value={invoice.invoiceDetails.number}
                onChange={(e) =>
                  handleDetailChange("invoiceDetails", "number", e.target.value)
                }
              />
            </div>
          </div>

          {/* Right side */}

          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-end items-center">
              <span className="w-24 text-gray-500 font-medium">
                Invoice Date:
              </span>
              <input
                type="date"
                className="input-field w-32"
                value={invoice.invoiceDetails.date}
                onChange={(e) =>
                  handleDetailChange("invoiceDetails", "date", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end items-center">
              <span className="w-24 text-gray-500 font-medium">Due Date:</span>
              <input
                type="date"
                className="input-field w-32 font-bold text-red-500"
                value={invoice.invoiceDetails.dueDate}
                onChange={(e) =>
                  handleDetailChange(
                    "invoiceDetails",
                    "dueDate",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="flex justify-end items-center">
              <span className="w-24 text-gray-500 font-medium">Currency:</span>
              <select
                className="input-field w-32"
                value={invoice.invoiceDetails.currency}
                onChange={(e) =>
                  handleDetailChange(
                    "invoiceDetails",
                    "currency",
                    e.target.value
                  )
                }
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </header>

        {/* Company & Client Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <AddressBlock
            title="Billed By"
            data={invoice.sender}
            section="sender"
          />
          <AddressBlock
            title="Billed To"
            data={invoice.recipient}
            section="recipient"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
