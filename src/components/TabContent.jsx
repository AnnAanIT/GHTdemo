import { useState, useMemo, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import FilterSection from './FilterSection';
import DataTable from './DataTable';
import { formsData as defaultFormsData } from '../data/formsData';
import { filterForms, getAutoCheckedForms, mergeCheckedState } from '../utils/filterUtils';

function getFilterKey(filters) {
  const { visa, appType, sector } = filters;
  return [visa, appType, sector].join('|');
}

function loadSavedData(storageKey) {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey));
    if (!data) return null;
    if (data.version === 4) return data;
    return null;
  } catch {
    return null;
  }
}

const TabContent = forwardRef(({ storageKey, showSampleFile = false, showActions = false, formsDataProp, onHasChangesChange }, ref) => {
  const formsData = useMemo(() => formsDataProp || defaultFormsData, [formsDataProp]);
  const saved = useMemo(() => loadSavedData(storageKey), [storageKey]);

  const [savedData, setSavedData] = useState({
    lastFilters: saved?.lastFilters || { visa: '', appType: '', sector: '', searchText: '' },
    lastTags: saved?.lastTags || [],
    allOverrides: saved?.allOverrides || {},
  });

  const [filters, setFilters] = useState(savedData.lastFilters);
  const [selectedTags, setSelectedTags] = useState(savedData.lastTags);

  const currentFilterKey = useMemo(() => getFilterKey(filters), [filters]);

  const [workingOverrides, setWorkingOverrides] = useState(
    () => savedData.allOverrides[getFilterKey(savedData.lastFilters)] || {}
  );

  const hasUnsavedChanges = useMemo(() => {
    const saved = savedData.allOverrides[currentFilterKey] || {};
    return JSON.stringify(workingOverrides) !== JSON.stringify(saved);
  }, [workingOverrides, savedData, currentFilterKey]);

  // Notify parent of hasChanges state
  useEffect(() => {
    onHasChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onHasChangesChange]);

  const { filteredForms, showWarning } = useMemo(
    () => filterForms(formsData, filters, selectedTags),
    [formsData, filters, selectedTags]
  );

  const autoCheckedForms = useMemo(
    () => getAutoCheckedForms(formsData, filters, selectedTags),
    [formsData, filters, selectedTags]
  );

  const checkedItems = useMemo(
    () => mergeCheckedState(autoCheckedForms, workingOverrides),
    [autoCheckedForms, workingOverrides]
  );

  const handleFilterChange = useCallback((newFilters) => {
    const newKey = getFilterKey(newFilters);

    if (newKey !== currentFilterKey) {
      if (hasUnsavedChanges) {
        if (!window.confirm('未保存の変更があります。変更を破棄して切り替えますか？')) {
          return;
        }
      }
      setWorkingOverrides(savedData.allOverrides[newKey] || {});
    }

    setFilters(newFilters);
  }, [currentFilterKey, hasUnsavedChanges, savedData]);

  const handleTagChange = useCallback((newTags) => {
    setSelectedTags(newTags);
  }, []);

  const handleSearch = useCallback(() => {}, []);

  const handleCheckChange = useCallback((formNo, isChecked) => {
    const wasAutoChecked = autoCheckedForms[formNo] || false;

    setWorkingOverrides(prev => {
      const newOverrides = { ...prev };
      if (isChecked === wasAutoChecked) {
        delete newOverrides[formNo];
      } else {
        newOverrides[formNo] = isChecked;
      }
      return newOverrides;
    });
  }, [autoCheckedForms]);

  const handleSave = useCallback(() => {
    const newAllOverrides = { ...savedData.allOverrides };

    if (Object.keys(workingOverrides).length > 0) {
      newAllOverrides[currentFilterKey] = { ...workingOverrides };
    } else {
      delete newAllOverrides[currentFilterKey];
    }

    const newSavedData = {
      version: 4,
      lastFilters: { ...filters, searchText: '' },
      lastTags: [...selectedTags],
      allOverrides: newAllOverrides,
    };

    setSavedData(newSavedData);
    localStorage.setItem(storageKey, JSON.stringify(newSavedData));

    const selectedCount = Object.values(checkedItems).filter(Boolean).length;
    alert(`保存しました。選択件数: ${selectedCount}件`);
  }, [savedData, workingOverrides, currentFilterKey, filters, selectedTags, checkedItems, storageKey]);

  // Expose save() to parent via ref
  useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

  return (
    <div className="tab-content">
      <FilterSection
        filters={filters}
        selectedTags={selectedTags}
        onFilterChange={handleFilterChange}
        onTagChange={handleTagChange}
        onSearch={handleSearch}
      />

      <DataTable
        forms={filteredForms}
        showWarning={showWarning}
        checkedItems={checkedItems}
        autoCheckedForms={autoCheckedForms}
        onCheckChange={handleCheckChange}
        showSampleFile={showSampleFile}
        showActions={showActions}
      />
    </div>
  );
});

export default TabContent;
