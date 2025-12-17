import React, { useState } from 'react';
import { InvoiceData, LineItem, ColorTheme, IconStyle } from '../types';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, User, FileText, ShoppingCart, Info, Palette, Check } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

// Helper Components
const SectionHeader = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void 
}) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-white text-blue-600 border-b border-slate-100' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
      <span className="font-bold text-sm">{title}</span>
    </div>
    {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
  </button>
);

const InputGroup = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-500">{label}</label>
    {children}
  </div>
);

const colors: { id: ColorTheme; bg: string }[] = [
  { id: 'indigo', bg: 'bg-indigo-600' },
  { id: 'blue', bg: 'bg-blue-600' },
  { id: 'violet', bg: 'bg-violet-600' },
  { id: 'emerald', bg: 'bg-emerald-600' },
  { id: 'rose', bg: 'bg-rose-600' },
  { id: 'amber', bg: 'bg-amber-600' },
  { id: 'cyan', bg: 'bg-cyan-600' },
  { id: 'slate', bg: 'bg-slate-800' },
];

const iconStyles: { id: IconStyle; label: string }[] = [
  { id: 'modern', label: 'مدرن (Modern)' },
  { id: 'minimal', label: 'مینیمال (Minimal)' },
  { id: 'solid', label: 'توپر (Solid)' },
];

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const [showAI, setShowAI] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });
  
  // Section visibility state
  const [sections, setSections] = useState({
    theme: true,
    general: true,
    seller: false,
    buyer: false,
    items: false,
    notes: false
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };
  
  const handleThemeChange = (field: keyof InvoiceData['theme'], value: any) => {
      onChange({ 
          ...data, 
          theme: { ...data.theme, [field]: value } 
      });
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    handleChange('items', [...data.items, newItem]);
    if (!sections.items) toggleSection('items');
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    handleChange('items', newItems);
  };

  const handleAISuccess = (title: string, description: string) => {
    if (showAI.index !== null) {
      handleItemChange(showAI.index, 'title', title);
      handleItemChange(showAI.index, 'description', description);
    }
  };

  const inputClass = "w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300";

  return (
    <div className="p-4 space-y-4 pb-20">

      {/* 0. Theme Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader 
            title="تنظیمات قالب" 
            icon={Palette} 
            isOpen={sections.theme} 
            onToggle={() => toggleSection('theme')} 
        />
        {sections.theme && (
            <div className="p-5 space-y-6 bg-slate-50/50">
                <InputGroup label="رنگ اصلی قالب">
                    <div className="flex flex-wrap gap-3">
                        {colors.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => handleThemeChange('color', c.id)}
                                className={`
                                    w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-110
                                    ${c.bg}
                                    ${data.theme.color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}
                                `}
                            >
                                {data.theme.color === c.id && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </InputGroup>

                <InputGroup label="سبک آیکون‌ها">
                    <div className="grid grid-cols-3 gap-2">
                        {iconStyles.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => handleThemeChange('iconStyle', style.id)}
                                className={`
                                    px-3 py-2 rounded-lg text-xs font-medium border transition-all
                                    ${data.theme.iconStyle === style.id 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                `}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </InputGroup>
            </div>
        )}
      </div>
      
      {/* 1. General Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader 
          title="اطلاعات فاکتور" 
          icon={FileText} 
          isOpen={sections.general} 
          onToggle={() => toggleSection('general')} 
        />
        {sections.general && (
          <div className="p-5 grid grid-cols-2 gap-4 bg-slate-50/50">
            <InputGroup label="شماره فاکتور">
              <input
                type="text"
                value={data.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                className={`${inputClass} font-mono dir-ltr text-left`}
              />
            </InputGroup>
            <InputGroup label="تاریخ صدور">
              <input
                type="text"
                value={data.date}
                placeholder="1403/01/01"
                onChange={(e) => handleChange('date', e.target.value)}
                className={inputClass}
              />
            </InputGroup>
          </div>
        )}
      </div>

      {/* 2. Seller */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader 
          title="مشخصات فروشنده (شما)" 
          icon={User} 
          isOpen={sections.seller} 
          onToggle={() => toggleSection('seller')} 
        />
        {sections.seller && (
          <div className="p-5 space-y-4 bg-slate-50/50">
            <InputGroup label="نام / نام تجاری">
              <input
                type="text"
                value={data.sellerName}
                onChange={(e) => handleChange('sellerName', e.target.value)}
                className={inputClass}
                placeholder="مثال: رضا علوی"
              />
            </InputGroup>
            <InputGroup label="عنوان شغلی / زیرنویس">
              <input
                type="text"
                value={data.sellerTitle}
                onChange={(e) => handleChange('sellerTitle', e.target.value)}
                className={inputClass}
                placeholder="مثال: توسعه‌دهنده Full-Stack"
              />
            </InputGroup>
            <InputGroup label="اطلاعات تماس و آدرس">
              <textarea
                value={data.sellerContact}
                onChange={(e) => handleChange('sellerContact', e.target.value)}
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="شماره تماس، ایمیل، آدرس وب‌سایت..."
              />
            </InputGroup>
          </div>
        )}
      </div>

      {/* 3. Buyer */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader 
          title="مشخصات خریدار (مشتری)" 
          icon={User} 
          isOpen={sections.buyer} 
          onToggle={() => toggleSection('buyer')} 
        />
        {sections.buyer && (
          <div className="p-5 space-y-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="نام شخص">
                <input
                  type="text"
                  value={data.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className={inputClass}
                />
              </InputGroup>
              <InputGroup label="نام شرکت/مجموعه">
                <input
                  type="text"
                  value={data.customerCompany}
                  onChange={(e) => handleChange('customerCompany', e.target.value)}
                  className={inputClass}
                />
              </InputGroup>
            </div>
            <InputGroup label="اطلاعات تماس مشتری">
              <textarea
                value={data.customerContact}
                onChange={(e) => handleChange('customerContact', e.target.value)}
                className={`${inputClass} min-h-[80px] resize-y`}
              />
            </InputGroup>
          </div>
        )}
      </div>

      {/* 4. Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between pr-0 pl-2">
            <SectionHeader 
            title="آیتم‌های فاکتور" 
            icon={ShoppingCart} 
            isOpen={sections.items} 
            onToggle={() => toggleSection('items')} 
            />
             {sections.items && (
                <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm ml-4 mb-1"
              >
                <Plus className="w-3.5 h-3.5" /> افزودن
              </button>
             )}
        </div>
        
        {sections.items && (
          <div className="p-4 space-y-4 bg-slate-50/50">
            {data.items.length === 0 ? (
                <div onClick={addItem} className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">افزودن اولین آیتم</span>
                </div>
            ) : (
                data.items.map((item, index) => (
                <div key={item.id} className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:shadow-md group">
                    <div className="flex justify-between items-start mb-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">{index + 1}</span>
                        <div className="flex gap-1">
                            <button
                            onClick={() => setShowAI({ isOpen: true, index })}
                            className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                            title="تولید متن با هوش مصنوعی"
                            >
                            <Sparkles className="w-4 h-4" />
                            </button>
                            <button
                            onClick={() => removeItem(index)}
                            className="p-1.5 text-red-500 bg-red-50 rounded-md hover:bg-red-100 transition"
                            title="حذف آیتم"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                    <InputGroup label="عنوان خدمات">
                        <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        className={`${inputClass} font-bold text-slate-900`}
                        placeholder="مثلا: طراحی سایت"
                        />
                    </InputGroup>
                    
                    <InputGroup label="توضیحات">
                        <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className={`${inputClass} min-h-[80px] bg-slate-50`}
                        placeholder="توضیحات فنی..."
                        />
                    </InputGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="قیمت واحد (تومان)">
                            <input
                            type="number"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className={inputClass}
                            />
                        </InputGroup>
                        <InputGroup label="تعداد">
                            <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className={`${inputClass} text-center`}
                            />
                        </InputGroup>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* 5. Notes & Tax */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader 
          title="توضیحات و مالیات" 
          icon={Info} 
          isOpen={sections.notes} 
          onToggle={() => toggleSection('notes')} 
        />
        {sections.notes && (
          <div className="p-5 space-y-4 bg-slate-50/50">
             <InputGroup label="درصد مالیات">
              <div className="relative">
                <input
                    type="number"
                    value={data.taxRate}
                    onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                    className={`${inputClass} pl-10`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </InputGroup>
            <InputGroup label="توضیحات پایانی و شرایط">
              <textarea
                value={data.note}
                onChange={(e) => handleChange('note', e.target.value)}
                className={`${inputClass} min-h-[100px]`}
              />
            </InputGroup>
          </div>
        )}
      </div>

      {showAI.isOpen && (
        <AIAssistant
          onClose={() => setShowAI({ ...showAI, isOpen: false })}
          onSuccess={handleAISuccess}
        />
      )}
    </div>
  );
};