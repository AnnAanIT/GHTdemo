import React, { useState, useMemo, useCallback, useEffect } from 'react';
import FilterSection from './components/FilterSection';
import DataTable from './components/DataTable';
import { formsData } from './data/formsData';
import { filterForms, getAutoCheckedForms, mergeCheckedState, getFormsFromEnabledLayers } from './utils/filterUtils';
import './styles/App.css';

function App() {
  // Filter state
  const [filters, setFilters] = useState({
    visa: '',
    appType: '',
    org: '',
    category: '',
    sector: '',
    employment: '',
    searchText: '',
  });

  // Manual overrides - tracks user's manual changes (true = added, false = removed)
  const [manualOverrides, setManualOverrides] = useState({});

  // Show additional forms toggle (forms not matching filter but can be added)
  const [showAdditional, setShowAdditional] = useState(false);

  // Filter forms
  const { filteredForms, showWarning } = useMemo(() => {
    return filterForms(formsData, filters);
  }, [filters]);

  // Auto-checked forms based on filter
  const autoCheckedForms = useMemo(() => {
    return getAutoCheckedForms(formsData, filters);
  }, [filters]);

  // Final checked state = auto + manual overrides
  const checkedItems = useMemo(() => {
    return mergeCheckedState(autoCheckedForms, manualOverrides);
  }, [autoCheckedForms, manualOverrides]);

  // Forms to display - filtered forms + optionally forms from enabled layers
  const displayForms = useMemo(() => {
    if (!showAdditional) {
      return filteredForms;
    }
    // Show all forms from enabled layers when "追加表示" is enabled
    return getFormsFromEnabledLayers(formsData, filters);
  }, [filteredForms, showAdditional, filters]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // Reset manual overrides when filter changes (optional - can be removed if you want to keep overrides)
    // setManualOverrides({});
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    // Filters are already applied via useMemo
    console.log('Search triggered', filters);
  }, [filters]);

  // Handle check change - now tracks manual overrides
  const handleCheckChange = useCallback((formNo, isChecked) => {
    const wasAutoChecked = autoCheckedForms[formNo] || false;

    setManualOverrides(prev => {
      const newOverrides = { ...prev };

      if (isChecked === wasAutoChecked) {
        // Back to auto state - remove override
        delete newOverrides[formNo];
      } else {
        // Manual override
        newOverrides[formNo] = isChecked;
      }

      return newOverrides;
    });
  }, [autoCheckedForms]);

  // Handle toggle additional forms display
  const handleToggleAdditional = useCallback(() => {
    setShowAdditional(prev => !prev);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    const selectedForms = Object.entries(checkedItems)
      .filter(([_, checked]) => checked)
      .map(([no]) => parseInt(no));

    console.log('Saved forms:', selectedForms);
    console.log('Manual overrides:', manualOverrides);
    alert(`保存しました。選択件数: ${selectedForms.length}件`);
  }, [checkedItems, manualOverrides]);

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
