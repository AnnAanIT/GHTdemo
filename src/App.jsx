import { useState, useRef, useCallback } from 'react';
import TabContent from './components/TabContent';
import AssemblyTabContent from './components/AssemblyTabContent';
import { shinseininForms } from './data/shinseininData';
import { shokkikanForms } from './data/shokkikanData';
import { hakenForms } from './data/hakenData';
import { visaTypes, sectors } from './data/formsData';
import './styles/App.css';

// 派遣先 documents only ever apply to 特定技能1号/2号 + 農業/漁業 + 派遣雇用形態,
// so the other visa/sector choices (and 機関種別・カテゴリー tags) are noise for this tab.
const HAKEN_VISA_OPTIONS = visaTypes.filter((v) => v.value === 'tokutei1' || v.value === 'tokutei2');
const HAKEN_SECTOR_OPTIONS = sectors.filter((s) => s.value === 'agriculture' || s.value === 'fishery');
const HAKEN_TAG_GROUPS = ['employment'];

const TABS = [
  { key: 'shinseinin', label: '申請人書類', storageKey: 'shinseinin-data', showSampleFile: true, showActions: true, formsDataProp: shinseininForms },
  { key: 'shokkikan', label: '所属機関書類', storageKey: 'shokkikan-data', showSampleFile: true, showActions: true, formsDataProp: shokkikanForms },
  { key: 'haken', label: '派遣先', storageKey: 'haken-data', showSampleFile: true, showActions: true, formsDataProp: hakenForms, visaOptions: HAKEN_VISA_OPTIONS, sectorOptions: HAKEN_SECTOR_OPTIONS, enabledTagGroups: HAKEN_TAG_GROUPS },
  { key: 'online', label: 'オンライン作成書類', storageKey: 'shinsei-shorui-data', showSampleFile: false, showActions: false, showAllTypes: true, showPreviewFile: true, formsDataProp: undefined },
  { key: 'assembly', label: '完成書類プレビュー', isAssembly: true },
];

function App() {
  const [activeTab, setActiveTab] = useState('shinseinin');
  const [hasChangesMap, setHasChangesMap] = useState({ shinseinin: false, shokkikan: false, haken: false, online: false, assembly: false });
  const tabRefs = useRef({});

  const handleHasChanges = useCallback((tabKey, val) => {
    setHasChangesMap(prev => prev[tabKey] === val ? prev : { ...prev, [tabKey]: val });
  }, []);

  const handleSave = () => {
    tabRefs.current[activeTab]?.save();
  };

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">ホーム</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">申請書類管理</span>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">申請書類管理</h1>
      </div>

      {/* Main card — tabs + content */}
      <div className="main-card">
        <div className="tabs">
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''} ${tab.isAssembly ? 'tab-summary' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {TABS.map((tab) => (
          <div key={tab.key} className="tab-panel" style={{ display: activeTab === tab.key ? 'block' : 'none' }}>
            {tab.isAssembly ? (
              <AssemblyTabContent
                ref={el => { tabRefs.current[tab.key] = el; }}
                isActive={activeTab === tab.key}
                onHasChangesChange={(val) => handleHasChanges(tab.key, val)}
                onSave={tab.key === activeTab ? handleSave : undefined}
                hasChanges={hasChangesMap[tab.key]}
              />
            ) : (
              <TabContent
                ref={el => { tabRefs.current[tab.key] = el; }}
                storageKey={tab.storageKey}
                showSampleFile={tab.showSampleFile}
                showActions={tab.showActions}
                showAllTypes={tab.showAllTypes || false}
                showPreviewFile={tab.showPreviewFile || false}
                formsDataProp={tab.formsDataProp}
                visaOptions={tab.visaOptions}
                sectorOptions={tab.sectorOptions}
                enabledTagGroups={tab.enabledTagGroups}
                onHasChangesChange={(val) => handleHasChanges(tab.key, val)}
                onSave={tab.key === activeTab ? handleSave : undefined}
                hasChanges={hasChangesMap[tab.key]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
