import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useInvoiceStore = create(
  persist(
    (set, get) => ({
      invoices: [],
      nextInvoiceNumber: 1,

      addInvoices: (invoice) => {
        const { invoices, nextInvoiceNumber } = get();
        const newInvoice = {
          id: Date.now().toString(),
          invoiceNumber: `INVOICE-${String(nextInvoiceNumber).padStart(4, 0)}`,
          ...invoice,
          createAt: new Date().toISOString(),
        };

        set({
          invoices: [...invoices, newInvoice],
          nextInvoiceNumber: nextInvoiceNumber + 1,
        });

        toast.success("Invoice created successfully");
      },

      updateInvoice: (id, updatedInvoice) => {
        const { invoices } = get();
        const updated = invoices.map((inv) =>
          inv.id === id ? { ...inv, ...updatedInvoice } : inv
        );

        set({ invoices: updated });
        toast.success("Invoice updated successfully!");
      },

      deleteInvoice: (id) => {
        const { invoices } = get();
        const filtered = invoices.filter((inv) => inv.id !== id);
        set({ invoices: filtered });
        toast.success("Invoice deleted successfully!");
      },

      getInvoiceById: (id) => {
        const { invoices } = get();
        return invoices.find((inv) => inv.id === id);
      },
    }),
    {
      name: "invoice-storage",
    }
  )
);
