import React, { useState, useMemo } from 'react';
import { layerNames } from '../data/formsData';
import { groupByLayer, getLayerDescription } from '../utils/filterUtils';

const DataTable = ({
  forms,
  showWarning,
  checkedItems,
  autoCheckedForms,
  onCheckChange,
  showAdditional,
  onToggleAdditional
}) => {
  const [viewMode, setViewMode] = useState('all'); // 'all', 'checked', 'unchecked'

  // Group forms by layer
  const groupedForms = useMemo(() => groupByLayer(forms), [forms]);

  // Filter by view mode
  const getVisibleForms = (layerForms) => {
    return layerForms.filter((form) => {
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
      if (checkedItems[form.no]) {
        checked++;
      } else {
        unchecked++;
      }
    });
    return { checked, unchecked, total: forms.length };
  }, [forms, checkedItems]);

  // Select all visible forms - now calls onCheckChange per form
  const handleSelectAll = () => {
    forms.forEach((form) => {
      if (viewMode === 'all' || (viewMode === 'unchecked' && !checkedItems[form.no])) {
        if (!checkedItems[form.no]) {
          onCheckChange(form.no, true);
        }
      }
    });
  };

  // Deselect all visible forms
  const handleDeselectAll = () => {
    forms.forEach((form) => {
      if (viewMode === 'all' || (viewMode === 'checked' && checkedItems[form.no])) {
        if (checkedItems[form.no]) {
          onCheckChange(form.no, false);
        }
      }
    });
  };

  // Toggle single checkbox - now passes formNo and new state
  const handleToggle = (formNo) => {
    const newState = !checkedItems[formNo];
    onCheckChange(formNo, newState);
  };

  // Check if form is auto-checked (from filter) vs manually added
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
              className={`view-toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              全て ({counts.total})
            </button>
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
        <div className="table-actions">
          <label className="additional-toggle">
            <input
              type="checkbox"
              checked={showAdditional}
              onChange={onToggleAdditional}
            />
            追加表示
          </label>
          <button className="btn-select-action check-all" onClick={handleSelectAll}>
            全選択
          </button>
          <button className="btn-select-action uncheck-all" onClick={handleDeselectAll}>
            全解除
          </button>
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

        {/* Forms grouped by layer */}
        {[1, 2, 3, 4].map((layer) => {
          const layerForms = groupedForms[layer] || [];
          const visibleForms = getVisibleForms(layerForms);

          if (visibleForms.length === 0) return null;

          return (
            <React.Fragment key={layer}>
              {/* Layer Header */}
              <div className={`layer-group-header l${layer}`}>
                <span className={`layer-badge l${layer}`}>{layerNames[layer]}</span>
                <span>{getLayerDescription(layer)}</span>
                <span className="layer-group-count">{visibleForms.length}件</span>
              </div>

              {/* Layer Forms */}
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
