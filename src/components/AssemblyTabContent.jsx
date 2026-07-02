import { useState, useMemo, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import FilterSection from './FilterSection';
import AssemblyTable from './AssemblyTable';
import { shinseininForms } from '../data/shinseininData';
import { shokkikanForms } from '../data/shokkikanData';
import { hakenForms } from '../data/hakenData';
import { formsData as onlineForms } from '../data/formsData';
import { getFilterKey, loadSavedData, getAutoCheckedForms, mergeCheckedState } from '../utils/filterUtils';

const STORAGE_KEY = 'simulation-data';

const SOURCE_TABS = [
  { key: 'shinseinin', label: '申請人書類', storageKey: 'shinseinin-data', formsData: shinseininForms },
  { key: 'shokkikan', label: '所属機関書類', storageKey: 'shokkikan-data', formsData: shokkikanForms },
  { key: 'haken', label: '派遣先', storageKey: 'haken-data', formsData: hakenForms },
  { key: 'online', label: 'オンライン作成書類', storageKey: 'shinsei-shorui-data', formsData: onlineForms },
];

// Forms currently checked (auto-check + saved overrides) for one source tab, tagged with source info.
// Membership (checked or not) never depends on searchText — search only narrows what's displayed.
function getCheckedItemsForTab(tab, filters, selectedTags) {
  if (!filters.visa || !filters.appType) return [];

  const membershipFilters = { ...filters, searchText: '' };
  const saved = loadSavedData(tab.storageKey);
  const filterKey = getFilterKey(filters);
  const autoChecked = getAutoCheckedForms(tab.formsData, membershipFilters, selectedTags);
  const overrides = saved?.allOverrides?.[filterKey] || {};
  const checked = mergeCheckedState(autoChecked, overrides);

  return tab.formsData
    .filter((form) => checked[form.no])
    .map((form) => ({
      ...form,
      uid: `${tab.key}:${form.no}`,
      sourceKey: tab.key,
      sourceLabel: tab.label,
    }));
}

// Apply a saved uid order on top of the natural (source-tab) order.
// New items not present in the saved order are appended at the end; items that
// disappeared are simply dropped.
function applyOrder(items, orderUids) {
  if (!orderUids || orderUids.length === 0) return items;

  const remaining = new Map(items.map((item) => [item.uid, item]));
  const ordered = [];

  orderUids.forEach((uid) => {
    if (remaining.has(uid)) {
      ordered.push(remaining.get(uid));
      remaining.delete(uid);
    }
  });

  items.forEach((item) => {
    if (remaining.has(item.uid)) {
      ordered.push(item);
      remaining.delete(item.uid);
    }
  });

  return ordered;
}

const AssemblyTabContent = forwardRef(({ isActive, onHasChangesChange, onSave, hasChanges }, ref) => {
  const saved = useMemo(() => loadSavedData(STORAGE_KEY), []);

  const [savedData, setSavedData] = useState({
    lastFilters: saved?.lastFilters || { visa: '', appType: '', sector: '', searchText: '' },
    lastTags: saved?.lastTags || [],
    order: saved?.order || {},
  });

  const [filters, setFilters] = useState(savedData.lastFilters);
  const [selectedTags, setSelectedTags] = useState(savedData.lastTags);
  const [refreshTick, setRefreshTick] = useState(0);

  const currentFilterKey = useMemo(() => getFilterKey(filters), [filters]);

  const [workingOrder, setWorkingOrder] = useState(
    () => savedData.order[getFilterKey(savedData.lastFilters)] || null
  );

  // Re-read the 4 source tabs' saved state whenever this tab becomes active,
  // so edits made (and saved) elsewhere are picked up when the user switches here.
  useEffect(() => {
    if (isActive) setRefreshTick((t) => t + 1);
  }, [isActive]);

  const naturalItems = useMemo(
    () => SOURCE_TABS.flatMap((tab) => getCheckedItemsForTab(tab, filters, selectedTags)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, selectedTags, refreshTick]
  );

  const showWarning = !filters.visa || !filters.appType;

  const displayedItems = useMemo(
    () => applyOrder(naturalItems, workingOrder),
    [naturalItems, workingOrder]
  );

  // Search only narrows the visible list; it never affects membership or the saved order.
  const searchActive = !!filters.searchText;
  const visibleItems = useMemo(() => {
    if (!searchActive) return displayedItems;
    const search = filters.searchText.toLowerCase();
    return displayedItems.filter((form) => {
      const formNo = form.form_no ? form.form_no.toLowerCase() : '';
      const formName = form.form_name ? form.form_name.toLowerCase() : '';
      return formNo.includes(search) || formName.includes(search);
    });
  }, [displayedItems, searchActive, filters.searchText]);

  const naturalUidOrder = useMemo(() => naturalItems.map((it) => it.uid), [naturalItems]);

  const hasUnsavedChanges = useMemo(() => {
    const savedOrderForKey = savedData.order[currentFilterKey] || naturalUidOrder;
    const currentOrderUids = displayedItems.map((it) => it.uid);
    return JSON.stringify(currentOrderUids) !== JSON.stringify(savedOrderForKey);
  }, [displayedItems, savedData, currentFilterKey, naturalUidOrder]);

  useEffect(() => {
    onHasChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onHasChangesChange]);

  const handleFilterChange = useCallback((newFilters) => {
    const newKey = getFilterKey(newFilters);

    if (newKey !== currentFilterKey) {
      if (hasUnsavedChanges) {
        if (!window.confirm('未保存の変更があります。変更を破棄して切り替えますか？')) {
          return;
        }
      }
      setWorkingOrder(savedData.order[newKey] || null);
    }

    setFilters(newFilters);
  }, [currentFilterKey, hasUnsavedChanges, savedData]);

  const handleTagChange = useCallback((newTags) => {
    setSelectedTags(newTags);
  }, []);

  const handleSearch = useCallback(() => {}, []);

  const handleReorder = useCallback((newItems) => {
    setWorkingOrder(newItems.map((it) => it.uid));
  }, []);

  const handleSave = useCallback(() => {
    const newOrder = { ...savedData.order };
    const currentOrderUids = displayedItems.map((it) => it.uid);

    if (JSON.stringify(currentOrderUids) !== JSON.stringify(naturalUidOrder)) {
      newOrder[currentFilterKey] = currentOrderUids;
    } else {
      delete newOrder[currentFilterKey];
    }

    const newSavedData = {
      version: 4,
      lastFilters: { ...filters, searchText: '' },
      lastTags: [...selectedTags],
      order: newOrder,
    };

    setSavedData(newSavedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedData));

    alert(`保存しました。書類件数: ${displayedItems.length}件`);
  }, [savedData, displayedItems, naturalUidOrder, currentFilterKey, filters, selectedTags]);

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

      <AssemblyTable
        items={visibleItems}
        allItems={displayedItems}
        showWarning={showWarning}
        dragDisabled={searchActive}
        onReorder={handleReorder}
        onSave={onSave || handleSave}
        hasChanges={hasChanges ?? hasUnsavedChanges}
      />
    </div>
  );
});

export default AssemblyTabContent;
