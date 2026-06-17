import { create } from 'zustand'

export interface Drawing {
  id: string
  name: string
  customer: string
  format: 'DXF' | 'PDF' | 'DWG'
  status: 'pending' | 'parsing' | 'parsed' | 'in-production' | 'completed'
  uploadTime: string
  fileSize: number
  partCount: number
  thumbnailUrl: string
  remark?: string
}

export interface NestingPart {
  name: string
  quantity: number
  color: string
}

export interface NestingPlan {
  id: string
  name: string
  drawingIds: string[]
  sheetSpec: string
  sheetSize: { width: number; height: number }
  utilizationRate: number
  partCount: number
  status: 'draft' | 'confirmed' | 'cutting' | 'completed'
  createdAt: string
  parts: NestingPart[]
}

export interface SheetMaterial {
  id: string
  spec: string
  material: string
  thickness: number
  size: { width: number; height: number }
  stock: number
  unit: string
  isRemnant: boolean
  sourceId?: string
}

export interface CuttingParams {
  id: string
  materialType: string
  thickness: number
  gasPressure: number
  focusPosition: number
  speed: number
  power: number
}

export interface CuttingRecord {
  id: string
  planId: string
  planName: string
  operator: string
  startTime: string
  endTime: string
  avgSpeed: number
  gasPressure: number
  focusPosition: number
  status: 'running' | 'completed' | 'error'
}

export interface PartSortItem {
  id: string
  drawingId: string
  partName: string
  quantity: number
  sortedCount: number
  status: 'pending' | 'sorting' | 'completed'
  location: string
  locationCode: string
  batchNo: string
  planName: string
}

export interface BurrInspection {
  id: string
  partId: string
  partName: string
  inspector: string
  inspectTime: string
  burrLevel: 'none' | 'slight' | 'moderate' | 'severe'
  sectionQuality: 'excellent' | 'good' | 'acceptable' | 'poor'
  result: 'pass' | 'fail'
  remark: string
}

export interface BillingRecord {
  id: string
  workerId: string
  workerName: string
  processType: string
  partCount: number
  unitPrice: number
  totalAmount: number
  workHours: number
  date: string
  status: 'pending' | 'confirmed' | 'settled'
}

export interface Device {
  id: string
  name: string
  status: '运行中' | '待机' | '维护'
}

export interface TodoItem {
  id: string
  icon: string
  text: string
  priority: 'high' | 'medium' | 'low'
  checked: boolean
}

export type DrawingStatus = Drawing['status']
export type DrawingFormat = Drawing['format']

interface StoreState {
  drawings: Drawing[]
  nestingPlans: NestingPlan[]
  sheetMaterials: SheetMaterial[]
  cuttingParams: CuttingParams[]
  cuttingRecords: CuttingRecord[]
  partSortItems: PartSortItem[]
  burrInspections: BurrInspection[]
  billingRecords: BillingRecord[]
  devices: Device[]
  todos: TodoItem[]
  addDrawing: (drawing: Drawing) => void
  updateDrawingStatus: (id: string, status: Drawing['status']) => void
  deleteDrawing: (id: string) => void
  addNestingPlan: (plan: NestingPlan) => void
  updateNestingPlanStatus: (id: string, status: NestingPlan['status']) => void
  findNestingPlan: (id: string) => NestingPlan | undefined
  addSheetMaterial: (material: SheetMaterial) => void
  updateSheetStock: (id: string, stock: number) => void
  addCuttingParam: (params: CuttingParams) => void
  updateCuttingParam: (id: string, updates: Partial<Omit<CuttingParams, 'id'>>) => void
  addCuttingRecord: (record: CuttingRecord) => void
  updateCuttingRecordStatus: (id: string, status: CuttingRecord['status']) => void
  updatePartSortStatus: (id: string, status: PartSortItem['status'], sortedCount?: number) => void
  incrementSortedCount: (id: string) => void
  addBurrInspection: (inspection: Omit<BurrInspection, 'id' | 'time' | 'inspectTime' | 'partId'>) => void
  addBillingRecord: (record: BillingRecord) => void
  updateBillingStatus: (id: string, status: BillingRecord['status']) => void
  settleAllConfirmed: () => void
  toggleTodo: (id: string) => void
}

