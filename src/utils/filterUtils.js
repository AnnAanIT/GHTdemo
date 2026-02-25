// Filter utility functions — 2 Layer + Tags architecture
import { TAG_DEFINITIONS } from '../data/tags';

/**
 * Check if a form matches base filters (visa + appType + sector)
 */
function matchesBaseFilters(form, filters) {
  const { visa, appType, sector, searchText } = filters;

  // Visa check
  if (visa && form.visa !== null) {
    if (!Array.isArray(form.visa) || !form.visa.includes(visa)) return false;
  }

  // AppType check
  if (appType && form.appType !== null) {
    if (!Array.isArray(form.appType) || !form.appType.includes(appType)) return false;
  }

  // Sector check — form.sector null = no sector restriction
  if (sector && form.sector !== null) {
    if (!Array.isArray(form.sector) || !form.sector.includes(sector)) return false;
  }

  // Search text
  if (searchText) {
    const search = searchText.toLowerCase();
    const formNo = form.form_no ? form.form_no.toLowerCase() : '';
    const formName = form.form_name ? form.form_name.toLowerCase() : '';
    if (!formNo.includes(search) && !formName.includes(search)) return false;
  }

  return true;
}

/**
 * Check if a form's tags are satisfied by selectedTags.
 * Logic: AND between tag groups, OR within each group.
 *
 * - tags: ["common"] → always pass
 * - tags: [] → always pass
 * - Group not selected by user (未定) → wildcard (always pass for that group)
 * - tags: ["org:hojin", "category:3", "category:4"]
 *     → needs org_type group satisfied AND category group satisfied
 */
function matchesTags(formTags, selectedTags) {
  if (formTags.length === 0) return true;
  if (formTags.includes('common')) return true;

  // Group form tags by their tag group
  const formTagsByGroup = {};
  formTags.forEach(tag => {
    const def = TAG_DEFINITIONS[tag];
    if (def) {
      const group = def.group;
      if (!formTagsByGroup[group]) formTagsByGroup[group] = [];
      formTagsByGroup[group].push(tag);
    }
  });

  // Which groups has the user selected tags for?
  const userSelectedGroups = new Set();
  selectedTags.forEach(tag => {
    const def = TAG_DEFINITIONS[tag];
    if (def) userSelectedGroups.add(def.group);
  });

  // AND between groups: every group must either be wildcard (未定) or have a match
  return Object.entries(formTagsByGroup).every(([group, groupTags]) => {
    // User hasn't selected any tag from this group → wildcard (pass)
    if (!userSelectedGroups.has(group)) return true;
    // User has selected → must match at least one
    return groupTags.some(tag => selectedTags.includes(tag));
  });
}

/**
 * Filter forms based on 2-Layer + Tags logic
 * @returns {{ filteredForms: Array, showWarning: boolean }}
 */
export function filterForms(formsData, filters, selectedTags = []) {
  const { visa, sector } = filters;
  const isTokutei = visa === 'tokutei1' || visa === 'tokutei2';

  // No visa selected → show all with warning
  if (!visa) {
    return { filteredForms: formsData, showWarning: true };
  }

  const filteredForms = formsData.filter(form => {
    // Base filter match required
    if (!matchesBaseFilters(form, filters)) return false;

    // Sector forms (form_group B with sector) only show when sector is selected
    if (form.sector !== null) {
      if (!isTokutei || !sector) return false;
    }

    // Tag check
    if (!matchesTags(form.tags, selectedTags)) return false;

    return true;
  });

  return { filteredForms, showWarning: false };
}

/**
 * Group forms by form_group (A, B, C)
 */
export function groupByFormGroup(forms) {
  const grouped = {};
  forms.forEach(form => {
    const g = form.form_group;
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(form);
  });
  return grouped;
}

/**
 * Get group description text
 */
export function getGroupDescription(group) {
  const descriptions = {
    A: '別記様式・参考様式・第1表',
    B: '分野参考様式・第3表',
    C: '第2表・派遣用書類',
  };
  return descriptions[group] || '';
}

/**
 * Get auto-checked forms — all forms that pass the filter are auto-checked
 */
export function getAutoCheckedForms(formsData, filters, selectedTags = []) {
  const { filteredForms } = filterForms(formsData, filters, selectedTags);
  const autoChecked = {};
  filteredForms.forEach(form => {
    autoChecked[form.no] = true;
  });
  return autoChecked;
}

/**
 * Merge auto-checked forms with manual overrides
 */
export function mergeCheckedState(autoChecked, manualOverrides) {
  const result = { ...autoChecked };

  Object.entries(manualOverrides).forEach(([formNo, isChecked]) => {
    if (isChecked === false) {
      delete result[formNo];
    } else if (isChecked === true) {
      result[formNo] = true;
    }
  });

  return result;
}
