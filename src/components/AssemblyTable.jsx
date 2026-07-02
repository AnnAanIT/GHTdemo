import { useState, useMemo } from 'react';

const SOURCE_COLORS = {
  shinseinin: '#4A9BAD',
  shokkikan: '#6ABDD4',
  haken: '#8CD4E8',
  online: '#E08050',
};

const IconGrip = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="8" cy="5" r="1.6" /><circle cx="16" cy="5" r="1.6" />
    <circle cx="8" cy="12" r="1.6" /><circle cx="16" cy="12" r="1.6" />
    <circle cx="8" cy="19" r="1.6" /><circle cx="16" cy="19" r="1.6" />
  </svg>
);

const AssemblyTable = ({
  items,
  allItems,
  showWarning,
  dragDisabled = false,
  onReorder,
  onSave,
  hasChanges = false,
}) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const sourceCounts = useMemo(() => {
    const counts = {};
    allItems.forEach((form) => {
      counts[form.sourceKey] = (counts[form.sourceKey] || 0) + 1;
    });
    return counts;
  }, [allItems]);

  const resetDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragStart = (e, idx) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (idx !== overIndex) setOverIndex(idx);
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) {
      resetDrag();
      return;
    }
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(idx, 0, moved);
    onReorder(newItems);
    resetDrag();
  };

  return (
    <div className="table-section">
      {/* Setting Mode Bar */}
      <div className="setting-mode-bar">
        <span className="setting-mode-label">完成書類一覧</span>
        <span className="setting-mode-hint">ドラッグして並び替え、「保存」で確定</span>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <div className="assembly-source-counts">
            <span className="assembly-total-count">合計 {allItems.length}件</span>
            {Object.entries(sourceCounts).map(([sourceKey, count]) => {
              const label = allItems.find((it) => it.sourceKey === sourceKey)?.sourceLabel || sourceKey;
              return (
                <span key={sourceKey} className="assembly-source-count">
                  <span className="assembly-source-dot" style={{ background: SOURCE_COLORS[sourceKey] || '#999' }} />
                  {label} {count}
                </span>
              );
            })}
          </div>
        </div>
        <div className="table-toolbar-right">
          <button
            className={`btn-save ${hasChanges ? 'has-changes' : ''}`}
            onClick={onSave}
          >
            保存
          </button>
        </div>
      </div>

      <div className="assembly-hint-bar">
        各タブで保存した内容をもとに表示しています。最新の内容を反映するには、先に各タブで「保存」してください。
      </div>

      {/* Table Body */}
      <div className="table-body">
        <div className="table-header assembly-grid">
          <div></div>
          <div>No.</div>
          <div>区分</div>
          <div>様式番号</div>
          <div style={{ justifyContent: 'flex-start', paddingLeft: '14px' }}>書類名</div>
          <div>更新者</div>
          <div>更新日時</div>
        </div>

        {showWarning && (
          <div className="filter-warning">
            在留資格と申請区分を選択してください。
          </div>
        )}

        {!showWarning && items.length === 0 && (
          <div className="no-data">該当する書類がありません</div>
        )}

        {items.map((form, idx) => (
          <div
            key={form.uid}
            className={`table-row assembly-grid ${dragIndex === idx ? 'dragging' : ''} ${overIndex === idx && dragIndex !== idx ? 'drag-over' : ''}`}
            draggable={!dragDisabled}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={resetDrag}
          >
            <div className={`col-drag-handle ${dragDisabled ? 'disabled' : ''}`} title={dragDisabled ? '検索中は並び替えできません' : 'ドラッグで並び替え'}>
              <IconGrip />
            </div>
            <div className="col-no">{idx + 1}</div>
            <div className="col-source">
              <span className="assembly-source-badge" style={{ backgroundColor: SOURCE_COLORS[form.sourceKey] || '#999' }}>
                {form.sourceLabel}
              </span>
            </div>
            <div className="col-form-no">{form.form_no}</div>
            <div className="col-form-name">{form.form_name}</div>
            <div className="col-updater">田中 太郎</div>
            <div className="col-updated">2024年01月15日</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssemblyTable;
