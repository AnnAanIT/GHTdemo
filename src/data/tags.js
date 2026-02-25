// Tag definitions for conditional form filtering
// Tags are optional conditions that add conditional forms to the display

export const TAG_DEFINITIONS = {
  'org:hojin':            { group: 'org_type', label: '法人' },
  'org:kojin':            { group: 'org_type', label: '個人事業主' },
  'category:1':           { group: 'category', label: 'カテゴリー1' },
  'category:2':           { group: 'category', label: 'カテゴリー2' },
  'category:3':           { group: 'category', label: 'カテゴリー3' },
  'category:4':           { group: 'category', label: 'カテゴリー4' },
  'employment:direct':    { group: 'employment', label: '直接雇用' },
  'employment:dispatch':  { group: 'employment', label: '派遣' },
  'support_org':          { group: 'support', label: '登録支援機関に委託' },
};

export const TAG_GROUPS = {
  org_type:   { label: '所属機関種別', type: 'select', options: ['org:hojin', 'org:kojin'] },
  category:   { label: 'カテゴリー', type: 'select', options: ['category:1', 'category:2', 'category:3', 'category:4'] },
  employment: { label: '雇用形態', type: 'select', options: ['employment:direct', 'employment:dispatch'] },
  support:    { label: '支援委託', type: 'checkbox', options: ['support_org'] },
};