const mockDrawings: Drawing[] = [
  { id: 'DW001', name: '支架组件A', customer: '张伟机械', format: 'DXF', status: 'completed', uploadTime: '2025-06-01 09:15', fileSize: 2457600, partCount: 12, thumbnailUrl: '/thumbnails/dw001.png' },
  { id: 'DW002', name: '法兰盘B型', customer: '李达钢材', format: 'PDF', status: 'parsed', uploadTime: '2025-06-03 14:22', fileSize: 1835008, partCount: 8, thumbnailUrl: '/thumbnails/dw002.png' },
  { id: 'DW003', name: '连接板C', customer: '王芳精密', format: 'DWG', status: 'in-production', uploadTime: '2025-06-05 10:08', fileSize: 3145728, partCount: 20, thumbnailUrl: '/thumbnails/dw003.png' },
  { id: 'DW004', name: '底座零件D', customer: '赵磊重工', format: 'DXF', status: 'parsing', uploadTime: '2025-06-10 16:30', fileSize: 1572864, partCount: 5, thumbnailUrl: '/thumbnails/dw004.png' },
  { id: 'DW005', name: '加强筋E', customer: '陈静制造', format: 'DXF', status: 'pending', uploadTime: '2025-06-12 08:45', fileSize: 2097152, partCount: 15, thumbnailUrl: '/thumbnails/dw005.png' },
  { id: 'DW006', name: '定位块F', customer: '刘洋科技', format: 'PDF', status: 'completed', uploadTime: '2025-06-14 11:20', fileSize: 1048576, partCount: 6, thumbnailUrl: '/thumbnails/dw006.png' },
  { id: 'DW007', name: '护罩组件G', customer: '孙丽工贸', format: 'DWG', status: 'parsed', uploadTime: '2025-06-15 13:55', fileSize: 2621440, partCount: 10, thumbnailUrl: '/thumbnails/dw007.png' },
  { id: 'DW008', name: '转接板H', customer: '周杰模具', format: 'DXF', status: 'in-production', uploadTime: '2025-06-17 09:10', fileSize: 1363148, partCount: 9, thumbnailUrl: '/thumbnails/dw008.png' },
]

const mockNestingPlans: NestingPlan[] = [
  { id: 'NP001', name: '支架排版方案一', drawingIds: ['DW001', 'DW005'], sheetSpec: 'Q235B-6mm', sheetSize: { width: 1500, height: 3000 }, utilizationRate: 82.5, partCount: 27, status: 'completed', createdAt: '2025-06-02 10:00', parts: [{ name: '支架底板', quantity: 12, color: '#FF6B35' }, { name: '加强筋片', quantity: 15, color: '#4299E1' }] },
  { id: 'NP002', name: '法兰盘排版方案', drawingIds: ['DW002'], sheetSpec: '304不锈钢-4mm', sheetSize: { width: 1220, height: 2440 }, utilizationRate: 76.3, partCount: 8, status: 'confirmed', createdAt: '2025-06-04 14:30', parts: [{ name: '法兰盘本体', quantity: 8, color: '#48BB78' }] },
  { id: 'NP003', name: '连接板混合排版', drawingIds: ['DW003', 'DW008'], sheetSpec: 'Q345R-8mm', sheetSize: { width: 1500, height: 6000 }, utilizationRate: 88.1, partCount: 29, status: 'cutting', createdAt: '2025-06-06 09:15', parts: [{ name: '连接板主件', quantity: 20, color: '#FF6B35' }, { name: '转接板', quantity: 9, color: '#ECC94B' }] },
  { id: 'NP004', name: '底座零件排版', drawingIds: ['DW004'], sheetSpec: 'Q235B-10mm', sheetSize: { width: 2000, height: 6000 }, utilizationRate: 71.2, partCount: 5, status: 'draft', createdAt: '2025-06-11 16:00', parts: [{ name: '底座零件', quantity: 5, color: '#00D4FF' }] },
  { id: 'NP005', name: '定位块护罩混合排版', drawingIds: ['DW006', 'DW007'], sheetSpec: '45号钢-5mm', sheetSize: { width: 1220, height: 2440 }, utilizationRate: 79.8, partCount: 16, status: 'confirmed', createdAt: '2025-06-15 11:30', parts: [{ name: '定位块', quantity: 6, color: '#FF6B35' }, { name: '护罩侧板', quantity: 10, color: '#4299E1' }] },
  { id: 'NP006', name: '加强筋排版方案', drawingIds: ['DW005'], sheetSpec: 'Q345B-6mm', sheetSize: { width: 1500, height: 3000 }, utilizationRate: 85.0, partCount: 15, status: 'cutting', createdAt: '2025-06-16 08:45', parts: [{ name: '加强筋片', quantity: 15, color: '#48BB78' }] },
]

