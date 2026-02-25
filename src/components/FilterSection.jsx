import React, { useState } from 'react';
import { visaTypes, appTypes, sectors } from '../data/formsData';
import { TAG_DEFINITIONS, TAG_GROUPS } from '../data/tags';

const FilterSection = ({ filters, selectedTags, onFilterChange, onTagChange, onSearch }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { visa, appType, sector, searchText } = filters;

  const hasBasicInfo = visa && appType;
  const isTokutei = visa === 'tokutei1' || visa === 'tokutei2';
  const isGijinkoku = visa === 'gijinkoku';
  const isAgricultureOrFishery = sector === 'agriculture' || sector === 'fishery';

  // Handle visa change - reset everything
  const handleVisaChange = (value) => {
    onFilterChange({ visa: value, appType: '', sector: '', searchText: '' });
    onTagChange([]);
  };

  // Handle sector change - reset employment tag if not agriculture/fishery
  const handleSectorChange = (value) => {
    const newIsAgriFish = value === 'agriculture' || value === 'fishery';
    if (!newIsAgriFish) {
      const employmentTags = TAG_GROUPS.employment.options;
      const cleaned = selectedTags.filter(t => !employmentTags.includes(t));
      if (cleaned.length !== selectedTags.length) {
        onTagChange(cleaned);
      }
    }
    onFilterChange({ ...filters, sector: value });
  };

  // Toggle a tag
  const handleTagToggle = (tag) => {
    const def = TAG_DEFINITIONS[tag];
    if (!def) return;

    const group = TAG_GROUPS[def.group];
    if (!group) return;

    if (selectedTags.includes(tag)) {
      // Remove tag
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag — if exclusive group (select), remove other tags from same group first
      if (group.type === 'select') {
        const otherGroupTags = group.options.filter(t => t !== tag);
        const cleaned = selectedTags.filter(t => !otherGroupTags.includes(t));
        onTagChange([...cleaned, tag]);
      } else {
        onTagChange([...selectedTags, tag]);
      }
    }
  };

  // Set tag for select-type group
  const handleTagSelect = (groupKey, value) => {
    const group = TAG_GROUPS[groupKey];
    if (!group) return;

    // Remove all tags from this group
    const cleaned = selectedTags.filter(t => !group.options.includes(t));

    if (value) {
      onTagChange([...cleaned, value]);
    } else {
      onTagChange(cleaned);
    }
  };

  // Get current value for a select-type group
  const getGroupSelectValue = (groupKey) => {
    const group = TAG_GROUPS[groupKey];
    if (!group) return '';
    return selectedTags.find(t => group.options.includes(t)) || '';
  };

  // Get available categories (個人事業主 cannot select カテゴリー1)
  const getCategoryOptions = () => {
    const orgValue = getGroupSelectValue('org_type');
    if (orgValue === 'org:kojin') {
      return TAG_GROUPS.category.options.filter(t => t !== 'category:1');
    }
    return TAG_GROUPS.category.options;
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
            {/* Layer 1: 在留資格 + 申請種別 */}
            <div className="filter-layer layer-0">
              <span className="layer-number">1</span>
              <span className="layer-label">基本情報</span>
              <div className="filter-group">
                <span className="filter-label">在留資格</span>
                <div className="filter-select">
                  <select value={visa} onChange={(e) => handleVisaChange(e.target.value)}>
                    <option value="">-- 選択してください --</option>
                    {visaTypes.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-connector">+</span>
              <div className="filter-group">
                <span className="filter-label">申請種別</span>
                <div className="filter-select">
                  <select
                    value={appType}
                    onChange={(e) => onFilterChange({ ...filters, appType: e.target.value })}
                    disabled={!visa}
                  >
                    <option value="">-- 選択 --</option>
                    {appTypes.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="layer-status required">必須</span>
            </div>

            {/* Layer 2: 分野 (tokutei + basic info required) */}
            <div className={`filter-layer layer-1 ${!hasBasicInfo || !isTokutei ? 'disabled' : ''}`}>
              <span className="layer-number">2</span>
              <span className="layer-label">分野</span>
              <div className="filter-group">
                <div className="filter-select">
                  <select
                    value={sector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    disabled={!hasBasicInfo || !isTokutei}
                  >
                    <option value="">-- 選択してください --</option>
                    {sectors.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <span className={`layer-status ${!hasBasicInfo ? 'locked' : isTokutei ? 'required' : 'locked'}`}>
                {!hasBasicInfo ? '基本情報を選択' : isTokutei ? '必須' : '特定技能のみ'}
              </span>
            </div>

            {/* Tags Section (requires basic info) */}
            {hasBasicInfo && (
              <div className="filter-layer layer-2 tag-layer">
                <span className="layer-number">T</span>
                <span className="layer-label">条件</span>
                <div className="tag-controls">
                  {/* Org type select */}
                  <div className="tag-group-control">
                    <span className="tag-group-label">機関種別</span>
                    <select
                      value={getGroupSelectValue('org_type')}
                      onChange={(e) => handleTagSelect('org_type', e.target.value)}
                    >
                      <option value="">未定</option>
                      {TAG_GROUPS.org_type.options.map(tag => (
                        <option key={tag} value={tag}>{TAG_DEFINITIONS[tag].label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category select (gijinkoku only) */}
                  {isGijinkoku && (
                    <div className="tag-group-control">
                      <span className="tag-group-label">カテゴリー</span>
                      <select
                        value={getGroupSelectValue('category')}
                        onChange={(e) => handleTagSelect('category', e.target.value)}
                      >
                        <option value="">未定</option>
                        {getCategoryOptions().map(tag => (
                          <option key={tag} value={tag}>{TAG_DEFINITIONS[tag].label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 雇用形態 select (tokutei + agriculture/fishery only) */}
                  {isTokutei && isAgricultureOrFishery && (
                    <div className="tag-group-control">
                      <span className="tag-group-label">雇用形態</span>
                      <select
                        value={getGroupSelectValue('employment')}
                        onChange={(e) => handleTagSelect('employment', e.target.value)}
                      >
                        <option value="">未定</option>
                        {TAG_GROUPS.employment.options.map(tag => (
                          <option key={tag} value={tag}>{TAG_DEFINITIONS[tag].label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Support org checkbox (only for tokutei1) */}
                  {visa === 'tokutei1' && (
                    <div className="tag-group-control">
                      <label className="tag-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes('support_org')}
                          onChange={() => handleTagToggle('support_org')}
                        />
                        登録支援機関に委託
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              <button className="btn-search" onClick={onSearch}>検索</button>
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
