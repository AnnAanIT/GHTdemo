import React, { useState, useMemo, useCallback } from 'react';
import FilterSection from './components/FilterSection';
import DataTable from './components/DataTable';
import { formsData } from './data/formsData';
import { filterForms, getAutoCheckedForms, mergeCheckedState, getFormsFromEnabledLayers } from './utils/filterUtils';
import './styles/App.css';

const STORAGE_KEY = 'shinsei-shorui-data';

function getFilterKey(filters) {
  const { visa, appType, org, category, sector, employment } = filters;
  return [visa, appType, org, category, sector, employment].join('|');
}

function loadSavedData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return null;
    // New format
    if (data.allOverrides) return data;
    // Old format - migrate
    if (data.filters) {
      const migrated = { lastFilters: data.filters, allOverrides: {} };
      if (data.manualOverrides && Object.keys(data.manualOverrides).length > 0) {
        migrated.allOverrides[getFilterKey(data.filters)] = data.manualOverrides;
      }
      return migrated;
    }
    return null;
  } catch {
    return null;
  }
}

function App() {
  const saved = loadSavedData();

  // Saved data from localStorage (source of truth)
  const [savedData, setSavedData] = useState({
    lastFilters: saved?.lastFilters || {
      visa: '', appType: '', org: '', category: '', sector: '', employment: '', searchText: '',
    },
    allOverrides: saved?.allOverrides || {},
  });

  // Current filter state
  const [filters, setFilters] = useState(savedData.lastFilters);

  // Current filter key (excludes searchText)
  const currentFilterKey = useMemo(() => getFilterKey(filters), [filters]);

  // Working overrides for current filter (starts from saved, modified by user)
  const [workingOverrides, setWorkingOverrides] = useState(
    () => savedData.allOverrides[getFilterKey(savedData.lastFilters)] || {}
  );

  // Show additional forms toggle
  const [showAdditional, setShowAdditional] = useState(false);

  // Whether there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const saved = savedData.allOverrides[currentFilterKey] || {};
    return JSON.stringify(workingOverrides) !== JSON.stringify(saved);
  }, [workingOverrides, savedData, currentFilterKey]);

  // Filter forms
  const { filteredForms, showWarning } = useMemo(() => {
    return filterForms(formsData, filters);
  }, [filters]);

  // Auto-checked forms based on filter
  const autoCheckedForms = useMemo(() => {
    return getAutoCheckedForms(formsData, filters);
  }, [filters]);

  // Final checked state = auto + working overrides
  const checkedItems = useMemo(() => {
    return mergeCheckedState(autoCheckedForms, workingOverrides);
  }, [autoCheckedForms, workingOverrides]);

  // Forms to display - filtered forms + optionally forms from enabled layers
  const displayForms = useMemo(() => {
    if (!showAdditional) {
      return filteredForms;
    }
    return getFormsFromEnabledLayers(formsData, filters);
  }, [filteredForms, showAdditional, filters]);

  // Handle filter change - warn if unsaved changes
  const handleFilterChange = useCallback((newFilters) => {
    const newKey = getFilterKey(newFilters);

    // Only warn if filter key actually changes (not just searchText)
    if (newKey !== currentFilterKey) {
      if (hasUnsavedChanges) {
        if (!window.confirm('未保存の変更があります。変更を破棄して切り替えますか？')) {
          return;
        }
      }
      // Load saved overrides for new filter combination
      setWorkingOverrides(savedData.allOverrides[newKey] || {});
    }

    setFilters(newFilters);
  }, [currentFilterKey, hasUnsavedChanges, savedData]);

  // Handle search
  const handleSearch = useCallback(() => {
    console.log('Search triggered', filters);
  }, [filters]);

  // Handle check change - modifies working overrides (unsaved)
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

  // Handle toggle additional forms display
  const handleToggleAdditional = useCallback(() => {
    setShowAdditional(prev => !prev);
  }, []);

  // Handle save - commit working overrides to saved data + localStorage
  const handleSave = useCallback(() => {
    const newAllOverrides = { ...savedData.allOverrides };

    if (Object.keys(workingOverrides).length > 0) {
      newAllOverrides[currentFilterKey] = { ...workingOverrides };
    } else {
      delete newAllOverrides[currentFilterKey];
    }

    const newSavedData = {
      lastFilters: { ...filters, searchText: '' },
      allOverrides: newAllOverrides,
    };

    setSavedData(newSavedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedData));

    const selectedCount = Object.entries(checkedItems)
      .filter(([_, checked]) => checked).length;
    alert(`保存しました。選択件数: ${selectedCount}件`);
  }, [savedData, workingOverrides, currentFilterKey, filters, checkedItems]);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">申請書類管理</h1>
        <button className="btn-save" onClick={handleSave}>
          保存
        </button>
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
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Data Table */}
      <DataTable
        forms={displayForms}
        showWarning={showWarning}
        checkedItems={checkedItems}
        autoCheckedForms={autoCheckedForms}
        onCheckChange={handleCheckChange}
        showAdditional={showAdditional}
        onToggleAdditional={handleToggleAdditional}
      />
    </div>
  );
}

export default App;