const mockSheetMaterials: SheetMaterial[] = [
  { id: 'SM001', spec: 'Q235B-6×1500×3000', material: 'Q235B', thickness: 6, size: { width: 1500, height: 3000 }, stock: 45, unit: '张', isRemnant: false },
  { id: 'SM002', spec: '304不锈钢-4×1220×2440', material: '304不锈钢', thickness: 4, size: { width: 1220, height: 2440 }, stock: 28, unit: '张', isRemnant: false },
  { id: 'SM003', spec: 'Q345R-8×1500×6000', material: 'Q345R', thickness: 8, size: { width: 1500, height: 6000 }, stock: 12, unit: '张', isRemnant: false },
  { id: 'SM004', spec: 'Q235B-10×2000×6000', material: 'Q235B', thickness: 10, size: { width: 2000, height: 6000 }, stock: 8, unit: '张', isRemnant: false },
  { id: 'SM005', spec: '45号钢-5×1220×2440', material: '45号钢', thickness: 5, size: { width: 1220, height: 2440 }, stock: 35, unit: '张', isRemnant: false },
  { id: 'SM006', spec: 'Q235B余料-3×800×1200', material: 'Q235B', thickness: 3, size: { width: 800, height: 1200 }, stock: 15, unit: '张', isRemnant: true, sourceId: 'SM001' },
  { id: 'SM007', spec: 'Q345B-6×1500×3000', material: 'Q345B', thickness: 6, size: { width: 1500, height: 3000 }, stock: 22, unit: '张', isRemnant: false },
  { id: 'SM008', spec: '304不锈钢余料-2×600×1000', material: '304不锈钢', thickness: 2, size: { width: 600, height: 1000 }, stock: 9, unit: '张', isRemnant: true, sourceId: 'SM002' },
]

const mockCuttingParams: CuttingParams[] = [
  { id: 'CP001', materialType: '碳钢', thickness: 6, gasPressure: 0.5, focusPosition: -2, speed: 2800, power: 3000 },
  { id: 'CP002', materialType: '不锈钢', thickness: 4, gasPressure: 0.8, focusPosition: -1, speed: 2200, power: 3500 },
  { id: 'CP003', materialType: '碳钢', thickness: 8, gasPressure: 0.6, focusPosition: -3, speed: 1800, power: 4000 },
  { id: 'CP004', materialType: '碳钢', thickness: 10, gasPressure: 0.55, focusPosition: -4, speed: 1200, power: 5000 },
  { id: 'CP005', materialType: '碳钢', thickness: 5, gasPressure: 0.5, focusPosition: -2, speed: 2500, power: 3200 },
  { id: 'CP006', materialType: '碳钢', thickness: 6, gasPressure: 0.55, focusPosition: -2, speed: 2600, power: 3200 },
  { id: 'CP007', materialType: '不锈钢', thickness: 2, gasPressure: 0.7, focusPosition: 0, speed: 4000, power: 2500 },
  { id: 'CP008', materialType: '碳钢', thickness: 3, gasPressure: 0.45, focusPosition: -1, speed: 3500, power: 2500 },
]

