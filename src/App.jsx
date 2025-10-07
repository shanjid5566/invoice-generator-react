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



    </div>
  );
}

export default App;
