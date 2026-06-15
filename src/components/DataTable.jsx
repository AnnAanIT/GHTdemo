import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <polyline points="9 15 12 12 15 15"/>
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

const IconPreview = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <circle cx="11" cy="14" r="2.5"/>
    <line x1="13" y1="16" x2="15.5" y2="18.5"/>
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
          <IconFileCheck />
        </button>
      )}
    </div>
  );
};

const TODAY = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}年${m}月${day}日`;
})();

const AllTypesModal = ({ allForms, onClose }) => {
  const groupedForms = useMemo(() => groupByFormGroup(allForms), [allForms]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const gridCols = '40px 240px 1fr 90px 110px';

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-area">
            <span className="modal-title-text">全書類</span>
            <span className="modal-total-count">全{allForms.length}件</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {allForms.length === 0 ? (
            <div className="no-data">データがありません</div>
          ) : (
            <>
              <div className="modal-table-header" style={{ gridTemplateColumns: gridCols }}>
                <div>No.</div>
                <div>様式番号</div>
                <div style={{ justifyContent: 'flex-start', paddingLeft: '14px' }}>書類名</div>
                <div>更新者</div>
                <div>更新日時</div>
              </div>
              {GROUP_ORDER.map(group => {
                const groupForms = groupedForms[group] || [];
                if (groupForms.length === 0) return null;
                const colors = GROUP_COLORS[group];
                return (
                  <React.Fragment key={group}>
                    <div className="layer-group-header" style={{ borderLeftColor: colors.border }}>
                      <span className="layer-badge" style={{ backgroundColor: colors.badge }}>
                        {groupNames[group]}
                      </span>
                      <span>{getGroupDescription(group)}</span>
                      <span className="layer-group-count">{groupForms.length}件</span>
                    </div>
                    {groupForms.map((form, idx) => (
                      <div
                        key={form.no}
                        className={`modal-table-row${idx % 2 === 1 ? ' even-row' : ''}`}
                        style={{ gridTemplateColumns: gridCols }}
                      >
                        <div className="col-no">{idx + 1}</div>
                        <div className="col-form-no">{form.form_no}</div>
                        <div className="col-form-name">{form.form_name}</div>
                        <div className="col-updater">田中 太郎</div>
                        <div className="col-updated">2024年01月15日</div>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const AddEditFormModal = ({ mode = 'add', onClose }) => {
  const [shoruiName, setShoruiName] = useState('');
  const [yoshikiNo, setYoshikiNo] = useState('');
  const [annai, setAnnai] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const title = mode === 'add' ? '様式書類追加' : '様式種類編集';

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...newFiles].slice(0, 5));
    e.target.value = '';
  };

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="addedit-container">
        <div className="addedit-header">
          <span className="addedit-title">{title}</span>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="addedit-body">
          {/* 書類名 */}
          <div className="addedit-row">
            <label className="addedit-label">
              書類名 <span className="field-required">*</span>
            </label>
            <div className="addedit-input-wrap">
              <input
                type="text"
                className="addedit-input"
                placeholder="書類名を入力してください"
                value={shoruiName}
                onChange={e => setShoruiName(e.target.value)}
              />
            </div>
          </div>

          {/* 様式番号 */}
          <div className="addedit-row">
            <label className="addedit-label">
              様式番号 <span className="field-required">*</span>
            </label>
            <div className="addedit-input-wrap">
              <input
                type="text"
                className="addedit-input"
                placeholder="様式番号を入力してください"
                value={yoshikiNo}
                onChange={e => setYoshikiNo(e.target.value)}
              />
            </div>
          </div>

          {/* 案内文書 */}
          <div className="addedit-row">
            <label className="addedit-label">案内文書</label>
            <div className="addedit-input-wrap">
              <textarea
                className="addedit-textarea"
                placeholder="案内文書を入力してください"
                value={annai}
                onChange={e => setAnnai(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* サンプルファイル */}
          <div className="addedit-row">
            <label className="addedit-label">サンプルファイル</label>
            <div className="addedit-input-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {files.length < 5 && (
                <button className="btn-addedit-upload" onClick={() => fileInputRef.current.click()}>
                  <IconUpload /> Upload
                </button>
              )}
              {files.length > 0 && (
                <div className="addedit-file-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="addedit-file-item">
                      <IconFileCheck />
                      <span>{file.name}</span>
                      <button
                        className="addedit-file-remove"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="addedit-upload-hint">PDFファイル、最大5件</p>
            </div>
          </div>

          {/* 書類タイプ */}
          <div className="addedit-row">
            <label className="addedit-label">書類タイプ</label>
            <div className="addedit-input-wrap">
              <label className="addedit-checkbox">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={e => setIsRequired(e.target.checked)}
                />
                <span>必須</span>
              </label>
            </div>
          </div>
        </div>

        <div className="addedit-footer">
          <button className="btn-addedit-cancel" onClick={onClose}>キャンセル</button>
          <button className="btn-addedit-save">保存</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const PreviewModal = ({ form, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="preview-container">
        <div className="preview-header">
          <div className="preview-title-area">
            <span className="preview-form-no">{form.form_no}</span>
            <span className="preview-form-name">{form.form_name}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="preview-body">
          <div className="preview-doc-frame">
            <div className="preview-doc-header">
              <div className="preview-doc-badge">{form.form_group}</div>
              <span>{form.form_no}</span>
            </div>
            <div className="preview-doc-title">{form.form_name}</div>
            <div className="preview-no-file">
              <IconFileCheck />
              <span>サンプルファイルは未登録です</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
  showAllTypes = false,
  showPreviewFile = false,
  allForms = [],
  onSave,
  hasChanges = false,
}) => {
  const [viewMode, setViewMode] = useState('checked');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewForm, setPreviewForm] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [newRows, setNewRows] = useState([]);
  const [newRowChecked, setNewRowChecked] = useState({});

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

  const handleAddRow = () => {
    const id = `new-${Date.now()}`;
    setNewRows(prev => [...prev, { id, form_no: '', form_name: '', annai_bunsho: '', updater: '' }]);
    setNewRowChecked(prev => ({ ...prev, [id]: false }));
  };

  const handleNewRowChange = (id, field, value) => {
    setNewRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteNewRow = (id) => {
    setNewRows(prev => prev.filter(r => r.id !== id));
    setNewRowChecked(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  // Build grid columns based on active optional columns
  const gridCols = [
    '40px',                                                         // No.
    '50px',                                                         // 必須
    showSampleFile ? '180px' : showPreviewFile ? '240px' : '300px', // 様式番号
    '1fr',                                                          // 書類名
    showSampleFile ? '240px' : null,                                // 案内文書
    (showSampleFile || showPreviewFile) ? '100px' : null,           // サンプルファイル
    '90px',                                                         // 更新者
    '110px',                                                        // 更新日時
    showActions ? '56px' : null,                                    // アクション
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
        <div className="table-toolbar-right">
          <button
            className={`btn-save ${hasChanges ? 'has-changes' : ''}`}
            onClick={onSave}
          >
            保存
          </button>
          {showAllTypes && (
            <button className="btn-all-types" onClick={() => setShowModal(true)}>
              全書類
            </button>
          )}
          {showActions && (
            <button className="btn-add-row" onClick={() => setShowAddModal(true)}>
              + 追加
            </button>
          )}
        </div>
      </div>

      {/* Table Body (header is inside so sticky header shares same scroll container width) */}
      <div className="table-body">
        <div className="table-header" style={{ gridTemplateColumns: gridCols }}>
          <div>No.</div>
          <div>必須</div>
          <div>様式番号</div>
          <div style={{ justifyContent: 'flex-start', paddingLeft: '14px' }}>書類名</div>
          {showSampleFile && <div>案内文書</div>}
          {(showSampleFile || showPreviewFile) && <div>サンプル ファイル</div>}
          <div>更新者</div>
          <div>更新日時</div>
          {showActions && <div>操作</div>}
        </div>
        {showWarning && (
          <div className="filter-warning">
            {showAllTypes
              ? '在留資格と申請区分を選択してください。全書類は「書類一覧」から確認できます。'
              : '在留資格と申請区分を選択してください。'
            }
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
              {(!showSampleFile) && (
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
                      <div className="col-annai-bunsho">
                        {form.annai_bunsho || '—'}
                      </div>
                    )}
                    {showSampleFile && (
                      <UploadCell
                        formNo={form.no}
                        uploadedFiles={uploadedFiles}
                        onFileChange={handleFileChange}
                      />
                    )}
                    {showPreviewFile && (
                      <div className="col-sample-preview">
                        <button
                          className="btn-preview"
                          title="プレビュー"
                          onClick={() => setPreviewForm(form)}
                        >
                          <IconFileCheck />
                        </button>
                      </div>
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

        {/* New rows added by 追加 button */}
        {newRows.map((row, idx) => (
          <div
            key={row.id}
            className="table-row new-row"
            style={{ gridTemplateColumns: gridCols }}
          >
            <div className="col-no">{forms.length + idx + 1}</div>
            <div className="col-required">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={newRowChecked[row.id] || false}
                  onChange={() => setNewRowChecked(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
                />
              </div>
            </div>
            <div className="col-form-no">
              <input
                type="text"
                className="cell-input"
                value={row.form_no}
                placeholder="様式番号"
                onChange={e => handleNewRowChange(row.id, 'form_no', e.target.value)}
              />
            </div>
            <div className="col-form-name">
              <input
                type="text"
                className="cell-input"
                value={row.form_name}
                placeholder="書類名を入力..."
                onChange={e => handleNewRowChange(row.id, 'form_name', e.target.value)}
              />
            </div>
            {showSampleFile && (
              <div className="col-annai-bunsho">
                <input
                  type="text"
                  className="cell-input"
                  value={row.annai_bunsho}
                  placeholder="案内文書"
                  onChange={e => handleNewRowChange(row.id, 'annai_bunsho', e.target.value)}
                />
              </div>
            )}
            {showSampleFile && (
              <UploadCell
                formNo={row.id}
                uploadedFiles={uploadedFiles}
                onFileChange={handleFileChange}
              />
            )}
            <div className="col-updater">
              <input
                type="text"
                className="cell-input"
                value={row.updater}
                placeholder="更新者"
                onChange={e => handleNewRowChange(row.id, 'updater', e.target.value)}
              />
            </div>
            <div className="col-updated">{TODAY}</div>
            {showActions && (
              <div className="col-actions">
                <button className="btn-action delete" title="削除" onClick={() => handleDeleteNewRow(row.id)}>
                  <IconDelete />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <AllTypesModal
          allForms={allForms}
          onClose={() => setShowModal(false)}
        />
      )}
      {showAddModal && (
        <AddEditFormModal
          mode="add"
          onClose={() => setShowAddModal(false)}
        />
      )}
      {previewForm && (
        <PreviewModal
          form={previewForm}
          onClose={() => setPreviewForm(null)}
        />
      )}
    </div>
  );
};

export default DataTable;
