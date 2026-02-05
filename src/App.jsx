import React, { useState, useMemo, useCallback } from 'react';
import FilterSection from './components/FilterSection';
import DataTable from './components/DataTable';
import { formsData } from './data/formsData';
import { filterForms } from './utils/filterUtils';
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

  // Checked items state
  const [checkedItems, setCheckedItems] = useState({});

  // Filter forms
  const { filteredForms, showWarning } = useMemo(() => {
    return filterForms(formsData, filters);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    // Filters are already applied via useMemo
    console.log('Search triggered', filters);
  }, [filters]);

  // Handle check change
  const handleCheckChange = useCallback((newCheckedItems) => {
    setCheckedItems(newCheckedItems);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    const selectedForms = Object.entries(checkedItems)
      .filter(([_, checked]) => checked)
      .map(([no]) => parseInt(no));

    console.log('Saved forms:', selectedForms);
    alert(`保存しました。選択件数: ${selectedForms.length}件`);
  }, [checkedItems]);

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
        forms={filteredForms}
        showWarning={showWarning}
        checkedItems={checkedItems}
        onCheckChange={handleCheckChange}
      />
    </div>
  );
}

export default App;
