import React, { useState, useMemo, useCallback } from 'react';
import FilterSection from './components/FilterSection';
import DataTable from './components/DataTable';
import { formsData } from './data/formsData';
import { filterForms, getAutoCheckedForms, mergeCheckedState } from './utils/filterUtils';
import './styles/App.css';

const STORAGE_KEY = 'shinsei-shorui-data';

function getFilterKey(filters) {
  const { visa, appType, sector } = filters;
  return [visa, appType, sector].join('|');
}

function loadSavedData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return null;
    if (data.version === 4) return data;
    // Incompatible old format — start fresh
    return null;
  } catch {
    return null;
  }
}

function App() {
  const saved = loadSavedData();

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

  // Unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    const saved = savedData.allOverrides[currentFilterKey] || {};
    return JSON.stringify(workingOverrides) !== JSON.stringify(saved);
  }, [workingOverrides, savedData, currentFilterKey]);

  // Filter forms with base filters + tags
  const { filteredForms, showWarning } = useMemo(
    () => filterForms(formsData, filters, selectedTags),
    [filters, selectedTags]
  );

  // Auto-checked forms
  const autoCheckedForms = useMemo(
    () => getAutoCheckedForms(formsData, filters, selectedTags),
    [filters, selectedTags]
  );

  // Final checked state
  const checkedItems = useMemo(
    () => mergeCheckedState(autoCheckedForms, workingOverrides),
    [autoCheckedForms, workingOverrides]
  );

  // Handle filter change — warn if key changes with unsaved changes
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

  // Handle tag change — tags don't affect override key, no warning needed
  const handleTagChange = useCallback((newTags) => {
    setSelectedTags(newTags);
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {}, []);

  // Handle check change
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

  // Handle save
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedData));

    const selectedCount = Object.entries(checkedItems)
      .filter(([_, checked]) => checked).length;
    alert(`保存しました。選択件数: ${selectedCount}件`);
  }, [savedData, workingOverrides, currentFilterKey, filters, selectedTags, checkedItems]);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">申請書類管理</h1>
        <button className="btn-save" onClick={handleSave}>保存</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tab primary">申請人書類</div>
        <div className="tab secondary">所属機関書類</div>
        <div className="tab active">オンライン作成書類</div>
      </div>

      {/* Filter Section */}
      <FilterSection
        filters={filters}
        selectedTags={selectedTags}
        onFilterChange={handleFilterChange}
        onTagChange={handleTagChange}
        onSearch={handleSearch}
      />

      {/* Data Table */}
      <DataTable
        forms={filteredForms}
        showWarning={showWarning}
        checkedItems={checkedItems}
        autoCheckedForms={autoCheckedForms}
        onCheckChange={handleCheckChange}
      />
    </div>
  );
}

export default App;
