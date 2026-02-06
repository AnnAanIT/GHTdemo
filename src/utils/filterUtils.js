// Filter utility functions

/**
 * Check if a form matches the given filter criteria
 * @param {Object} form - Form data object
 * @param {Object} filters - Filter criteria
 * @returns {boolean} - Whether form matches filters
 */
export function matchesFilter(form, filters) {
  // Check visa type - form.visa is array or null (null = all visas)
  if (filters.visa && form.visa !== null) {
    if (!Array.isArray(form.visa) || !form.visa.includes(filters.visa)) {
      return false;
    }
  }

  // Check application type - form.appType is array or null
  if (filters.appType && form.appType !== null) {
    if (!Array.isArray(form.appType) || !form.appType.includes(filters.appType)) {
      return false;
    }
  }

  // Check organization type - form.org is array or null
  if (filters.org && filters.org !== 'undecided' && form.org !== null) {
    if (!Array.isArray(form.org) || !form.org.includes(filters.org)) {
      return false;
    }
  }

  // Check category (for Layer 2) - form.category is array or null
  if (filters.category && form.category !== null) {
    if (!Array.isArray(form.category) || !form.category.includes(filters.category)) {
      return false;
    }
  }

  // Check sector (for Layer 3) - form.sector is array or null
  if (filters.sector && form.sector !== null) {
    if (!Array.isArray(form.sector) || !form.sector.includes(filters.sector)) {
      return false;
    }
  }

  // Check employment type (for Layer 4) - form.employment is array or null
  if (filters.employment && form.employment !== null) {
    if (!Array.isArray(form.employment) || !form.employment.includes(filters.employment)) {
      return false;
    }
  }

  // Check search text
  if (filters.searchText) {
    const search = filters.searchText.toLowerCase();
    const formNo = form.form_no ? form.form_no.toLowerCase() : '';
    const formName = form.form_name ? form.form_name.toLowerCase() : '';
    if (!formNo.includes(search) && !formName.includes(search)) {
      return false;
    }
  }

  return true;
}

/**
 * Filter forms based on progressive layer display logic
 * @param {Array} formsData - All forms data
 * @param {Object} filters - Filter criteria
 * @returns {Object} - { filteredForms, showWarning }
 */
export function filterForms(formsData, filters) {
  const { visa, org, category, sector, employment } = filters;

  const isTokutei = visa === 'tokutei1' || visa === 'tokutei2';
  const isAgricultureOrFishery = sector === 'agriculture' || sector === 'fishery';
  const hasVisa = !!visa;
  const hasOrg = !!org;
  const hasCategory = !!category;
  const hasSector = !!sector;
  const hasEmployment = !!employment;

  // No selection → show all forms with warning
  if (!hasVisa) {
    return {
      filteredForms: formsData,
      showWarning: true
    };
  }

  // Progressive display: which layers to include
  const filteredForms = formsData.filter(form => {
    // Layer 1 (共通): always show when L0 is selected
    if (form.layer === 1) {
      return matchesFilter(form, filters);
    }

    // Layer 2 (機関): show only when L2 has values (org or category)
    if (form.layer === 2) {
      if (!hasOrg && !hasCategory) return false;
      return matchesFilter(form, filters);
    }

    // Layer 3 (分野): show only when L3 has value AND is tokutei
    if (form.layer === 3) {
      if (!isTokutei || !hasSector) return false;
      return matchesFilter(form, filters);
    }

    // Layer 4 (派遣): show only when L4 has value AND agri/fishery
    if (form.layer === 4) {
      if (!isTokutei || !isAgricultureOrFishery || !hasEmployment) return false;
      return matchesFilter(form, filters);
    }

    return matchesFilter(form, filters);
  });

  return {
    filteredForms,
    showWarning: false
  };
}

/**
 * Group forms by layer
 * @param {Array} forms - Array of form objects
 * @returns {Object} - Forms grouped by layer number
 */
export function groupByLayer(forms) {
  const grouped = {};
  forms.forEach(form => {
    if (!grouped[form.layer]) {
      grouped[form.layer] = [];
    }
    grouped[form.layer].push(form);
  });
  return grouped;
}

/**
 * Get layer description text
 * @param {number} layer - Layer number
 * @returns {string} - Layer description
 */
export function getLayerDescription(layer) {
  const descriptions = {
    1: '別記様式・参考様式・第1表',
    2: '第2表（所属機関に関する書類）',
    3: '分野参考様式・第3表',
    4: '派遣用書類',
  };
  return descriptions[layer] || '';
}

/**
 * Check if layer should be enabled based on filter state
 * @param {number} layer - Layer number
 * @param {Object} filters - Filter criteria
 * @returns {boolean} - Whether layer is enabled
 */
export function isLayerEnabled(layer, filters) {
  const { visa, sector } = filters;
  const isTokutei = visa === 'tokutei1' || visa === 'tokutei2';
  const isAgricultureOrFishery = sector === 'agriculture' || sector === 'fishery';

  switch (layer) {
    case 1:
      return !!visa;
    case 2:
      return !!visa;
    case 3:
      return isTokutei;
    case 4:
      return isTokutei && isAgricultureOrFishery;
    default:
      return true;
  }
}

/**
 * Get auto-checked forms based on filter criteria
 * Forms that match the filter should be automatically marked as 必須
 * @param {Array} formsData - All forms data
 * @param {Object} filters - Filter criteria
 * @returns {Object} - { formNo: true } for forms that should be auto-checked
 */
export function getAutoCheckedForms(formsData, filters) {
  const { filteredForms } = filterForms(formsData, filters);
  const autoChecked = {};

  filteredForms.forEach(form => {
    autoChecked[form.no] = true;
  });

  return autoChecked;
}

/**
 * Merge auto-checked forms with manual adjustments
 * @param {Object} autoChecked - Auto-checked forms from filter
 * @param {Object} manualOverrides - User's manual changes { formNo: true/false }
 * @returns {Object} - Final checked state
 */
export function mergeCheckedState(autoChecked, manualOverrides) {
  const result = { ...autoChecked };

  // Apply manual overrides
  Object.entries(manualOverrides).forEach(([formNo, isChecked]) => {
    if (isChecked === false) {
      // User unchecked - remove from result
      delete result[formNo];
    } else if (isChecked === true) {
      // User added manually
      result[formNo] = true;
    }
  });

  return result;
}

/**
 * Get all forms from enabled layers (for 追加表示)
 * Shows forms from broader enabled layers, but filtered by current selections.
 * E.g., selecting kaigo will only show kaigo-related forms, not all Layer 3 forms.
 * @param {Array} formsData - All forms data
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Forms from enabled layers matching current filter settings
 */
export function getFormsFromEnabledLayers(formsData, filters) {
  const enabledLayers = [];

  // Layer 1: enabled when visa selected
  if (isLayerEnabled(1, filters)) enabledLayers.push(1);
  // Layer 2: enabled when visa selected AND org or category has been chosen
  if (isLayerEnabled(2, filters) && (filters.org || filters.category)) enabledLayers.push(2);
  // Layer 3: enabled when tokutei AND sector has been chosen
  if (isLayerEnabled(3, filters) && filters.sector) enabledLayers.push(3);
  // Layer 4: enabled when tokutei + agri/fishery AND employment has been chosen
  if (isLayerEnabled(4, filters) && filters.employment) enabledLayers.push(4);

  if (enabledLayers.length === 0 && filters.visa) {
    enabledLayers.push(1);
  }

  // Filter by enabled layers AND apply matchesFilter to respect current selections
  return formsData.filter(form => enabledLayers.includes(form.layer) && matchesFilter(form, filters));
}
