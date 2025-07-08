import { Toaster } from "react-hot-toast";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useInvoiceStore } from "./store/useInvoiceStore";

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const { addInvoices, updateInvoice } = useInvoiceStore();

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('invoices');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated]);

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
    } else {
      addInvoices(invoiceData);
    }
    setEditingInvoice(null);
    setCurrentView('invoices');
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('form');
  };

  const handleCreateNew = () => {
    setEditingInvoice(null);
    setCurrentView('form');
  };

  const handleCancelForm = () => {
    setEditingInvoice(null);
    setCurrentView('invoices');
  };

  if (!isAuthenticated) {
    if (currentView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />;
    }
    return <LoginForm onSwitchToRegister={() => setCurrentView('register')} />;
  }

  if (currentView === 'form') {
    return (
      <InvoiceForm
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <InvoiceList
      onCreateNew={handleCreateNew}
      onEdit={handleEditInvoice}
    />
  );
};

export default function InvoicingSystem() {
  return (
    <div>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}