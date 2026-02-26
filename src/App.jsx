import { useState, useRef, useCallback } from 'react';
import TabContent from './components/TabContent';
import { shinseininForms } from './data/shinseininData';
import { shokkikanForms } from './data/shokkikanData';
import './styles/App.css';

const TABS = [
  { key: 'shinseinin', label: '申請人書類', storageKey: 'shinseinin-data', showSampleFile: true, showActions: true, formsDataProp: shinseininForms },
  { key: 'shokkikan', label: '所属機関書類', storageKey: 'shokkikan-data', showSampleFile: true, showActions: true, formsDataProp: shokkikanForms },
  { key: 'online', label: 'オンライン作成書類', storageKey: 'shinsei-shorui-data', showSampleFile: false, showActions: false, formsDataProp: undefined },
];

function App() {
  const [activeTab, setActiveTab] = useState('shinseinin');
  const [hasChangesMap, setHasChangesMap] = useState({ shinseinin: false, shokkikan: false, online: false });
  const tabRefs = useRef({});

  const handleHasChanges = useCallback((tabKey, val) => {
    setHasChangesMap(prev => prev[tabKey] === val ? prev : { ...prev, [tabKey]: val });
  }, []);

  const handleSave = () => {
    tabRefs.current[activeTab]?.save();
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">申請書類管理</h1>
        <button
          className={`btn-save ${hasChangesMap[activeTab] ? 'has-changes' : ''}`}
          onClick={handleSave}
        >
          保存
        </button>
      </div>

      {/* Main card — tabs + content */}
      <div className="main-card">
        <div className="tabs">
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {TABS.map((tab) => (
          <div key={tab.key} className="tab-panel" style={{ display: activeTab === tab.key ? 'block' : 'none' }}>
            <TabContent
              ref={el => { tabRefs.current[tab.key] = el; }}
              storageKey={tab.storageKey}
              showSampleFile={tab.showSampleFile}
              showActions={tab.showActions}
              formsDataProp={tab.formsDataProp}
              onHasChangesChange={(val) => handleHasChanges(tab.key, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
