import React, { useState, useMemo } from 'react';
import { groupNames } from '../data/formsData';
import { groupByFormGroup, getGroupDescription } from '../utils/filterUtils';

const GROUP_ORDER = ['A', 'B', 'C'];

const GROUP_COLORS = {
  A: { badge: '#4A9BAD', border: '#4A9BAD' },
  B: { badge: '#6ABDD4', border: '#6ABDD4' },
  C: { badge: '#E08050', border: '#E08050' },
};

const DataTable = ({
  forms,
  showWarning,
  checkedItems,
  autoCheckedForms,
  onCheckChange,
}) => {
  const [viewMode, setViewMode] = useState('checked');

  // Group forms by form_group
  const groupedForms = useMemo(() => groupByFormGroup(forms), [forms]);

  // Filter by view mode
  const getVisibleForms = (groupForms) => {
    return groupForms.filter((form) => {
      const isChecked = checkedItems[form.no] || false;
      if (viewMode === 'checked') return isChecked;
      if (viewMode === 'unchecked') return !isChecked;
      return true;
    });
  };

  // Count checked/unchecked
  const counts = useMemo(() => {
    let checked = 0;
    let unchecked = 0;
    forms.forEach((form) => {
      if (checkedItems[form.no]) checked++;
      else unchecked++;
    });
    return { checked, unchecked, total: forms.length };
  }, [forms, checkedItems]);

  const handleToggle = (formNo) => {
    const newState = !checkedItems[formNo];
    onCheckChange(formNo, newState);
  };

  const isAutoChecked = (formNo) => {
    return autoCheckedForms && autoCheckedForms[formNo];
  };

  // Update result counts in DOM
  React.useEffect(() => {
    const totalEl = document.getElementById('totalCount');
    const checkedEl = document.getElementById('checkedCount');
    if (totalEl) totalEl.textContent = counts.total;
    if (checkedEl) checkedEl.textContent = `選択：${counts.checked}件 / 未選択：${counts.unchecked}件`;
  }, [counts]);

  return (
    <div className="table-section">
      {/* Setting Mode Bar */}
      <div className="setting-mode-bar">
        <span className="setting-mode-label">設定モード</span>
        <span className="setting-mode-hint">チェックを変更して「保存」で確定</span>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <span className="table-toolbar-title">書類一覧</span>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'checked' ? 'active' : ''}`}
              onClick={() => setViewMode('checked')}
            >
              選択のみ ({counts.checked})
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'unchecked' ? 'active' : ''}`}
              onClick={() => setViewMode('unchecked')}
            >
              未選択のみ ({counts.unchecked})
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header">
        <div>No.</div>
        <div>必須</div>
        <div>様式番号</div>
        <div style={{ justifyContent: 'flex-start', paddingLeft: '14px' }}>書類名</div>
        <div>更新者</div>
        <div>更新日時</div>
      </div>

      {/* Table Body */}
      <div className="table-body">
        {/* Warning */}
        {showWarning && (
          <div className="filter-warning">
            在留資格を選択してください。現在すべての書類を表示しています。
          </div>
        )}

        {/* No Data */}
        {forms.length === 0 && (
          <div className="no-data">該当する書類がありません</div>
        )}

        {/* Forms grouped by form_group */}
        {GROUP_ORDER.map((group) => {
          const groupForms = groupedForms[group] || [];
          const visibleForms = getVisibleForms(groupForms);

          if (visibleForms.length === 0) return null;

          const colors = GROUP_COLORS[group];

          return (
            <React.Fragment key={group}>
              {/* Group Header */}
              <div className="layer-group-header" style={{ borderLeftColor: colors.border }}>
                <span className="layer-badge" style={{ backgroundColor: colors.badge }}>
                  {groupNames[group]}
                </span>
                <span>{getGroupDescription(group)}</span>
                <span className="layer-group-count">{visibleForms.length}件</span>
              </div>

              {/* Group Forms */}
              {visibleForms.map((form, idx) => {
                const isChecked = checkedItems[form.no] || false;
                const isAuto = isAutoChecked(form.no);
                const isManuallyAdded = isChecked && !isAuto;
                const isManuallyRemoved = !isChecked && isAuto;

                return (
                  <div
                    key={form.no}
                    className={`table-row ${!isChecked ? 'unchecked' : ''} ${isManuallyAdded ? 'manually-added' : ''} ${isManuallyRemoved ? 'manually-removed' : ''}`}
                  >
                    <div className="col-no">{idx + 1}</div>
                    <div className="col-required">
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(form.no)}
                        />
                        {isManuallyAdded && <span className="manual-badge add">+</span>}
                        {isManuallyRemoved && <span className="manual-badge remove">-</span>}
                      </div>
                    </div>
                    <div className="col-form-no">{form.form_no}</div>
                    <div className="col-form-name">{form.form_name}</div>
                    <div className="col-updater">田中 太郎</div>
                    <div className="col-updated">2024年01月15日</div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DataTable;
