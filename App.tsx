import React, { useState } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceData } from './types';
import { Printer, Eye, PenTool, LayoutTemplate, Download } from 'lucide-react';

declare const html2pdf: any;

const initialData: InvoiceData = {
  invoiceNumber: '1403-1001',
  date: new Date().toLocaleDateString('fa-IR'),
  dueDate: '',
  sellerName: '',
  sellerTitle: '',
  sellerContact: '',
  customerName: '',
  customerCompany: '',
  customerContact: '',
  items: [
    {
      id: '1',
      title: 'طراحی رابط کاربری (UI)',
      description: 'طراحی صفحات اصلی، درباره ما، تماس با ما و پنل کاربری با رعایت اصول UX',
      quantity: 1,
      unitPrice: 5000000
    }
  ],
  taxRate: 0,
  note: 'لطفاً مبلغ فاکتور را به شماره کارت ۱۲۳۴-۵۶۷۸-۱۲۳۴-۵۶۷۸ به نام ... واریز نمایید.',
  theme: {
    color: 'indigo',
    iconStyle: 'modern'
  }
};

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;
    
    setIsDownloading(true);
    const opt = {
      margin: 0,
      filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
    });
  };

  return (
    <div className="flex h-full flex-col md:flex-row bg-slate-100 text-slate-800">
      
      {/* Sidebar / Editor */}
      <div className={`
        no-print 
        ${viewMode === 'edit' ? 'flex' : 'hidden'} 
        md:flex flex-col
        w-full md:w-[450px] lg:w-[500px] flex-shrink-0
        bg-white border-l border-slate-200 shadow-xl z-20
        h-full
      `}>
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-slate-100 rounded-lg">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-slate-900">فاکتورساز وب</h1>
              <p className="text-xs text-slate-500 font-medium">ویرایشگر حرفه‌ای</p>
            </div>
          </div>
          <button 
            onClick={() => setViewMode('preview')}
            className="md:hidden text-slate-500 p-2 hover:bg-slate-50 rounded-lg transition"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
          <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
        </div>
      </div>

      {/* Main Preview Area */}
      <div className={`
        flex-1 relative h-full flex flex-col overflow-hidden bg-slate-100/50
        ${viewMode === 'preview' ? 'flex' : 'hidden'} md:flex
      `}>
         
         {/* Mobile Header (Preview Mode) */}
         <div className="md:hidden no-print flex-shrink-0 bg-white p-4 shadow-sm z-20 flex justify-between items-center border-b border-slate-200">
            <button 
                onClick={() => setViewMode('edit')}
                className="text-slate-600 font-bold text-sm flex items-center gap-2"
            >
                <PenTool className="w-4 h-4" />
                ویرایش
            </button>
            <div className="flex gap-2">
                <button
                onClick={handlePrint}
                className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg"
                >
                <Printer className="w-4 h-4" />
                </button>
                <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium disabled:opacity-50"
                >
                <Download className="w-4 h-4" />
                {isDownloading ? '...' : 'PDF'}
                </button>
            </div>
         </div>

        {/* Desktop Toolbar */}
        <div className="no-print hidden md:flex absolute top-6 left-6 z-30 gap-3">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2 transition-all font-medium text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 font-medium text-sm disabled:opacity-70 disabled:scale-100 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'در حال ساخت PDF...' : 'دانلود PDF'}</span>
            </button>
        </div>

        {/* Scrollable Preview Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 flex justify-center items-start">
          <div className="w-full flex justify-center pb-20 md:pt-10">
             <InvoicePreview data={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;