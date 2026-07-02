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
  { no: 3005, form_no: '－', form_name: '派遣先の履歴事項全部証明書', annai_bunsho: '発行から3か月以内のもの', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3006, form_no: '－', form_name: '労働者派遣契約書の写し', annai_bunsho: '派遣元・派遣先間で締結した契約書', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3007, form_no: '－', form_name: '派遣先における作業内容及び作業場所を明らかにする書類', annai_bunsho: '具体的な作業内容・場所の説明資料', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3008, form_no: '－', form_name: '派遣先責任者の選任に関する届出書', annai_bunsho: '派遣先責任者の氏名・役職を明示', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3009, form_no: '－', form_name: '派遣先の労働条件通知書', annai_bunsho: '派遣先における就業条件の明示', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
  { no: 3010, form_no: '－', form_name: '派遣元と派遣先間の指揮命令系統を示す書類', annai_bunsho: '指揮命令者及び連絡体制の明示', form_group: 'A',
    visa: DISPATCH_VISA, appType: null, sector: DISPATCH_SECTORS, tags: ['employment:dispatch'] },
];