const mockCuttingRecords: CuttingRecord[] = [
  { id: 'CR001', planId: 'NP001', planName: '支架排版方案一', operator: '王建国', startTime: '2025-06-02 11:00', endTime: '2025-06-02 14:30', avgSpeed: 2750, gasPressure: 0.5, focusPosition: -2, status: 'completed' },
  { id: 'CR002', planId: 'NP003', planName: '连接板混合排版', operator: '李明辉', startTime: '2025-06-07 08:00', endTime: '2025-06-07 16:20', avgSpeed: 1750, gasPressure: 0.6, focusPosition: -3, status: 'completed' },
  { id: 'CR003', planId: 'NP003', planName: '连接板混合排版', operator: '李明辉', startTime: '2025-06-08 08:00', endTime: '', avgSpeed: 1800, gasPressure: 0.6, focusPosition: -3, status: 'running' },
  { id: 'CR004', planId: 'NP002', planName: '法兰盘排版方案', operator: '张志强', startTime: '2025-06-05 13:00', endTime: '2025-06-05 15:10', avgSpeed: 2150, gasPressure: 0.8, focusPosition: -1, status: 'completed' },
  { id: 'CR005', planId: 'NP006', planName: '加强筋排版方案', operator: '赵海军', startTime: '2025-06-17 09:30', endTime: '', avgSpeed: 2550, gasPressure: 0.55, focusPosition: -2, status: 'running' },
  { id: 'CR006', planId: 'NP005', planName: '定位块护罩混合排版', operator: '王建国', startTime: '2025-06-16 10:00', endTime: '2025-06-16 13:45', avgSpeed: 2450, gasPressure: 0.5, focusPosition: -2, status: 'completed' },
  { id: 'CR007', planId: 'NP001', planName: '支架排版方案一', operator: '张志强', startTime: '2025-06-03 08:30', endTime: '2025-06-03 09:15', avgSpeed: 0, gasPressure: 0.5, focusPosition: -2, status: 'error' },
]

const mockPartSortItems: PartSortItem[] = [
  { id: 'PS001', drawingId: 'DW001', partName: 'L型支架', quantity: 24, sortedCount: 24, status: 'completed', location: 'A区-01货架', locationCode: 'A-01', batchNo: 'B20250602-01', planName: '支架排版方案一' },
  { id: 'PS002', drawingId: 'DW001', partName: 'U型卡扣', quantity: 48, sortedCount: 30, status: 'sorting', location: 'A区-02货架', locationCode: 'A-02', batchNo: 'B20250602-02', planName: '支架排版方案一' },
  { id: 'PS003', drawingId: 'DW002', partName: '法兰盘本体', quantity: 16, sortedCount: 0, status: 'pending', location: 'B区-01货架', locationCode: 'B-01', batchNo: 'B20250605-01', planName: '法兰盘排版方案' },
  { id: 'PS004', drawingId: 'DW003', partName: '连接板主件', quantity: 20, sortedCount: 12, status: 'sorting', location: 'C区-03货架', locationCode: 'C-03', batchNo: 'B20250607-01', planName: '连接板混合排版' },
  { id: 'PS005', drawingId: 'DW005', partName: '加强筋片', quantity: 60, sortedCount: 60, status: 'completed', location: 'A区-05货架', locationCode: 'A-05', batchNo: 'B20250617-01', planName: '加强筋排版方案' },
  { id: 'PS006', drawingId: 'DW006', partName: '定位块', quantity: 12, sortedCount: 12, status: 'completed', location: 'B区-02货架', locationCode: 'B-02', batchNo: 'B20250616-01', planName: '定位块护罩混合排版' },
  { id: 'PS007', drawingId: 'DW007', partName: '护罩侧板', quantity: 20, sortedCount: 0, status: 'pending', location: 'C区-01货架', locationCode: 'C-01', batchNo: 'B20250618-01', planName: '定位块护罩混合排版' },
  { id: 'PS008', drawingId: 'DW008', partName: '转接板', quantity: 18, sortedCount: 8, status: 'sorting', location: 'C区-02货架', locationCode: 'C-02', batchNo: 'B20250618-02', planName: '连接板混合排版' },
]

