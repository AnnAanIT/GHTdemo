import React, { useState, useMemo, useRef } from 'react';
import { groupNames } from '../data/formsData';
import { groupByFormGroup, getGroupDescription } from '../utils/filterUtils';

const GROUP_ORDER = ['A', 'B', 'C'];

const GROUP_COLORS = {
  A: { badge: '#4A9BAD', border: '#4A9BAD' },
  B: { badge: '#6ABDD4', border: '#6ABDD4' },
  C: { badge: '#E08050', border: '#E08050' },
};

const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconFileCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <polyline points="9 15 11 17 15 13"/>
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const UploadCell = ({ formNo, uploadedFiles, onFileChange }) => {
  const inputRef = useRef(null);
  const file = uploadedFiles[formNo];

  return (
    <div className="col-sample-file">
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onFileChange(formNo, f);
        }}
      />
      {file ? (
        <button
          className="btn-sample uploaded"
          title={file.name}
          onClick={() => inputRef.current.click()}
        >
          <IconFileCheck />
          <span>{file.name.length > 10 ? file.name.slice(0, 10) + '…' : file.name}</span>
        </button>
      ) : (
        <button
          className="btn-sample"
          title="ファイルをアップロード"
          onClick={() => inputRef.current.click()}
        >
          <IconUpload />
        </button>
      )}
    </div>
  );
};

const DataTable = ({
  forms,
  showWarning,
  checkedItems,
  autoCheckedForms,
  onCheckChange,
  showSampleFile = false,
  showActions = false,
}) => {
  const [viewMode, setViewMode] = useState('checked');
  const [uploadedFiles, setUploadedFiles] = useState({});

  const groupedForms = useMemo(() => groupByFormGroup(forms), [forms]);

  const getVisibleForms = (groupForms) => {
    return groupForms.filter((form) => {
      const isChecked = checkedItems[form.no] || false;
      if (viewMode === 'checked') return isChecked;
      if (viewMode === 'unchecked') return !isChecked;
      return true;
    });
  };

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

  const handleFileChange = (formNo, file) => {
    setUploadedFiles(prev => ({ ...prev, [formNo]: file }));
  };

  const isAutoChecked = (formNo) => {
    return autoCheckedForms && autoCheckedForms[formNo];
  };

  React.useEffect(() => {
    const totalEl = document.getElementById('totalCount');
    const checkedEl = document.getElementById('checkedCount');
    if (totalEl) totalEl.textContent = counts.total;
    if (checkedEl) checkedEl.textContent = `選択：${counts.checked}件 / 未選択：${counts.unchecked}件`;
  }, [counts]);

  // Build grid columns based on active optional columns
  const gridCols = [
    '40px',                              // No.
    '50px',                              // 必須
    showSampleFile ? '180px' : '300px',  // 様式番号
    '1fr',                               // 書類名 (残りスペースを使用)
    showSampleFile ? '120px' : null,     // サンプルファイル
    '90px',                              // 更新者
    '110px',                             // 更新日時
    showActions ? '56px' : null,         // アクション
  ].filter(Boolean).join(' ');

  return (
    <div className="table-section">
      {/* Setting Mode Bar */}
      <div className="setting-mode-bar">
        <span className="setting-mode-label">書類一覧</span>
        <span className="setting-mode-hint">チェックを変更して「保存」で確定</span>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
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
      <div className="table-header" style={{ gridTemplateColumns: gridCols }}>
        <div>No.</div>
        <div>必須</div>
        <div>様式番号</div>
        <div style={{ justifyContent: 'flex-start', paddingLeft: '14px' }}>書類名</div>
        {showSampleFile && <div>サンプル ファイル</div>}
        <div>更新者</div>
        <div>更新日時</div>
        {showActions && <div>操作</div>}
      </div>

      {/* Table Body */}
      <div className="table-body">
        {showWarning && (
          <div className="filter-warning">
            在留資格を選択してください。現在すべての書類を表示しています。
          </div>
        )}

        {forms.length === 0 && (
          <div className="no-data">該当する書類がありません</div>
        )}

        {GROUP_ORDER.map((group) => {
          const groupForms = groupedForms[group] || [];
          const visibleForms = getVisibleForms(groupForms);

          if (visibleForms.length === 0) return null;

          const colors = GROUP_COLORS[group];

          return (
            <React.Fragment key={group}>
              {!showSampleFile && (
                <div className="layer-group-header" style={{ borderLeftColor: colors.border }}>
                  <span className="layer-badge" style={{ backgroundColor: colors.badge }}>
                    {groupNames[group]}
                  </span>
                  <span>{getGroupDescription(group)}</span>
                  <span className="layer-group-count">{visibleForms.length}件</span>
                </div>
              )}

              {visibleForms.map((form, idx) => {
                const isChecked = checkedItems[form.no] || false;
                const isAuto = isAutoChecked(form.no);
                const isManuallyAdded = isChecked && !isAuto;
                const isManuallyRemoved = !isChecked && isAuto;

                return (
                  <div
                    key={form.no}
                    className={`table-row ${!isChecked ? 'unchecked' : ''} ${isManuallyAdded ? 'manually-added' : ''} ${isManuallyRemoved ? 'manually-removed' : ''}`}
                    style={{ gridTemplateColumns: gridCols }}
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
                    {showSampleFile && (
                      <UploadCell
                        formNo={form.no}
                        uploadedFiles={uploadedFiles}
                        onFileChange={handleFileChange}
                      />
                    )}
                    <div className="col-updater">田中 太郎</div>
                    <div className="col-updated">2024年01月15日</div>
                    {showActions && (
                      <div className="col-actions">
                        <button className="btn-action edit" title="編集">
                          <IconEdit />
                        </button>
                        <button className="btn-action delete" title="削除">
                          <IconDelete />
                        </button>
                      </div>
                    )}
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
