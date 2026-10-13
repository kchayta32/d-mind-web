import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Coins,
  Cpu,
  FileText,
  Award,
  Users,
  Building2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  BatteryCharging,
  Sun,
  Moon,
  Radio,
  Box,
  Layers,
  Sparkles,
  Wallet,
  Calendar,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Info,
  Activity,
  AlertTriangle,
  Zap,
  HelpCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

import { useTheme } from '@/contexts/ThemeProvider';
import BlueCursorTrail from '@/components/common/BlueCursorTrail';

import {
  BusinessData,
  FounderMember,
  FinancialTransaction,
  ExpenseItem,
  GrantProgram,
  HardwareSpec,
  PatentItem,
  INITIAL_BUSINESS_DATA,
  getBusinessData,
  saveBusinessData,
  calculateDepositMath,
  calculateWithdrawMath,
  executeDeposit,
  executeWithdrawal,
  addExpenseItem,
  getCandlestickData,
  getCapitalExpenditureStatus,
  getFoundersCapTableSummary
} from '@/services/firebaseBusinessService';

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AdminBusinessPage() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [data, setData] = useState<BusinessData>(INITIAL_BUSINESS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('เพิ่งซิงก์');
  const [activeTab, setActiveTab] = useState<string>('financial');

  // Modals
  const [depositOpen, setDepositOpen] = useState<boolean>(false);
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);
  const [expenseOpen, setExpenseOpen] = useState<boolean>(false);

  // Form states for Deposit
  const [depositInvestorMode, setDepositInvestorMode] = useState<string>('__new__'); // '__new__' or founder.id
  const [depositNameTh, setDepositNameTh] = useState<string>('');
  const [depositNameEn, setDepositNameEn] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositNote, setDepositNote] = useState<string>('ผู้ร่วมลงทุนรอบใหม่ (New Equity Round)');

  // Form states for Withdraw
  const [withdrawFounderId, setWithdrawFounderId] = useState<string>('founder-1');
  const [withdrawShares, setWithdrawShares] = useState<number>(1000);
  const [withdrawReason, setWithdrawReason] = useState<string>('ขอถอนคืนเงินทุน / ลดสัดส่วนหุ้นส่วน');

  // Selected withdraw founder object
  const selectedWithdrawFounder = useMemo(() => {
    return data.founders.find(f => f.id === withdrawFounderId);
  }, [data.founders, withdrawFounderId]);

  // Selected deposit founder object (when existing investor mode)
  const selectedDepositFounder = useMemo(() => {
    if (depositInvestorMode === '__new__') return null;
    return data.founders.find(f => f.id === depositInvestorMode);
  }, [data.founders, depositInvestorMode]);

  // Openers with clean state reset
  const openDepositModal = (presetFounderId?: string) => {
    if (presetFounderId) {
      setDepositInvestorMode(presetFounderId);
      const found = data.founders.find(f => f.id === presetFounderId);
      if (found) {
        setDepositNameTh(found.nameTh);
        setDepositNameEn(found.nameEn);
        setDepositNote(`เพิ่มทุนผู้ร่วมลงทุนเดิม (${found.nameTh})`);
      }
    } else {
      setDepositInvestorMode('__new__');
      setDepositNameTh('');
      setDepositNameEn('');
      setDepositNote('ผู้ร่วมลงทุนรายใหม่ (New Equity Round)');
    }
    setDepositAmount(1000);
    setDepositOpen(true);
  };

  const openWithdrawModal = (presetFounderId?: string) => {
    const validFounder = data.founders.find(f => f.shares > 0);
    const targetId = presetFounderId || withdrawFounderId || (validFounder ? validFounder.id : 'founder-1');
    setWithdrawFounderId(targetId);
    const targetFounder = data.founders.find(f => f.id === targetId);
    if (targetFounder) {
      setWithdrawShares(Math.min(1000, targetFounder.shares));
    }
    setWithdrawOpen(true);
  };

  // Form states for Expense
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<number>(500);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseItem['category']>('hardware');
  const [expenseRecipient, setExpenseRecipient] = useState<string>('');
  const [expenseNote, setExpenseNote] = useState<string>('');

  // Fetch initial data
  const loadData = async (showToast: boolean = false) => {
    try {
      setSyncing(true);
      const res = await getBusinessData();
      setData(res);
      setLastSyncTime(new Date().toLocaleTimeString('th-TH'));
      if (showToast) {
        toast.success('ซิงก์ข้อมูลกับ Firebase Realtime Database สำเร็จ');
      }
    } catch (err) {
      console.error(err);
      toast.error('ไม่สามารถดึงข้อมูลล่าสุดจาก Firebase ได้');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Total Grants Pipeline Target
  const totalGrantPipeline = useMemo(() => {
    return data.grants.reduce((acc, g) => acc + g.maxGrantThb, 0);
  }, [data.grants]);

  // Actual Grants Received (Currently 0)
  const actualGrantsReceived = useMemo(() => {
    return data.grants.reduce((acc, g) => acc + (g.receivedThb || 0), 0);
  }, [data.grants]);

  // Total Capital Inflows from 3 founders
  const totalCapitalInflow = useMemo(() => {
    return data.founders.reduce((acc, f) => acc + f.investedAmount, 0);
  }, [data.founders]);

  // Total Expenses (Currently 0)
  const totalExpenses = useMemo(() => {
    return (data.expenses || []).reduce((acc, e) => acc + e.amount, 0);
  }, [data.expenses]);

  // Deposit simulation math
  const depositSim = useMemo(() => {
    return calculateDepositMath(data, depositAmount, depositNameTh);
  }, [data, depositAmount, depositNameTh]);

  // Withdraw simulation math
  const withdrawSim = useMemo(() => {
    return calculateWithdrawMath(data, withdrawFounderId, withdrawShares);
  }, [data, withdrawFounderId, withdrawShares]);

  // Handlers
  const handleExecuteDeposit = async () => {
    if (!depositNameTh.trim()) {
      toast.error('กรุณาระบุชื่อผู้ร่วมลงทุน (ภาษาไทย)');
      return;
    }
    if (depositAmount <= 0) {
      toast.error('จำนวนเงินลงทุนต้องมากกว่า 0 บาท');
      return;
    }

    try {
      setSyncing(true);
      const updated = await executeDeposit(
        data,
        depositNameTh.trim(),
        depositNameEn.trim(),
        depositAmount,
        depositNote
      );
      setData(updated);
      setDepositOpen(false);
      setDepositInvestorMode('__new__');
      setDepositNameTh('');
      setDepositNameEn('');
      setDepositAmount(1000);
      toast.success(`บันทึกเงินลงทุนของ ${depositNameTh} สำเร็จแล้ว (+${depositAmount.toLocaleString()} บาท)`);
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSyncing(false);
    }
  };

  const handleExecuteWithdrawal = async () => {
    if (!selectedWithdrawFounder) {
      toast.error('กรุณาเลือกผู้ถือหุ้นที่ต้องการถอนทุน');
      return;
    }
    if (withdrawShares <= 0) {
      toast.error('จำนวนหุ้นที่ต้องการถอนต้องมากกว่า 0 หุ้น');
      return;
    }
    if (withdrawShares > selectedWithdrawFounder.shares) {
      toast.error(`จำนวนหุ้นที่ต้องการถอนต้องไม่เกิน ${selectedWithdrawFounder.shares.toLocaleString()} หุ้น`);
      return;
    }

    try {
      setSyncing(true);
      const updated = await executeWithdrawal(
        data,
        withdrawFounderId,
        withdrawShares,
        withdrawReason
      );
      setData(updated);
      setWithdrawOpen(false);
      toast.success(`บันทึกการถอนทุนของ ${selectedWithdrawFounder.nameTh} เรียบร้อย จ่ายคืน ฿${withdrawSim.payoutAmount.toLocaleString()} บาท`);
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseTitle.trim()) {
      toast.error('กรุณาระบุรายการค่าใช้จ่าย');
      return;
    }
    if (expenseAmount <= 0) {
      toast.error('จำนวนเงินต้องมากกว่า 0 บาท');
      return;
    }

    try {
      setSyncing(true);
      const updated = await addExpenseItem(data, {
        date: new Date().toISOString().split('T')[0],
        title: expenseTitle.trim(),
        category: expenseCategory,
        amount: expenseAmount,
        recipient: expenseRecipient.trim() || 'ผู้จัดจำหน่าย/บริการ',
        proofNote: expenseNote.trim() || 'บันทึกรายจ่ายการวิจัยและพัฒนา'
      });
      setData(updated);
      setExpenseOpen(false);
      setExpenseTitle('');
      setExpenseAmount(500);
      setExpenseRecipient('');
      setExpenseNote('');
      toast.success(`บันทึกค่าใช้จ่าย "${expenseTitle.trim()}" (฿${expenseAmount.toLocaleString()}) ลง Firebase RTDB สำเร็จ`);
    } catch (err: any) {
      console.error('[Admin Business] Error adding expense:', err);
      toast.error(err?.message || 'เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย');
    } finally {
      setSyncing(false);
    }
  };

  const expenseStatus = useMemo(() => {
    return getCapitalExpenditureStatus(data);
  }, [data]);

  const capTableSummary = useMemo(() => {
    return getFoundersCapTableSummary(data);
  }, [data]);

  const candlestickPoints = useMemo(() => {
    return getCandlestickData(data);
  }, [data]);

  const chartMaxY = useMemo(() => {
    const peak = candlestickPoints.reduce((max, p) => {
      const pointMax = Math.max(p.high || 0, p.close || 0, p.open || 0, p.valuation || 0);
      return Math.max(max, pointMax);
    }, 3500);
    return Math.ceil((peak * 1.15) / 500) * 500;
  }, [candlestickPoints]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative">
      {/* Signature D-MIND Blue Neon Cursor Trail Effect */}
      <BlueCursorTrail />

      {/* Top Banner & Security Warning */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center transition-colors">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  D-MIND Business Portal
                </h1>
                <Badge variant="outline" className="text-[11px] font-mono border-amber-500/50 text-amber-700 dark:text-amber-300 bg-amber-500/10 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  RESTRICTED /admin
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                ระบบข้อมูลผู้ร่วมลงทุน วิจัย พัฒนา และโครงสร้างหุ้น D-MIND
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Database Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 dark:text-slate-300 hidden md:inline">Firebase RTDB:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">Connected</span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] hidden lg:inline">({lastSyncTime})</span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2.5 shadow-sm"
              title={`เปลี่ยนธีมเป็นโหมด ${isDark ? 'สว่าง (Light)' : 'มืด (Dark)'}`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={syncing}
              className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-blue-600 dark:text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">ซิงก์ข้อมูล</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Project Intro Notice / D-MIND Signature Hero Card */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/10 via-cyan-900/5 to-slate-100 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-slate-900 border border-blue-500/20 dark:border-blue-500/30 p-5 sm:p-6 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                  {data.projectName}
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {data.projectThName}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                ศูนย์กลางการบริหารยุทธศาสตร์ธุรกิจ ผู้ร่วมลงทุน และ R&amp;D
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                สถานะปัจจุบัน: <strong>มีเฉพาะเงินลงทุนเริ่มต้นจาก 3 ผู้ร่วมก่อตั้งคนละ 1,000 บาท รวม 3,000 บาท</strong> (ยังไม่มีผู้สนับสนุนทุนภายนอกหรือได้รับทุนจากแหล่งใด) พร้อมระบบจำลองฝาก-ถอนหุ้นส่วนเชื่อมโยง Firebase Realtime Database
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => openDepositModal()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20 text-xs gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                ฝากทุน / เพิ่มผู้ลงทุน
              </Button>
              <Button
                onClick={() => openWithdrawModal()}
                variant="outline"
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs gap-1.5"
              >
                <MinusCircle className="w-4 h-4 text-rose-500" />
                ถอนทุน / คืนหุ้น
              </Button>
            </div>
          </div>
        </div>

        {/* Live Capital Status Alert Banner */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <strong className="font-semibold block text-amber-950 dark:text-amber-100">
              สถานะเงินทุนจริงในปัจจุบัน (Verified Real Capital):
            </strong>
            <p>
              • <strong>เงินลงทุนเริ่มต้น:</strong> มีเฉพาะสมาชิก 3 ผู้ร่วมก่อตั้ง ได้แก่ <strong>กิตติ ชัยตา (1,000 บ.)</strong>, <strong>ศตวรรษ อินทรักษ์ (1,000 บ.)</strong>, และ <strong>ธนกฤษ วรรณรังษี (1,000 บ.)</strong> รวมเงินลงทุนจริงทั้งสิ้น <strong>3,000 บาท</strong>
            </p>
            <p>
              • <strong>ผู้สนับสนุนทุนภายนอก (Grants &amp; Sponsors):</strong> <strong>ปัจจุบันยังไม่มีผู้สนับสนุนทุนใดๆ (ยอดเงินได้รับจริง = 0 บาท)</strong> โครงการทุนสนับสนุนต่างๆ (TED Fund, NIA, depa, วช., Super AI) อยู่ในขั้นตอนเตรียมการจัดทำข้อเสนอโครงการ (Pipeline Target)
            </p>
          </div>
        </div>

        {/* KPI Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Total Capital */}
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm hover:border-blue-500/40 transition">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">ทุนจดทะเบียนรวม</span>
                <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                ฿{totalCapitalInflow.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                3 ผู้ร่วมก่อตั้งคนละ 1,000 บ.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Cash Balance */}
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">เงินสดคงเหลือ (Treasury)</span>
                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                ฿{data.cashBalance.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {expenseStatus.totalExpenses === 0
                  ? 'คงเหลือเต็มจำนวน (100%)'
                  : `คงเหลือ ${expenseStatus.remainingRate}% (ใช้จ่ายไป ฿${expenseStatus.totalExpenses.toLocaleString()})`}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Pre-Money Valuation */}
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm hover:border-cyan-500/40 transition">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">มูลค่าทุนปัจจุบัน</span>
                <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
                ฿{data.valuationPostMoney.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                ฿{(data.valuationPostMoney / data.totalShares).toFixed(2)} ต่อหุ้น
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Grants Received vs Planned */}
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm hover:border-amber-500/40 transition">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">ทุนสนับสนุนภายนอก</span>
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
                ฿0
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                เป้าหมายยื่นขอ ฿{(totalGrantPipeline / 1000000).toFixed(2)}M
              </p>
            </CardContent>
          </Card>

          {/* Card 5: Total Shares */}
          <Card className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm hover:border-purple-500/40 transition">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">จำนวนหุ้นทั้งหมด</span>
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300 tracking-tight">
                {data.totalShares.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Par ฿{data.parValuePerShare} / หุ้น
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="financial" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              กราฟแท่งเทียนการเงิน
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              ทีมวิจัย &amp; ผู้ร่วมก่อตั้ง
            </TabsTrigger>
            <TabsTrigger value="captable" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Coins className="w-3.5 h-3.5 mr-1.5" />
              Cap Table &amp; คำนวณฝาก/ถอน
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              การนำเงินไปใช้ (Expenses)
            </TabsTrigger>
            <TabsTrigger value="grants" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              ทุนสนับสนุนให้เปล่า (Grants)
            </TabsTrigger>
            <TabsTrigger value="hardware" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Cpu className="w-3.5 h-3.5 mr-1.5" />
              ฮาร์ดแวร์กึ่งอุตสาหกรรม
            </TabsTrigger>
            <TabsTrigger value="patents" className="text-xs py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              สิทธิบัตรและอนุสิทธิบัตร
            </TabsTrigger>
          </TabsList>

          {/* ========================================================================= */}
          {/* TAB 1: Financial & Candlestick */}
          {/* ========================================================================= */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Candlestick & Trajectory Chart */}
              <Card className="lg:col-span-2 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        กราฟแสดงกระแสเงินทุนและการเติบโต (Capital Flow &amp; Valuation Trajectory)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        แสดงมูลค่าสะสมและกระแสเงินทุนคงเหลือสุทธิหลังหักรายจ่ายตามเวลาจริง
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 text-[11px] self-start sm:self-auto">
                      {expenseStatus.totalExpenses > 0 ? `ใช้จ่ายแล้ว ฿${expenseStatus.totalExpenses.toLocaleString()}` : 'ทุนตั้งต้นเต็ม 100%'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={candlestickPoints} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                        <XAxis dataKey="date" stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, chartMaxY]} stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#cbd5e1',
                            borderRadius: '8px',
                            color: isDark ? '#f8fafc' : '#0f172a'
                          }}
                          formatter={(value: any, name: string) => [
                            `฿${Number(value).toLocaleString()}`,
                            name === 'close'
                              ? 'กระแสเงินสดคงเหลือสะสม (Net Capital Flow)'
                              : name === 'valuation'
                              ? 'มูลค่าการเติบโตของทุน (Valuation Trajectory)'
                              : name === 'high'
                              ? 'High'
                              : name === 'low'
                              ? 'Low'
                              : 'เงินทุน/ค่าใช้จ่ายในรอบ (Volume)'
                          ]}
                          labelStyle={{ color: isDark ? '#94a3b8' : '#475569', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="volume" fill="#0284c7" fillOpacity={0.4} yAxisId={0} name="เงินลงทุน/ค่าใช้จ่ายในรอบ (Volume)" />
                        <Line type="monotone" dataKey="valuation" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="3 3" dot={{ fill: '#8b5cf6', r: 4 }} name="มูลค่าการเติบโตของทุน (Valuation Trajectory)" />
                        <Line type="monotone" dataKey="close" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="กระแสเงินสดคงเหลือสุทธิ (Net Capital Flow)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">ทุนจดทะเบียนรวม</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-cyan-300">฿{totalCapitalInflow.toLocaleString()} บ.</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">รายจ่ายสะสมจริง</span>
                      <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">฿{totalExpenses.toLocaleString()} บ.</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">เงินสดคงเหลือสุทธิ</span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">฿{data.cashBalance.toLocaleString()} บ.</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">สัดส่วนเงินทุนคงเหลือ</span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-300">{expenseStatus.remainingRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Log */}
              <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      บันทึกรายการเงินทุน
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {data.transactions.length} รายการ
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
                  {data.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">
                            {tx.title}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                          +฿{tx.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                        {tx.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-900">
                        <span>{tx.investorOrParty}</span>
                        <span className="font-mono">{tx.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 2: Team Members & R&D Profiles */}
          {/* ========================================================================= */}
          <TabsContent value="team" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                คณะผู้ร่วมวิจัย ผู้ก่อตั้ง และที่ปรึกษาโครงการ D-MIND
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                บุคลากรผู้วิจัยและคิดค้นระบบเฝ้าระวังและแจ้งเตือนภัยพิบัติอัจฉริยะ สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.founders.map((member, idx) => (
                <Card
                  key={member.id}
                  className={`bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm relative overflow-hidden ${
                    member.isMentor ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10' : ''
                  }`}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${
                    idx === 0 ? 'from-blue-500 to-indigo-500' :
                    idx === 1 ? 'from-emerald-500 to-teal-500' :
                    idx === 2 ? 'from-cyan-500 to-blue-500' :
                    'from-amber-500 to-orange-500'
                  }`} />
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {member.nameTh}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            ({member.nameEn})
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {member.roleTh}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {member.university}
                        </p>
                      </div>

                      {member.isMentor ? (
                        <Badge className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]">
                          Project Mentor
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[10px]">
                          Co-Founder
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4">
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      {member.bioTh}
                    </p>

                    {/* Financial summary for member */}
                    {!member.isMentor ? (
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">เงินลงทุน</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            ฿{member.investedAmount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">จำนวนหุ้น</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {member.shares.toLocaleString()} หุ้น
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">สัดส่วนถือหุ้น</span>
                          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                            {member.percentage}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                        ⚡ อาจารย์ที่ปรึกษาตั้งแต่การแข่งขันปี 2567 จนถึงการทำวิทยานิพนธ์ (ไม่มีข้อมูลการลงทุน / Advisory Mentorship)
                      </div>
                    )}

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 3: Cap Table & Deposit/Withdraw Simulator */}
          {/* ========================================================================= */}
          <TabsContent value="captable" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cap Table Breakdown */}
              <Card className="lg:col-span-2 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ตารางโครงสร้างผู้ถือหุ้น (Founding Cap Table)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        คำนวณสัดส่วนความเป็นเจ้าของตามเงินลงทุนจริงและมูลค่าประเมินบริษัท
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 text-[11px]">
                      Par ฿{data.parValuePerShare}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Individual Founder Remaining Shares Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {capTableSummary.map((f, i) => (
                      <div
                        key={f.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {f.nameTh}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                            <span>หุ้นคงเหลือปัจจุบัน:</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                              {f.remainingShares > 0 ? `${f.remainingShares.toLocaleString()} หุ้น` : 'ที่ปรึกษา'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                            <span>สัดส่วนถือหุ้น:</span>
                            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              {f.percentage > 0 ? `${f.percentage}%` : '0%'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                            <span>สินทรัพย์สุทธิ:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              {f.netAssetValue > 0 ? `฿${f.netAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3 font-semibold">ผู้ถือหุ้น / ผู้ร่วมลงทุน</th>
                          <th className="p-3 font-semibold text-right">เงินลงทุน (THB)</th>
                          <th className="p-3 font-semibold text-right">หุ้นเริ่มต้น</th>
                          <th className="p-3 font-semibold text-right">หุ้นคงเหลือปัจจุบัน</th>
                          <th className="p-3 font-semibold text-right">สัดส่วน (%)</th>
                          <th className="p-3 font-semibold text-right">มูลค่าสินทรัพย์สุทธิ</th>
                          <th className="p-3 font-semibold text-center">สถานะ</th>
                          <th className="p-3 font-semibold text-center">วันที่ลงทุน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200">
                        {capTableSummary.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                            <td className="p-3">
                              <div className="font-semibold text-slate-900 dark:text-white">{f.nameTh}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.roleTh}</div>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {f.investedAmount > 0 ? `฿${f.investedAmount.toLocaleString()}` : '-'}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-500 dark:text-slate-400">
                              {f.initialShares > 0 ? f.initialShares.toLocaleString() : '-'}
                            </td>
                            <td className="p-3 text-right font-mono">
                              {f.remainingShares > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/30">
                                  {f.remainingShares.toLocaleString()} หุ้น
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              {f.percentage > 0 ? `${f.percentage}%` : 'Mentor'}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-200">
                              {f.netAssetValue > 0 ? `฿${f.netAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant="outline" className="text-[10px] border-slate-300 dark:border-slate-700">
                                {f.statusText}
                              </Badge>
                            </td>
                            <td className="p-3 text-center text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                              {f.investDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100 dark:bg-slate-950/80 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
                        <tr>
                          <td className="p-3">รวมทั้งหมด (Total Diluted)</td>
                          <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-mono">฿{totalCapitalInflow.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-500">
                            {capTableSummary.reduce((sum, f) => sum + (f.initialShares || 0), 0).toLocaleString()} หุ้น
                          </td>
                          <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">{data.totalShares.toLocaleString()} หุ้น</td>
                          <td className="p-3 text-right text-cyan-600 dark:text-cyan-400 font-mono">100.00%</td>
                          <td className="p-3 text-right text-slate-800 dark:text-slate-200 font-mono">฿{data.cashBalance.toLocaleString()}</td>
                          <td className="p-3 text-center text-slate-400">-</td>
                          <td className="p-3 text-center text-slate-400">-</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Visual Share Distribution */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                      แผนภูมิการกระจายสัดส่วนหุ้นส่วน (Equal 33.33% Equity Split):
                    </span>
                    <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex overflow-hidden">
                      {data.founders.filter(f => f.shares > 0).map((f, i) => (
                        <div
                          key={f.id}
                          style={{
                            width: `${f.percentage}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                          className="h-full transition-all duration-500"
                          title={`${f.nameTh}: ${f.percentage}%`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-600 dark:text-slate-400">
                      {data.founders.filter(f => f.shares > 0).map((f, i) => (
                        <div key={f.id} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span>{f.nameTh} ({f.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deposit & Withdraw Simulator Card */}
              <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    เครื่องมือคำนวณฝาก/ถอนหุ้น (Valuation Simulator)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    จำลองผลกระทบต่อสัดส่วนหุ้น (Dilution) และมูลค่า Post-Money ก่อนบันทึกจริง
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-blue-500/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">ราคาประเมินต่อหุ้นปัจจุบัน:</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        ฿{(data.valuationPreMoney / data.totalShares).toFixed(2)} / หุ้น
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Pre-Money Valuation:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        ฿{data.valuationPreMoney.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">จำนวนหุ้นจดทะเบียนเดิม:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {data.totalShares.toLocaleString()} หุ้น
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={() => openDepositModal()}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-2 py-2.5 shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      เปิดระบบจำลองและบันทึกเงินลงทุน (Deposit)
                    </Button>
                    <Button
                      onClick={() => openWithdrawModal()}
                      variant="outline"
                      className="w-full border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs gap-2 py-2.5"
                    >
                      <MinusCircle className="w-4 h-4 text-rose-500" />
                      เปิดระบบจำลองและบันทึกการถอนทุน (Withdraw)
                    </Button>
                  </div>
                </CardContent>
                <div className="p-4 bg-slate-100/50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
                  💡 ข้อมูลธุรกรรมฝากและถอนจะถูกอัปเดตลง <strong>Firebase Realtime Database</strong> แบบสองทางทันที
                </div>
              </Card>

            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 4: Fund Usage & Expenses */}
          {/* ========================================================================= */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  การนำเงินไปใช้และบันทึกรายจ่าย (D-MIND Fund Allocation)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  ติดตามการใช้จ่ายเงินทุนสำหรับอุปกรณ์เซนเซอร์ กล่องกึ่งอุตสาหกรรม ซิมการ์ด IoT และการวิจัย
                </p>
              </div>

              <Button
                onClick={() => setExpenseOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                บันทึกค่าใช้จ่ายใหม่
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Category Breakdown */}
              <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-slate-900 dark:text-white">
                      สถานะการใช้จ่ายเงินทุน
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        expenseStatus.isFullyFunded
                          ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10'
                      }`}
                    >
                      {expenseStatus.statusBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseStatus.isFullyFunded ? (
                    <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-200">
                      ✨ <strong>ยังไม่มีรายจ่ายเกิดขึ้น (0 บาท):</strong> เงินทุนทั้งหมด ฿{expenseStatus.initialCapital.toLocaleString()} บาท ยังคงอยู่ในกระเป๋าเงินสดคงเหลือครบ 100%
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div>
                        ⚡ <strong>บันทึกค่าใช้จ่ายแล้ว {expenseStatus.expensesCount} รายการ:</strong> รวม ฿{expenseStatus.totalExpenses.toLocaleString()} บาท (อัตราการใช้เงินทุน {expenseStatus.utilizationRate}%)
                      </div>
                      <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                        กระแสเงินสดสำรองคงเหลือสุทธิ ฿{expenseStatus.remainingCash.toLocaleString()} บาท ({expenseStatus.remainingRate}%)
                      </div>
                    </div>
                  )}

                  {/* Fund Utilization Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>อัตราการใช้เงินทุน</span>
                      <span className="font-mono font-medium">{expenseStatus.utilizationRate}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                      <div
                        className="bg-amber-500 h-full transition-all duration-500"
                        style={{ width: `${expenseStatus.utilizationRate}%` }}
                        title={`ใช้จ่ายไปแล้ว ${expenseStatus.utilizationRate}%`}
                      />
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${expenseStatus.remainingRate}%` }}
                        title={`เงินสดคงเหลือ ${expenseStatus.remainingRate}%`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>เบิกจ่ายแล้ว: ฿{expenseStatus.totalExpenses.toLocaleString()}</span>
                      <span>คงเหลือ: ฿{expenseStatus.remainingCash.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Category Allocation Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                      จัดสรรตามหมวดหมู่งานวิจัย:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60">
                        <span className="text-slate-400 block text-[10px]">ฮาร์ดแวร์ &amp; กล่อง</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">฿{expenseStatus.categoryBreakdown.hardware.toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60">
                        <span className="text-slate-400 block text-[10px]">ซิม 4G &amp; IoT</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">฿{expenseStatus.categoryBreakdown.iot_cellular.toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60">
                        <span className="text-slate-400 block text-[10px]">คลาวด์ &amp; เซิร์ฟเวอร์</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">฿{expenseStatus.categoryBreakdown.cloud_infrastructure.toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60">
                        <span className="text-slate-400 block text-[10px]">สิทธิบัตร &amp; กฎหมาย</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">฿{expenseStatus.categoryBreakdown.patents_legal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1 border-t border-slate-200 dark:border-slate-800">
                    <div>ทุนตั้งต้นทั้งหมด: <strong className="text-slate-900 dark:text-white font-mono">฿{expenseStatus.initialCapital.toLocaleString()}</strong></div>
                    <div>รายจ่ายสะสม: <strong className="text-rose-500 font-mono">฿{expenseStatus.totalExpenses.toLocaleString()}</strong></div>
                    <div>เงินสดคงเหลือ: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">฿{expenseStatus.remainingCash.toLocaleString()}</strong></div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Items Table */}
              <Card className="md:col-span-2 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-900 dark:text-white">
                    บันทึกรายการค่าใช้จ่าย
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.expenses && data.expenses.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3 font-semibold">รายการ</th>
                            <th className="p-3 font-semibold">หมวดหมู่</th>
                            <th className="p-3 font-semibold text-right">จำนวนเงิน (THB)</th>
                            <th className="p-3 font-semibold">ผู้รับเงิน / หลักฐาน</th>
                            <th className="p-3 font-semibold text-center">วันที่</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                          {data.expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                              <td className="p-3 font-medium text-slate-900 dark:text-white">{exp.title}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="text-[10px] uppercase border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {exp.category}
                                </Badge>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-rose-500">
                                -฿{exp.amount.toLocaleString()}
                              </td>
                              <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                                {exp.recipient}
                              </td>
                              <td className="p-3 text-center text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                {exp.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-lg border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                      <Wallet className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ยังไม่มีรายการค่าใช้จ่ายที่เกิดขึ้น เงินทุนสะสม 3,000 บาท คงเหลือครบเต็มจำนวน
                      </p>
                      <Button
                        onClick={() => setExpenseOpen(true)}
                        size="sm"
                        variant="outline"
                        className="text-xs mt-2 border-slate-300 dark:border-slate-700"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1" />
                        เพิ่มรายการค่าใช้จ่าย
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 5: Non-Dilutive Grants */}
          {/* ========================================================================= */}
          <TabsContent value="grants" className="space-y-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  แผนการระดมทุนสนับสนุนให้เปล่าจากภาครัฐ (Non-Dilutive Grants Pipeline)
                </h3>
                <Badge className="bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 text-xs self-start sm:self-auto">
                  ได้รับจริงในปัจจุบัน: ฿0 (อยู่ในแผนงาน)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                เป้าหมายการขอรับทุนวิจัยและพัฒนาโดยไม่ต้องเสียสัดส่วนหุ้น รวมมูลค่าเป้าหมาย <strong>฿5,250,000 บาท</strong> (ทุกรายการอยู่ในขั้นตอนเตรียมข้อเสนอโครงการ)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.grants.map((grant) => (
                <Card key={grant.id} className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm flex flex-col justify-between">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700">
                        สถานะ: {grant.note || 'อยู่ในแผนงาน'}
                      </Badge>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                          เป้าหมาย ฿{grant.maxGrantThb.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ได้รับจริง: ฿0
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                      {grant.nameTh}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      หน่วยงาน: {grant.agency}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="text-[11px] text-cyan-700 dark:text-cyan-300 font-medium">
                        เงื่อนไข: {grant.matchRatio}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        <strong>เป้าหมายส่งมอบ:</strong> {grant.deliverableTarget}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>กำหนดการ: {grant.expectedDate}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">Non-Dilutive</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 6: Pre-Production Hardware */}
          {/* ========================================================================= */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                การปรับแต่งฮาร์ดแวร์สู่ระดับกึ่งอุตสาหกรรม (Pre-Production Hardware R&amp;D)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                สถาปัตยกรรมทางวิศวกรรมเพื่อยกระดับจากอุปกรณ์ต้นแบบสู่สถานีตรวจวัดภาคสนามทนทานต่อสภาพอากาศ 24/7
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900 border border-blue-200 dark:border-blue-500/20 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Box className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">1. Enclosure กันน้ำกันฝุ่น IP66/IP67</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  กล่อง Polycarbonate / High-Impact ABS กันแสง UV พร้อมเคเบิลแกลนด์กันน้ำ IP68 (PG7/PG9/PG11) และ Breathable Vent ป้องกันหยดน้ำค้างและความชื้นสะสมภายใน
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-500/20 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">2. ระบบพลังงานสำรอง (Autonomy &ge; 3 วัน)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  แผงโซลาร์เซลล์ 30W–50W โมโนคริสตัลไลน์ + วงจรชาร์จ MPPT + แบตเตอรี่ LiFePO4 12.8V พร้อม BMS อัจฉริยะ สำรองไฟทำงานได้ต่อเนื่องเกิน 72 ชม. แม้ฝนตกหนักไม่มีแดด
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/20 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">3. การสื่อสารระดับ Cellular 4G LTE-M / NB-IoT</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ติดตั้งชิปสื่อสาร Quectel BG95 / SIM7080G ทดแทน Wi-Fi บ้าน เชื่อมต่อเครือข่ายมือถือตรงสู่ Firebase และมี Circular Buffer Local SD ป้องกันข้อมูลสูญหายเมื่ออับสัญญาณ
                </p>
              </div>
            </div>

            {/* Bill of Materials (BOM) Specs Table */}
            <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    รายการข้อมูลจำเพาะเชิงเทคนิคและต้นทุนต่อหน่วย (Bill of Materials - BOM)
                  </CardTitle>
                  <Badge variant="outline" className="text-xs text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700">
                    Pre-Production Baseline
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3 font-semibold">อุปกรณ์ / ชิ้นส่วน</th>
                        <th className="p-3 font-semibold">ข้อมูลจำเพาะเชิงเทคนิค</th>
                        <th className="p-3 font-semibold">มาตรฐานอุตสาหกรรม</th>
                        <th className="p-3 font-semibold text-right">ราคาต่อหน่วย (THB)</th>
                        <th className="p-3 font-semibold text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {data.hardwareSpecs.map((hw) => (
                        <tr key={hw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{hw.item}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs">{hw.specDetail}</td>
                          <td className="p-3 font-mono text-cyan-700 dark:text-cyan-400 text-[11px]">{hw.industrialStandard}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ฿{hw.costPerUnitThb.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className="text-[10px] border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {hw.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 dark:bg-slate-950/80 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td className="p-3" colSpan={3}>ต้นทุนรวมโดยประมาณต่อ 1 สถานีตรวจวัด (Total BOM per Station)</td>
                        <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                          ฿{data.hardwareSpecs.reduce((a, b) => a + b.costPerUnitThb, 0).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 7: Patents & IP Roadmap */}
          {/* ========================================================================= */}
          <TabsContent value="patents" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                แผนงานจดสิทธิบัตรและอนุสิทธิบัตร (Intellectual Property Roadmap)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                การสร้างกำแพงคุ้มครองทรัพย์สินทางปัญญากับกรมทรัพย์สินทางปัญญา (DIP) และมหาวิทยาลัยราชภัฏสวนสุนันทา
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.patents.map((pat) => (
                <Card key={pat.id} className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`text-[10px] ${
                        pat.type === 'petty_patent' ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' :
                        pat.type === 'invention_patent' ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' :
                        'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30'
                      }`}>
                        {pat.type === 'petty_patent' ? 'อนุสิทธิบัตร (10 ปี)' :
                         pat.type === 'invention_patent' ? 'สิทธิบัตรการประดิษฐ์ (20 ปี)' :
                         'ลิขสิทธิ์ซอฟต์แวร์ (50 ปี)'}
                      </Badge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {pat.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                      {pat.titleTh}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                      {pat.titleEn}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <span className="text-slate-700 dark:text-slate-400 font-semibold block text-[11px]">
                        ข้อถือสิทธิหลัก (Core Claims):
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300">
                        {pat.coreClaims.map((claim, cIdx) => (
                          <li key={cIdx} className="leading-relaxed">
                            {claim}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>เป้าหมายยื่น: {pat.filingTargetDate}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">{pat.targetAgency}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: DEPOSIT / NEW INVESTMENT */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL: DEPOSIT / NEW INVESTMENT */}
      {/* ========================================================================= */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              บันทึกเงินร่วมลงทุนและคำนวณหุ้นส่วน (Deposit / Equity Dilution)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              เลือกระหว่างเพิ่มทุนให้ผู้ร่วมลงทุนเดิมในพอร์ต หรือระบุชื่อผู้ลงทุนรายใหม่ผ่าน Textbox
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* 1. Dropdown for selecting existing portfolio investors or new investor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ดรอปดาวน์เลือกผู้ร่วมลงทุน (จากพอร์ตลงทุนทั้งหมด)
                </Label>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    depositInvestorMode === '__new__'
                      ? 'text-blue-600 dark:text-cyan-400 border-blue-500/30 bg-blue-500/10'
                      : 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  }`}
                >
                  {depositInvestorMode === '__new__' ? '✨ ผู้ลงทุนรายใหม่' : '🔄 เพิ่มทุนผู้ถือหุ้นเดิม'}
                </Badge>
              </div>

              <div className="relative">
                <select
                  value={depositInvestorMode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDepositInvestorMode(val);
                    if (val === '__new__') {
                      setDepositNameTh('');
                      setDepositNameEn('');
                      setDepositNote('ผู้ร่วมลงทุนรายใหม่ (New Equity Round)');
                    } else {
                      const found = data.founders.find(f => f.id === val);
                      if (found) {
                        setDepositNameTh(found.nameTh);
                        setDepositNameEn(found.nameEn);
                        setDepositNote(`เพิ่มทุนผู้ร่วมลงทุนเดิม (${found.nameTh})`);
                      }
                    }
                  }}
                  className="w-full h-10 appearance-none rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 pr-9 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm transition-colors"
                >
                  <option value="__new__" className="font-semibold text-blue-600 dark:text-cyan-400 bg-white dark:bg-slate-900">
                    ➕ ผู้ลงทุนรายใหม่ (New Investor - ระบุในช่อง Textbox ด้านล่าง)
                  </option>
                  {data.founders.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {f.nameTh} ({f.nameEn}) {f.shares > 0 ? `• ลงทุน ฿${f.investedAmount.toLocaleString()} (${f.shares.toLocaleString()} หุ้น - ${f.percentage}%)` : `• ${f.roleTh}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Existing Member Card Summary (when selected from dropdown) */}
            {selectedDepositFounder && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {selectedDepositFounder.nameTh} ({selectedDepositFounder.nameEn})
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-300 border-emerald-500/40">
                    ถือครองปัจจุบัน {selectedDepositFounder.percentage}%
                  </Badge>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span>เงินลงทุนเดิม: ฿{selectedDepositFounder.investedAmount.toLocaleString()}</span>
                  <span>จำนวนหุ้นเดิม: {selectedDepositFounder.shares.toLocaleString()} หุ้น</span>
                </div>
              </div>
            )}

            {/* 2. Textboxes for Thai and English names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-700 dark:text-slate-300">
                    ชื่อผู้ร่วมลงทุน (ภาษาไทย)
                  </Label>
                  {depositInvestorMode === '__new__' ? (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">* ผู้ลงทุนใหม่</span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">จากพอร์ต</span>
                  )}
                </div>
                <Input
                  placeholder="เช่น สมชาย ใจดี หรือ กองทุนร่วมลงทุน"
                  value={depositNameTh}
                  onChange={(e) => {
                    setDepositNameTh(e.target.value);
                    if (depositInvestorMode !== '__new__') {
                      setDepositInvestorMode('__new__');
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-700 dark:text-slate-300">
                    ชื่อผู้ร่วมลงทุน (ภาษาอังกฤษ)
                  </Label>
                  {depositInvestorMode === '__new__' ? (
                    <span className="text-[10px] text-slate-400">(Optional)</span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">จากพอร์ต</span>
                  )}
                </div>
                <Input
                  placeholder="e.g. Somchai Jaidee / Angel Fund"
                  value={depositNameEn}
                  onChange={(e) => {
                    setDepositNameEn(e.target.value);
                    if (depositInvestorMode !== '__new__') {
                      setDepositInvestorMode('__new__');
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
            </div>

            {/* 3. Amount and Purpose */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">จำนวนเงินลงทุน (บาท)</Label>
              <Input
                type="number"
                min={100}
                step={500}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">หมายเหตุ / วัตถุประสงค์เงินลงทุน</Label>
              <Input
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            {/* Live Calculation Preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[11px]">
                ผลการคำนวณจำลองสัดส่วนหุ้นส่วน (Live Math Output):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">มูลค่า Post-Money:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ฿{depositSim.postMoney.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">หุ้นออกใหม่ (New Shares):</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    +{depositSim.newShares.toLocaleString()} หุ้น
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">สัดส่วนผู้ลงทุนในรอบนี้:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {depositSim.ownershipPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">อัตราเจือจางหุ้นเดิม (Dilution):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    -{depositSim.dilutionFactor}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDepositOpen(false)}
              className="border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleExecuteDeposit}
              disabled={syncing}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              บันทึกและซิงก์สู่ Firebase RTDB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: WITHDRAW / SHARE BUYBACK */}
      {/* ========================================================================= */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MinusCircle className="w-5 h-5 text-rose-500" />
              ถอนเงินทุนคืน / ลดสัดส่วนหุ้นส่วน (Withdrawal &amp; Liquidation)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              เลือกผู้ถือหุ้นที่มีอยู่ในพอร์ตลงทุนทั้งหมดเพื่อคำนวณเงินสดจ่ายคืนและยกเลิกหุ้น
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* 1. Dropdown for all portfolio shareholders */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ดรอปดาวน์เลือกผู้ถือหุ้นที่ต้องการถอนทุน (มีในพอร์ตลงทุนทั้งหมด)
                </Label>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                  {data.founders.filter(f => f.shares > 0).length} รายการ
                </span>
              </div>
              <div className="relative">
                <select
                  value={withdrawFounderId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWithdrawFounderId(val);
                    const found = data.founders.find(f => f.id === val);
                    if (found) {
                      setWithdrawShares(Math.min(1000, found.shares));
                    }
                  }}
                  className="w-full h-10 appearance-none rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 pr-9 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-sm transition-colors"
                >
                  {data.founders.filter(f => f.shares > 0).map((f) => (
                    <option key={f.id} value={f.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {f.nameTh} ({f.nameEn}) • ทุน ฿{f.investedAmount.toLocaleString()} ({f.shares.toLocaleString()} หุ้น - {f.percentage}%)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Selected Shareholder Status Card with Quick Preset Percentages */}
            {selectedWithdrawFounder && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedWithdrawFounder.nameTh} ({selectedWithdrawFounder.nameEn})
                  </span>
                  <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-500/30 bg-rose-500/10">
                    ถือครอง {selectedWithdrawFounder.percentage}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>เงินลงทุนเดิม: <strong className="text-slate-900 dark:text-slate-200 font-mono">฿{selectedWithdrawFounder.investedAmount.toLocaleString()}</strong></div>
                  <div>หุ้นที่มีอยู่: <strong className="text-slate-900 dark:text-slate-200 font-mono">{selectedWithdrawFounder.shares.toLocaleString()} หุ้น</strong></div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-500">เลือกด่วน:</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawShares(Math.max(1, Math.round(selectedWithdrawFounder.shares * 0.25)))}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawShares(Math.max(1, Math.round(selectedWithdrawFounder.shares * 0.5)))}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawShares(Math.max(1, Math.round(selectedWithdrawFounder.shares * 0.75)))}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawShares(selectedWithdrawFounder.shares)}
                    className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-medium hover:bg-rose-200 dark:hover:bg-rose-900 transition"
                  >
                    ทั้งหมด (100%)
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-700 dark:text-slate-300">จำนวนหุ้นที่ต้องการถอนออก</Label>
                {selectedWithdrawFounder && (
                  <span className="text-[10px] text-slate-500">
                    สูงสุด: {selectedWithdrawFounder.shares.toLocaleString()} หุ้น
                  </span>
                )}
              </div>
              <Input
                type="number"
                min={1}
                max={selectedWithdrawFounder ? selectedWithdrawFounder.shares : 10000}
                step={100}
                value={withdrawShares}
                onChange={(e) => setWithdrawShares(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">เหตุผลในการถอนทุน</Label>
              <Input
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            {/* Withdraw math preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-rose-300 dark:border-rose-500/30 space-y-2 text-xs">
              <span className="font-semibold text-rose-600 dark:text-rose-400 block text-[11px]">
                สรุปการจ่ายคืนเงินสดและผลกระทบต่อบริษัท (Withdrawal Summary):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">เงินสดที่ต้องจ่ายคืนผู้ถือหุ้น:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    ฿{withdrawSim.payoutAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">หุ้นคงเหลือของผู้ถือหุ้นนี้:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {withdrawSim.remainingFounderShares.toLocaleString()} หุ้น
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">หุ้นคงเหลือรวมทั้งบริษัท:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {withdrawSim.newTotalShares.toLocaleString()} หุ้น
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">กระแสเงินสดคงเหลือหลังจ่าย:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ฿{Math.max(0, data.cashBalance - withdrawSim.payoutAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setWithdrawOpen(false)}
              className="border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleExecuteWithdrawal}
              disabled={syncing}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              ยืนยันการถอนทุนสู่ Firebase RTDB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: ADD EXPENSE */}
      {/* ========================================================================= */}
      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              บันทึกค่าใช้จ่ายการวิจัยและพัฒนา D-MIND (Record Expense)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              บันทึกรายการใช้จ่ายเงินทุนเพื่ออัปเดตกระแสเงินสดคงเหลือแบบเรียลไทม์
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">ชื่อรายการค่าใช้จ่าย</Label>
              <Input
                placeholder="เช่น จัดซื้อแผงโซลาร์เซลล์ 30W หรือ ค่าซิม 4G"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300">หมวดหมู่ค่าใช้จ่าย</Label>
                <div className="relative">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full h-10 appearance-none rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 pr-9 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm transition-colors"
                  >
                    <option value="hardware" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">ฮาร์ดแวร์ &amp; Enclosure (กล่อง/สาย/โซลาร์)</option>
                    <option value="iot_cellular" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">ซิม 4G &amp; Telemetry (IoT Module)</option>
                    <option value="cloud_infrastructure" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">คลาวด์ &amp; เซิร์ฟเวอร์ (Cloud &amp; DB)</option>
                    <option value="patents_legal" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">สิทธิบัตร &amp; นิติกรรม (IP &amp; Legal)</option>
                    <option value="field_testing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">การทดสอบภาคสนาม (Field Testing)</option>
                    <option value="other" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">อื่นๆ (Miscellaneous)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300">จำนวนเงิน (บาท)</Label>
                <Input
                  type="number"
                  min={10}
                  step={50}
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">ผู้รับเงิน / ร้านค้า</Label>
              <Input
                placeholder="เช่น ร้านชิ้นส่วนอุตสาหกรรม หรือ ผู้ให้บริการโทรคมนาคม"
                value={expenseRecipient}
                onChange={(e) => setExpenseRecipient(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">หมายเหตุ / อ้างอิงใบเสร็จ</Label>
              <Input
                placeholder="เช่น ใบเสร็จเล่มที่ 01/2569 สำหรับทดสอบสถานีตรวจวัด"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setExpenseOpen(false)}
              className="border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleAddExpense}
              disabled={syncing}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              บันทึกรายจ่ายสู่ Firebase RTDB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