const mockBurrInspections: BurrInspection[] = [
  { id: 'BI001', partId: 'PS001', partName: 'L型支架', inspector: '钱晓明', inspectTime: '2025-06-02 15:00', burrLevel: 'none', sectionQuality: 'excellent', result: 'pass', remark: '' },
  { id: 'BI002', partId: 'PS002', partName: 'U型卡扣', inspector: '钱晓明', inspectTime: '2025-06-03 10:20', burrLevel: 'slight', sectionQuality: 'good', result: 'pass', remark: '边缘轻微毛刺，可接受' },
  { id: 'BI003', partId: 'PS004', partName: '连接板主件', inspector: '吴美华', inspectTime: '2025-06-08 14:00', burrLevel: 'moderate', sectionQuality: 'acceptable', result: 'pass', remark: '需二次打磨' },
  { id: 'BI004', partId: 'PS005', partName: '加强筋片', inspector: '吴美华', inspectTime: '2025-06-17 16:30', burrLevel: 'none', sectionQuality: 'excellent', result: 'pass', remark: '' },
  { id: 'BI005', partId: 'PS003', partName: '法兰盘本体', inspector: '钱晓明', inspectTime: '2025-06-06 09:00', burrLevel: 'severe', sectionQuality: 'poor', result: 'fail', remark: '切缝粗糙，毛刺严重，需返工' },
  { id: 'BI006', partId: 'PS006', partName: '定位块', inspector: '吴美华', inspectTime: '2025-06-16 15:00', burrLevel: 'slight', sectionQuality: 'good', result: 'pass', remark: '整体质量良好' },
  { id: 'BI007', partId: 'PS008', partName: '转接板', inspector: '钱晓明', inspectTime: '2025-06-18 10:30', burrLevel: 'moderate', sectionQuality: 'acceptable', result: 'pass', remark: '个别孔位有毛刺' },
]

const mockBillingRecords: BillingRecord[] = [
  { id: 'BL001', workerId: 'W001', workerName: '王建国', processType: '激光切割', partCount: 27, unitPrice: 2.5, totalAmount: 67.5, workHours: 4.0, date: '2025-06-02', status: 'settled' },
  { id: 'BL002', workerId: 'W002', workerName: '李明辉', processType: '激光切割', partCount: 29, unitPrice: 2.5, totalAmount: 72.5, workHours: 8.5, date: '2025-06-07', status: 'settled' },
  { id: 'BL003', workerId: 'W003', workerName: '张志强', processType: '激光切割', partCount: 8, unitPrice: 2.5, totalAmount: 20.0, workHours: 2.5, date: '2025-06-05', status: 'confirmed' },
  { id: 'BL004', workerId: 'W004', workerName: '赵海军', processType: '激光切割', partCount: 15, unitPrice: 2.5, totalAmount: 37.5, workHours: 4.0, date: '2025-06-17', status: 'pending' },
  { id: 'BL005', workerId: 'W005', workerName: '钱晓明', processType: '毛刺检验', partCount: 72, unitPrice: 0.5, totalAmount: 36.0, workHours: 6.0, date: '2025-06-08', status: 'confirmed' },
  { id: 'BL006', workerId: 'W006', workerName: '吴美华', processType: '毛刺检验', partCount: 48, unitPrice: 0.5, totalAmount: 24.0, workHours: 4.0, date: '2025-06-17', status: 'pending' },
  { id: 'BL007', workerId: 'W001', workerName: '王建国', processType: '零件分拣', partCount: 54, unitPrice: 1.0, totalAmount: 54.0, workHours: 5.0, date: '2025-06-02', status: 'settled' },
  { id: 'BL008', workerId: 'W003', workerName: '张志强', processType: '激光切割', partCount: 16, unitPrice: 2.5, totalAmount: 40.0, workHours: 3.5, date: '2025-06-16', status: 'pending' },
]

const mockDevices: Device[] = [
  { id: '1', name: '1号激光切割机', status: '运行中' },
  { id: '2', name: '2号激光切割机', status: '待机' },
  { id: '3', name: '3号激光切割机', status: '维护' },
]

