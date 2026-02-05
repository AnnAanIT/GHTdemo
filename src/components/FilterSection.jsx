import React, { useState } from 'react';
import {
  visaTypes,
  appTypes,
  orgTypes,
  categories,
  sectors,
  employmentTypes,
} from '../data/formsData';

const FilterSection = ({ filters, onFilterChange, onSearch }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { visa, appType, org, category, sector, employment, searchText } = filters;

  const isTokutei = visa === 'tokutei1' || visa === 'tokutei2';
  const isAgricultureOrFishery = sector === 'agriculture' || sector === 'fishery';

  // Layer enabled states
  const layer1Enabled = !!visa;
  const layer2Enabled = !!visa;
  const layer3Enabled = isTokutei;
  const layer4Enabled = isTokutei && isAgricultureOrFishery;

  // Handle visa change - reset all children
  const handleVisaChange = (value) => {
    onFilterChange({
      visa: value,
      appType: '',
      org: '',
      category: '',
      sector: '',
      employment: '',
    });
  };

  // Handle sector change - reset employment
  const handleSectorChange = (value) => {
    onFilterChange({
      ...filters,
      sector: value,
      employment: '',
    });
  };

  // Get available categories (個人事業主 cannot select カテゴリー1)
  const getAvailableCategories = () => {
    if (org === 'kojin') {
      return categories.filter(c => c.value !== '1');
    }
    return categories;
  };

  return (
    <div className="filter-section">
      <div
        className={`section-title ${collapsed ? 'collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        絞り込み条件
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#888' }}>
          {collapsed ? 'クリックで展開' : 'クリックで折りたたむ'}
        </span>
      </div>

      {!collapsed && (
        <div className="filter-content">
          <div className="filter-layers">
            {/* Layer 0: 在留資格 */}
            <div className="filter-layer layer-0">
              <span className="layer-number">0</span>
              <span className="layer-label">在留資格</span>
              <div className="filter-group">
                <div className="filter-select">
                  <select
                    value={visa}
                    onChange={(e) => handleVisaChange(e.target.value)}
                  >
                    <option value="">-- 選択してください --</option>
                    {visaTypes.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-status required">必須</span>
            </div>

            {/* Layer 1: 申請種別 */}
            <div className={`filter-layer layer-1 ${!layer1Enabled ? 'disabled' : ''}`}>
              <span className="layer-number">1</span>
              <span className="layer-label">申請種別</span>
              <div className="filter-group">
                <div className="filter-select">
                  <select
                    value={appType}
                    onChange={(e) => onFilterChange({ ...filters, appType: e.target.value })}
                    disabled={!layer1Enabled}
                  >
                    <option value="">-- 選択 --</option>
                    {appTypes.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-status required">必須</span>
            </div>

            {/* Layer 2: 機関情報 */}
            <div className={`filter-layer layer-2 ${!layer2Enabled ? 'disabled' : ''}`}>
              <span className="layer-number">2</span>
              <span className="layer-label">機関情報</span>
              <div className="filter-group">
                <span className="filter-label">受入機関</span>
                <div className="filter-select">
                  <select
                    value={org}
                    onChange={(e) => {
                      const newOrg = e.target.value;
                      // Reset category if switching to kojin and cat1 was selected
                      let newCategory = category;
                      if (newOrg === 'kojin' && category === '1') {
                        newCategory = '';
                      }
                      onFilterChange({ ...filters, org: newOrg, category: newCategory });
                    }}
                    disabled={!layer2Enabled}
                  >
                    <option value="">-- 選択 --</option>
                    {orgTypes.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-connector">+</span>
              <div className="filter-group">
                <span className="filter-label">カテゴリー</span>
                <div className="filter-select">
                  <select
                    value={category}
                    onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                    disabled={!layer2Enabled}
                  >
                    <option value="">-- 選択 --</option>
                    {getAvailableCategories().map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-status required">必須</span>
            </div>

            {/* Layer 3: 分野 */}
            <div className={`filter-layer layer-3 ${!layer3Enabled ? 'disabled' : ''}`}>
              <span className="layer-number">3</span>
              <span className="layer-label">分野</span>
              <div className="filter-group">
                <div className="filter-select">
                  <select
                    value={sector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    disabled={!layer3Enabled}
                  >
                    <option value="">-- 選択してください --</option>
                    {sectors.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className={`layer-status ${layer3Enabled ? 'required' : 'locked'}`}>
                {layer3Enabled ? '必須' : '特定技能のみ'}
              </span>
            </div>

            {/* Layer 4: 雇用形態 */}
            <div className={`filter-layer layer-4 ${!layer4Enabled ? 'disabled' : ''}`}>
              <span className="layer-number">4</span>
              <span className="layer-label">雇用形態</span>
              <div className="filter-group">
                <div className="filter-select">
                  <select
                    value={employment}
                    onChange={(e) => onFilterChange({ ...filters, employment: e.target.value })}
                    disabled={!layer4Enabled}
                  >
                    <option value="">-- 選択してください --</option>
                    {employmentTypes.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className={`layer-status ${layer4Enabled ? 'required' : 'locked'}`}>
                {layer4Enabled ? '必須' : '農業・漁業のみ'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="action-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="様式名で検索..."
                value={searchText}
                onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
                onKeyUp={(e) => e.key === 'Enter' && onSearch()}
              />
              <button className="btn-search" onClick={onSearch}>
                検索
              </button>
            </div>
            <div className="result-info">
              <div className="result-count">
                該当：<strong id="totalCount">0</strong> 件
              </div>
              <div className="result-detail" id="checkedCount">
                選択：0件 / 未選択：0件
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
