import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ExpenseCategory, PaymentMethod } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setQuickAddOpen,
    quickAddType,
    setQuickAddType,
    categories,
    brands,
    addProduct,
    addExpense,
    addEmployee,
    vehicles,
    addFuelEntry,
    setActivePage,
  } = useApp();
  const toast = useToast();

  // Product Form State
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [productType, setProductType] = useState('PPC');
  const [unit, setUnit] = useState('Bag');
  const [weight, setWeight] = useState('50 KG');
  const [purchasePrice, setPurchasePrice] = useState('340');
  const [sellingPrice, setSellingPrice] = useState('390');
  const [currentStock, setCurrentStock] = useState('100');
  const [minimumStock, setMinimumStock] = useState('30');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80');
  const [visibility, setVisibility] = useState<'Visible' | 'Hidden'>('Visible');
  const [isFeatured, setIsFeatured] = useState(false);

  // Expense Form State
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Diesel');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<PaymentMethod>('UPI');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Employee Form State
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Delivery Driver');
  const [empDept, setEmpDept] = useState<'Logistics' | 'Sales' | 'Operations' | 'Finance' | 'Warehouse'>('Logistics');
  const [empPhone, setEmpPhone] = useState('');
  const [empSalary, setEmpSalary] = useState('20000');

  // Fuel Form State
  const [fuelVehicleId, setFuelVehicleId] = useState(vehicles[0]?.id || '');
  const [fuelLitres, setFuelLitres] = useState('50');
  const [fuelRate, setFuelRate] = useState('94.20');
  const [fuelOdometer, setFuelOdometer] = useState('48500');
  const [fuelStation, setFuelStation] = useState('Indian Oil Dealer, Saguna More');
  const [fuelPurpose, setFuelPurpose] = useState('Site deliveries');

  if (!isQuickAddOpen || !quickAddType) return null;

  const handleClose = () => {
    setQuickAddOpen(false);
    setQuickAddType(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error('Product name is required');
      return;
    }
    const cat = categories.find((c) => c.id === categoryId);
    const br = brands.find((b) => b.id === brandId);

    addProduct({
      name: productName,
      sku: `KC-${productName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      categoryId,
      categoryName: cat?.name || 'General',
      brandId: br?.id,
      brandName: br?.name,
      type: productType,
      unit,
      weight,
      description: `Premium construction material supplied by Kishor Construction.`,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currentStock: parseFloat(currentStock) || 0,
      minimumStock: parseFloat(minimumStock) || 0,
      imageUrl,
      status: 'Active',
      visibility,
      isFeatured,
    });

    toast.success('Product Added Successfully', `${productName} added to inventory & catalog.`);
    handleClose();
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }
    const today = new Date().toISOString().split('T')[0];

    addExpense({
      date: today,
      category: expenseCategory,
      amount,
      paidTo: expensePaidTo || 'Vendor',
      paymentMethod: expensePaymentMethod,
      description: expenseDescription || `${expenseCategory} payment`,
    });

    toast.success('Expense Recorded', `₹${amount.toLocaleString('en-IN')} logged under ${expenseCategory}.`);
    handleClose();
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) {
      toast.error('Employee name is required');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const baseSal = parseFloat(empSalary) || 18000;

    addEmployee({
      name: empName,
      role: empRole,
      department: empDept,
      phone: empPhone || '+91 90000 00000',
      basicSalary: baseSal,
      dailyWageRate: Math.round(baseSal / 30),
      joinDate: today,
      status: 'Active',
    });

    toast.success('Employee Registered', `${empName} added to payroll & attendance.`);
    handleClose();
  };

  const handleCreateFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const litres = parseFloat(fuelLitres) || 0;
    const rate = parseFloat(fuelRate) || 94.2;
    const odo = parseFloat(fuelOdometer) || 0;
    const totalCost = litres * rate;
    const veh = vehicles.find((v) => v.id === fuelVehicleId);
    const today = new Date().toISOString().split('T')[0];

    addFuelEntry({
      vehicleId: fuelVehicleId,
      vehicleNumber: veh?.vehicleNumber || 'BR-01-GB-4590',
      date: today,
      litres,
      fuelRatePerLitre: rate,
      totalCost,
      odometerReading: odo,
      distanceCoveredKm: 200,
      fuelStation,
      purpose: fuelPurpose,
      filledByDriver: veh?.driverName || 'Driver',
    });

    toast.success('Fuel Entry Logged', `${litres}L (₹${totalCost.toLocaleString('en-IN')}) recorded.`);
    handleClose();
  };

  // If sale or purchase was triggered, navigate to dedicated POS / Purchase page
  if (quickAddType === 'sale') {
    handleClose();
    setActivePage('new-sale');
    return null;
  }

  if (quickAddType === 'purchase') {
    handleClose();
    setActivePage('new-purchase');
    return null;
  }

  return (
    <Modal
      isOpen={isQuickAddOpen}
      onClose={handleClose}
      title={
        quickAddType === 'product'
          ? 'Add New Product'
          : quickAddType === 'expense'
          ? 'Record Operating Expense'
          : quickAddType === 'employee'
          ? 'Register New Employee'
          : 'Log Vehicle Diesel Entry'
      }
      subtitle="Kishor Construction Business Operating System"
      maxWidth="2xl"
    >
      {/* Product Form */}
      {quickAddType === 'product' && (
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Select
              label="Brand"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option value="">-- None / General --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.categoryName})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. UltraTech Super Weather Plus"
              required
            />
            <Input
              label="Product Type / Grade"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g. PPC / OPC 53 / 12mm Rebar"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Bag / Ton / CFT"
            />
            <Input
              label="Weight / Spec"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="50 KG"
            />
            <Input
              label="Purchase Price (₹)"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
            <Input
              label="Selling Price (₹)"
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Opening Stock Qty"
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
            />
            <Input
              label="Minimum Alert Stock"
              type="number"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-concrete-200">
            <Select
              label="Public Website Visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'Visible' | 'Hidden')}
            >
              <option value="Visible">Visible (Show on Customer Website)</option>
              <option value="Hidden">Hidden (Private in Admin Only)</option>
            </Select>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedQuick"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-concrete-300 text-yellow-brand focus:ring-yellow-brand cursor-pointer"
              />
              <label htmlFor="isFeaturedQuick" className="text-xs font-semibold text-charcoal-800 cursor-pointer">
                Feature on Public Website Homepage
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Save Product
            </Button>
          </div>
        </form>
      )}

      {/* Expense Form */}
      {quickAddType === 'expense' && (
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
              required
            >
              {[
                'Diesel',
                'Salary',
                'Electricity',
                'Rent',
                'Maintenance',
                'Transport & Freight',
                'Loading / Unloading',
                'Office & Admin',
                'Marketing & Promo',
                'Other',
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Input
              label="Amount (₹)"
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="e.g. 7000"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Paid To (Beneficiary / Vendor)"
              value={expensePaidTo}
              onChange={(e) => setExpensePaidTo(e.target.value)}
              placeholder="e.g. Indian Oil / Labour Group"
              required
            />

            <Select
              label="Payment Method"
              value={expensePaymentMethod}
              onChange={(e) => setExpensePaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="Cheque">Cheque</option>
            </Select>
          </div>

          <Input
            label="Description / Purpose"
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
            placeholder="e.g. 75L Diesel for Tipper BR-01-GB-4590"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Record Expense
            </Button>
          </div>
        </form>
      )}

      {/* Employee Form */}
      {quickAddType === 'employee' && (
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              placeholder="e.g. Rajesh Paswan"
              required
            />
            <Input
              label="Designation / Role"
              value={empRole}
              onChange={(e) => setEmpRole(e.target.value)}
              placeholder="e.g. Tipper Driver / Yard Loader"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Department"
              value={empDept}
              onChange={(e) => setEmpDept(e.target.value as any)}
            >
              <option value="Logistics">Logistics & Fleet</option>
              <option value="Sales">Sales & Counter</option>
              <option value="Warehouse">Warehouse & Yard</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance & Accounts</option>
            </Select>

            <Input
              label="Phone Number"
              value={empPhone}
              onChange={(e) => setEmpPhone(e.target.value)}
              placeholder="+91 94310 00000"
            />

            <Input
              label="Monthly Base Salary (₹)"
              type="number"
              value={empSalary}
              onChange={(e) => setEmpSalary(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Register Employee
            </Button>
          </div>
        </form>
      )}

      {/* Fuel Entry Form */}
      {quickAddType === 'fuel' && (
        <form onSubmit={handleCreateFuel} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Vehicle"
              value={fuelVehicleId}
              onChange={(e) => setFuelVehicleId(e.target.value)}
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.model})
                </option>
              ))}
            </Select>

            <Input
              label="Odometer KM Reading"
              type="number"
              value={fuelOdometer}
              onChange={(e) => setFuelOdometer(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Diesel Litres"
              type="number"
              value={fuelLitres}
              onChange={(e) => setFuelLitres(e.target.value)}
              required
            />
            <Input
              label="Fuel Rate / Litre (₹)"
              type="number"
              step="0.01"
              value={fuelRate}
              onChange={(e) => setFuelRate(e.target.value)}
              required
            />
            <div className="bg-concrete-100 p-2.5 rounded-lg border border-concrete-200 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-charcoal-500">Calculated Cost</span>
              <span className="text-base font-extrabold text-charcoal-900">
                ₹{((parseFloat(fuelLitres) || 0) * (parseFloat(fuelRate) || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Petrol Pump / Dealer"
              value={fuelStation}
              onChange={(e) => setFuelStation(e.target.value)}
            />
            <Input
              label="Trip Purpose / Route"
              value={fuelPurpose}
              onChange={(e) => setFuelPurpose(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Log Fuel Entry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