const mockTodos: TodoItem[] = [
  { id: '1', icon: 'FileText', text: '审核新上传的支架组件图纸', priority: 'high', checked: false },
  { id: '2', icon: 'Grid3X3', text: '完成法兰盘排版方案', priority: 'high', checked: false },
  { id: '3', icon: 'Wrench', text: '安排3号切割机维护检修', priority: 'medium', checked: false },
  { id: '4', icon: 'PackageSearch', text: '分拣已完成的外壳零件', priority: 'medium', checked: false },
  { id: '5', icon: 'ClipboardList', text: '准备鑫达制造发货清单', priority: 'low', checked: false },
]

export const useStore = create<StoreState>((set, get) => ({
  drawings: mockDrawings,
  nestingPlans: mockNestingPlans,
  sheetMaterials: mockSheetMaterials,
  cuttingParams: mockCuttingParams,
  cuttingRecords: mockCuttingRecords,
  partSortItems: mockPartSortItems,
  burrInspections: mockBurrInspections,
  billingRecords: mockBillingRecords,
  devices: mockDevices,
  todos: mockTodos,
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  updateDrawingStatus: (id, status) => set((state) => ({
    drawings: state.drawings.map((d) => (d.id === id ? { ...d, status } : d)),
  })),
  deleteDrawing: (id) => set((state) => ({
    drawings: state.drawings.filter((d) => d.id !== id),
  })),
  addNestingPlan: (plan) => set((state) => ({ nestingPlans: [...state.nestingPlans, plan] })),
  updateNestingPlanStatus: (id, status) => set((state) => ({
    nestingPlans: state.nestingPlans.map((p) => (p.id === id ? { ...p, status } : p)),
  })),
  findNestingPlan: (id) => get().nestingPlans.find((p) => p.id === id),
  addSheetMaterial: (material) => set((state) => ({ sheetMaterials: [...state.sheetMaterials, material] })),
  updateSheetStock: (id, stock) => set((state) => ({
    sheetMaterials: state.sheetMaterials.map((m) => (m.id === id ? { ...m, stock } : m)),
  })),
  addCuttingParam: (params) => set((state) => ({ cuttingParams: [...state.cuttingParams, params] })),
  updateCuttingParam: (id, updates) => set((state) => ({
    cuttingParams: state.cuttingParams.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  addCuttingRecord: (record) => set((state) => ({ cuttingRecords: [...state.cuttingRecords, record] })),
  updateCuttingRecordStatus: (id, status) => set((state) => ({
    cuttingRecords: state.cuttingRecords.map((r) => (r.id === id ? { ...r, status } : r)),
  })),
  updatePartSortStatus: (id, status, sortedCount) => set((state) => ({
    partSortItems: state.partSortItems.map((p) =>
      p.id === id ? { ...p, status, ...(sortedCount !== undefined ? { sortedCount } : {}) } : p
    ),
  })),
  incrementSortedCount: (id) => set((state) => ({
    partSortItems: state.partSortItems.map((p) => {
      if (p.id !== id) return p
      const newCount = Math.min(p.sortedCount + 1, p.quantity)
      const newStatus: PartSortItem['status'] = newCount >= p.quantity ? 'completed' : newCount > 0 ? 'sorting' : 'pending'
      return { ...p, sortedCount: newCount, status: newStatus }
    }),
  })),
  addBurrInspection: (inspection) => set((state) => {
    const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
    return { burrInspections: [{ ...inspection, id: `BI${Date.now()}`, partId: '', inspectTime: now }, ...state.burrInspections] }
  }),
  addBillingRecord: (record) => set((state) => ({ billingRecords: [...state.billingRecords, record] })),
  updateBillingStatus: (id, status) => set((state) => ({
    billingRecords: state.billingRecords.map((b) => (b.id === id ? { ...b, status } : b)),
  })),
  settleAllConfirmed: () => set((state) => ({
    billingRecords: state.billingRecords.map((b) =>
      b.status === 'confirmed' ? { ...b, status: 'settled' as const } : b
    ),
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)),
  })),
}))
