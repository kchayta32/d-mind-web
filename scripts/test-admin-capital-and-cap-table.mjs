/**
 * TDD QE & Integration Test: Admin Capital Flow, Candlestick Trajectory,
 * Capital Expenditure Status, and Founding Cap Table Individual Remaining Shares.
 */

import {
  INITIAL_BUSINESS_DATA,
  getCandlestickData,
  getCapitalExpenditureStatus,
  getFoundersCapTableSummary
} from '../src/services/firebaseBusinessService.ts';

import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('================================================================');
console.log('  TDD VERIFICATION: CAPITAL EXPENSES & FOUNDING CAP TABLE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST SUITE 1: Dynamic Candlestick & Capital Flow Trajectory (Seam 1)
// -----------------------------------------------------------------------------
console.log('\n--- 1. Capital Flow & Valuation Trajectory Dynamic Generation ---');

try {
  const initialPoints = getCandlestickData(INITIAL_BUSINESS_DATA);
  assert(Array.isArray(initialPoints) && initialPoints.length >= 3, 'Returns initial historical points for founding members');
  
  const lastInitialPoint = initialPoints[initialPoints.length - 1];
  assert(lastInitialPoint.close === 3000, `Initial ending balance is 3000 (actual: ${lastInitialPoint.close})`);

  // Simulate adding an expense of 850 THB
  const mockWithExpense = {
    ...INITIAL_BUSINESS_DATA,
    cashBalance: 2150,
    expenses: [
      {
        id: 'exp-mock-01',
        date: '2569-10-14',
        title: 'จัดซื้อกล่อง Enclosure IP67',
        category: 'hardware',
        amount: 850,
        recipient: 'ร้านชิ้นส่วนอุตสาหกรรม',
        proofNote: 'ใบเสร็จเล่ม 1/69'
      }
    ],
    transactions: [
      {
        id: 'tx-exp-mock-01',
        date: '2569-10-14',
        type: 'expense',
        amount: 850,
        title: 'ค่าใช้จ่าย: จัดซื้อกล่อง Enclosure IP67',
        description: 'HARDWARE | ใบเสร็จเล่ม 1/69',
        investorOrParty: 'ร้านชิ้นส่วนอุตสาหกรรม',
        balanceAfter: 2150
      },
      ...INITIAL_BUSINESS_DATA.transactions
    ]
  };

  const dynamicPoints = getCandlestickData(mockWithExpense);
  const expensePoint = dynamicPoints.find(p => p.event && p.event.includes('Enclosure'));
  assert(Boolean(expensePoint), 'Candlestick trajectory dynamically includes the recorded expense event');
  if (expensePoint) {
    assert(expensePoint.close === 2150, `Expense point reflects deducted balance (expected 2150, got ${expensePoint.close})`);
    assert(expensePoint.volume === 850, `Expense point reflects expense volume (expected 850, got ${expensePoint.volume})`);
  }

  const latestPoint = dynamicPoints[dynamicPoints.length - 1];
  assert(latestPoint.close === 2150, `Latest trajectory point reflects net treasury of 2150 (got ${latestPoint.close})`);
} catch (err) {
  assert(false, `Candlestick generation threw an error: ${err.message}`);
}

// -----------------------------------------------------------------------------
// TEST SUITE 2: Capital Expenditure Status Calculation (Seam 2)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Capital Expenditure Status & Allocation Logic ---');

try {
  const initialStatus = getCapitalExpenditureStatus(INITIAL_BUSINESS_DATA);
  assert(initialStatus.totalExpenses === 0, 'Initial total expenses is 0 THB');
  assert(initialStatus.remainingCash === 3000, 'Initial remaining cash is 3000 THB');
  assert(initialStatus.utilizationRate === 0, 'Initial utilization rate is 0%');

  const activeExpenseData = {
    ...INITIAL_BUSINESS_DATA,
    cashBalance: 1650,
    expenses: [
      {
        id: 'exp-1',
        date: '2569-10-14',
        title: 'จัดซื้อกล่อง Enclosure IP67',
        category: 'hardware',
        amount: 850,
        recipient: 'ร้านชิ้นส่วนอุตสาหกรรม',
        proofNote: 'ใบเสร็จ'
      },
      {
        id: 'exp-2',
        date: '2569-10-15',
        title: 'ค่าซิม 4G IoT Telemetry รายปี',
        category: 'iot_cellular',
        amount: 500,
        recipient: 'ผู้ให้บริการมือถือ',
        proofNote: 'สลิปโอนเงิน'
      }
    ]
  };

  const expenseStatus = getCapitalExpenditureStatus(activeExpenseData);
  assert(expenseStatus.totalExpenses === 1350, `Total expenses calculated correctly (expected 1350, got ${expenseStatus.totalExpenses})`);
  assert(expenseStatus.remainingCash === 1650, `Remaining cash calculated correctly (expected 1650, got ${expenseStatus.remainingCash})`);
  assert(expenseStatus.categoryBreakdown.hardware === 850, 'Category breakdown allocates 850 to hardware');
  assert(expenseStatus.categoryBreakdown.iot_cellular === 500, 'Category breakdown allocates 500 to iot_cellular');
  assert(expenseStatus.utilizationRate === 45.0, `Utilization rate calculated correctly (expected 45%, got ${expenseStatus.utilizationRate}%)`);
} catch (err) {
  assert(false, `Capital status helper threw an error: ${err.message}`);
}

// -----------------------------------------------------------------------------
// TEST SUITE 3: Founding Cap Table Individual Remaining Shares (Seam 3)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Founding Cap Table Individual Remaining Shares ---');

try {
  const capSummary = getFoundersCapTableSummary(INITIAL_BUSINESS_DATA);
  assert(Array.isArray(capSummary) && capSummary.length === INITIAL_BUSINESS_DATA.founders.length, 'Cap summary returns all founders and mentors');

  const kitti = capSummary.find(f => f.id === 'founder-1');
  assert(Boolean(kitti), 'Founder Kitti is present in cap summary');
  if (kitti) {
    assert(kitti.remainingShares === 10000, `Founder Kitti has 10,000 remaining shares (got ${kitti.remainingShares})`);
    assert(kitti.percentage === 33.33, `Founder Kitti has 33.33% share ownership (got ${kitti.percentage}%)`);
    assert(kitti.netAssetValue === 1000, `Founder Kitti initial net asset value is 1,000 THB (got ${kitti.netAssetValue})`);
  }

  // With expenses: cashBalance reduced to 2,100
  const dataWithExpense = {
    ...INITIAL_BUSINESS_DATA,
    cashBalance: 2100
  };
  const capSummaryExpense = getFoundersCapTableSummary(dataWithExpense);
  const kittiExpense = capSummaryExpense.find(f => f.id === 'founder-1');
  if (kittiExpense) {
    assert(kittiExpense.remainingShares === 10000, 'Share count stays invariant under company expenses');
    assert(kittiExpense.netAssetValue === 700, `Net asset backing reflects expenses proportionally (expected 700, got ${kittiExpense.netAssetValue})`);
  }

  // With withdrawal of shares: founder-2 sells 2,000 shares
  const dataWithWithdraw = {
    ...INITIAL_BUSINESS_DATA,
    totalShares: 28000,
    cashBalance: 2800,
    founders: INITIAL_BUSINESS_DATA.founders.map(f => f.id === 'founder-2' ? { ...f, shares: 8000, percentage: 28.57 } : f)
  };
  const capSummaryWithdraw = getFoundersCapTableSummary(dataWithWithdraw);
  const founder2 = capSummaryWithdraw.find(f => f.id === 'founder-2');
  if (founder2) {
    assert(founder2.remainingShares === 8000, `Remaining shares reflects withdrawal (expected 8000, got ${founder2.remainingShares})`);
  }
} catch (err) {
  assert(false, `Cap table summary helper threw an error: ${err.message}`);
}

// -----------------------------------------------------------------------------
// TEST SUITE 4: UI Code Integrity & Anti-Hardcoding Checks (Seam 4)
// -----------------------------------------------------------------------------
console.log('\n--- 4. UI Code & Dynamic Layout Verification ---');

const pageFilePath = resolve('src/pages/AdminBusinessPage.tsx');
const pageContent = readFileSync(pageFilePath, 'utf-8');

assert(pageContent.includes('หุ้นคงเหลือปัจจุบัน'), 'Cap Table UI contains "หุ้นคงเหลือปัจจุบัน" header or badge');
assert(!pageContent.includes('domain={[0, 4000]}'), 'Chart YAxis does NOT have hardcoded domain [0, 4000]');
assert(!pageContent.includes('ยังไม่มีรายจ่ายเกิดขึ้น (0 บาท): เงินทุนทั้งหมด 3,000 บาท ยังคงอยู่ในกระเป๋าเงินสดคงเหลือครบ 100%'), 'Static hardcoded expense text replaced by dynamic status');

console.log('\n================================================================');
console.log(`  SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
