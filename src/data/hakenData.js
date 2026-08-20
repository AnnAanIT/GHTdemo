// 派遣先 — documents concerning the dispatch destination company
// Relevant only for 特定技能1号/2号 + 農業・漁業 + 派遣雇用形態
const DISPATCH_VISA = ['tokutei1', 'tokutei2'];
const DISPATCH_SECTORS = ['agriculture', 'fishery'];

export const hakenForms = [
  { no: 3001, form_no: '分野参考様式第11-2号', form_name: '派遣先事業者誓約書', annai_bunsho: '派遣先が欠格事由に該当しないことの誓約', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3002, form_no: '参考様式第1-12号', form_name: '派遣計画書', annai_bunsho: '派遣期間中の受入れ計画の詳細', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3003, form_no: '参考様式第1-14号', form_name: '派遣先の概要書（農業分野）', annai_bunsho: '農業分野の派遣先事業所の概要', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: ['agriculture'], tags: ['employment:dispatch'] },
  { no: 3004, form_no: '参考様式第1-15号', form_name: '派遣先の概要書（漁業分野）', annai_bunsho: '漁業分野の派遣先事業所の概要', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: ['fishery'], tags: ['employment:dispatch'] },
];
