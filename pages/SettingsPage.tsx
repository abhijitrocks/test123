
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const SettingsPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fairshare-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Data exported successfully!', 'success');
    } catch (error) {
      addToast('Failed to export data.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        if(window.confirm("Are you sure? Importing will overwrite all existing data.")) {
            setIsImporting(true);
            try {
                await api.importData(content);
                addToast('Data imported successfully! The page will now reload.', 'success');
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                addToast('Failed to import data. The file might be corrupted or in the wrong format.', 'error');
            } finally {
                setIsImporting(false);
            }
        }
      }
    };
    reader.readAsText(file);
    // Reset file input to allow importing the same file again
    event.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <h2 className="text-xl font-bold mb-4">Data Management</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Export your data as a JSON file for backup, or import a previously exported file to restore your groups and expenses.
        </p>
        <div className="flex space-x-4">
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
          <label
            htmlFor="import-file"
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer ${isImporting ? 'opacity-50' : ''}`}
            >
            {isImporting ? 'Importing...' : 'Import Data'}
          </label>
          <input
            id="import-file"
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
          />
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
