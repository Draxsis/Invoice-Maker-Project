import React from 'react';
import { InvoiceData } from '../types';
import { User, Building2, Calendar, Hash, FileText, Briefcase, MapPin, Percent } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;

  const color = data.theme?.color || 'indigo';
  const style = data.theme?.iconStyle || 'modern';

  // Helper for dynamic classes
  const getThemeClasses = () => {
     return {
         text: `text-${color}-600`,
         textDark: `text-${color}-900`,
         bg: `bg-${color}-600`,
         bgLight: `bg-${color}-50`,
         bgLightHover: `hover:bg-${color}-50`,
         border: `border-${color}-200`,
         borderDark: `border-${color}-600`,
     }
  };
  
  const t = getThemeClasses();

  // Helper for icon rendering based on style
  const IconContainer = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
      if (style === 'minimal') {
          return <div className={`text-${color}-600 ${className}`}>{children}</div>;
      }
      if (style === 'solid') {
          return (
            <div className={`bg-${color}-600 text-white p-2.5 rounded-full shadow-sm ${className}`}>
                {children}
            </div>
          );
      }
      // Modern (Default)
      return (
        <div className={`bg-${color}-600 text-white p-2.5 rounded-xl shadow-lg shadow-${color}-200 print:shadow-none ${className}`}>
            {children}
        </div>
      );
  };

  const SmallIconContainer = ({ children }: { children: React.ReactNode }) => {
      if (style === 'minimal') {
          return <div className={`text-${color}-500`}>{children}</div>
      }
      // Solid & Modern use colored text for small icons usually, or small circles? 
      // Let's keep small metadata icons consistent as colored text for readability
      return <div className={`text-${color}-500`}>{children}</div>;
  };

  return (
    <div 
        id="invoice-preview" 
        className="
            bg-white text-slate-800 leading-relaxed relative shadow-2xl
            w-full max-w-[210mm] min-h-[297mm] mx-auto overflow-hidden
            print:shadow-none print:w-full print:max-w-none print:m-0
            flex flex-col font-sans
        "
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* Decorative colored top bar */}
      <div className={`h-3 w-full bg-gradient-to-r from-${color}-500 via-${color}-600 to-${color}-800 print:print-color-adjust-exact`}></div>

      {/* Header Section */}
      <div className="bg-slate-50 px-12 py-10 border-b border-slate-100 flex justify-between items-start print:print-color-adjust-exact">
        <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
                <IconContainer>
                    <FileText className="w-6 h-6" />
                </IconContainer>
                <h1 className={`text-4xl font-black text-${color}-950 tracking-tight`}>فاکتور فروش</h1>
            </div>
            <p className="text-slate-500 font-medium mr-14">Invoice & Services</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 min-w-[220px]">
             <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
                    <SmallIconContainer><Hash className="w-3.5 h-3.5" /></SmallIconContainer> شماره:
                </span>
                <span className="font-bold text-slate-900 font-mono text-lg">{data.invoiceNumber}</span>
             </div>
             <div className="h-px bg-slate-100"></div>
             <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
                    <SmallIconContainer><Calendar className="w-3.5 h-3.5" /></SmallIconContainer> تاریخ:
                </span>
                <span className="font-bold text-slate-900">{data.date}</span>
             </div>
        </div>
      </div>

      <div className="p-12 flex-grow">
        {/* Parties Section */}
        <div className="grid grid-cols-2 gap-12 mb-12">
            {/* Seller */}
            <div className={`bg-${color}-50/50 rounded-2xl p-6 border border-${color}-100/50 relative overflow-hidden print:print-color-adjust-exact`}>
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}-100 rounded-bl-[40px] -mr-8 -mt-8 z-0 opacity-50`}></div>
                <div className="relative z-10">
                    <div className={`flex items-center gap-2 mb-4 text-${color}-700 border-b border-${color}-100 pb-3`}>
                        <User className="w-4 h-4" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">فروشنده (مجری)</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="font-black text-xl text-slate-900">{data.sellerName || '---'}</p>
                        <p className={`text-${color}-600 font-medium text-sm`}>{data.sellerTitle}</p>
                        
                        {(data.sellerContact) && (
                            <div className="pt-3 flex items-start gap-2 text-slate-500 text-sm">
                                <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 text-${color}-300`} />
                                <p className="whitespace-pre-line leading-relaxed">{data.sellerContact}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buyer */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden print:print-color-adjust-exact">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200/50 rounded-bl-[40px] -mr-8 -mt-8 z-0"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-slate-600 border-b border-slate-200 pb-3">
                        <Building2 className="w-4 h-4" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">خریدار (کارفرما)</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="font-black text-xl text-slate-900">{data.customerName || '---'}</p>
                        <p className="text-slate-700 font-medium text-sm">{data.customerCompany}</p>
                        
                        {(data.customerContact) && (
                            <div className="pt-3 flex items-start gap-2 text-slate-500 text-sm">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-slate-300" />
                                <p className="whitespace-pre-line leading-relaxed">{data.customerContact}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full">
                <thead className="bg-slate-900 text-white print:print-color-adjust-exact">
                    <tr>
                        <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-wider w-16">#</th>
                        <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-wider">شرح خدمات / کالا</th>
                        <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider w-24">تعداد</th>
                        <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-32">فی (تومان)</th>
                        <th className={`py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-40 bg-${color}-900`}>مبلغ کل</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {data.items.map((item, index) => (
                        <tr key={item.id} className={`hover:bg-${color}-50/30 transition-colors`}>
                            <td className="py-4 px-6 text-right text-slate-400 font-mono text-sm">{index + 1}</td>
                            <td className="py-4 px-6">
                                <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                                <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
                            </td>
                            <td className="py-4 px-6 text-center font-mono text-slate-600 text-sm bg-slate-50/50">{item.quantity}</td>
                            <td className="py-4 px-6 text-left font-mono text-slate-600 text-sm">
                                {item.unitPrice.toLocaleString()}
                            </td>
                            <td className={`py-4 px-6 text-left font-bold font-mono text-${color}-700 bg-${color}-50/30`}>
                                {(item.unitPrice * item.quantity).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                     {data.items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-300 italic">آیتمی درج نشده است</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Footer Layout */}
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7 space-y-6">
                 {data.note && (
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 print:print-color-adjust-exact">
                        <h4 className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-3">
                            <Briefcase className="w-4 h-4" />
                            توضیحات و شرایط
                        </h4>
                        <p className="text-amber-900/80 text-sm leading-relaxed text-justify whitespace-pre-wrap">
                            {data.note}
                        </p>
                    </div>
                )}
            </div>

            <div className="col-span-5">
                <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden print:print-color-adjust-exact">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center text-slate-400 text-sm">
                            <span>جمع کل اقلام</span>
                            <span className="font-mono text-white">{subtotal.toLocaleString()}</span>
                        </div>
                        
                        {data.taxRate > 0 && (
                            <div className={`flex justify-between items-center text-${color}-300 text-sm`}>
                                <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> مالیات ({data.taxRate}٪)</span>
                                <span className="font-mono">+{taxAmount.toLocaleString()}</span>
                            </div>
                        )}
                        
                        <div className="h-px bg-slate-700 my-4"></div>
                        
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-300 mb-1">مبلغ قابل پرداخت</span>
                            <div className="text-right">
                                <span className="block text-3xl font-black tracking-tight text-white">{total.toLocaleString()}</span>
                                <span className="text-xs text-slate-400 font-medium">تومان</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Signature Area */}
      <div className="bg-slate-50 px-12 py-8 mt-auto border-t border-slate-200 print:print-color-adjust-exact">
         <div className="grid grid-cols-2 gap-24">
            <div className="flex flex-col items-center justify-center gap-4">
                 <div className={`h-20 w-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-300 text-xs hover:border-${color}-300 transition-colors`}>
                    محل مهر و امضای فروشنده
                 </div>
                 <p className="font-bold text-slate-700 text-sm">امضای فروشنده</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                 <div className={`h-20 w-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-300 text-xs hover:border-${color}-300 transition-colors`}>
                    محل مهر و امضای خریدار
                 </div>
                 <p className="font-bold text-slate-700 text-sm">امضای خریدار</p>
            </div>
         </div>
      </div>
      
      {/* Footer Branding Strip */}
      <div className={`bg-${color}-900 text-${color}-200 py-3 text-center text-[10px] uppercase tracking-[0.2em] font-medium print:print-color-adjust-exact`}>
         Thank you for your business
      </div>

    </div>
  );
};