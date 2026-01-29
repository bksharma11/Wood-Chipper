
import React, { useState, useEffect } from 'react';
import { NotificationConfig } from '../../types';
import { db } from '../../firebase';
import { ref, set, push, remove } from 'firebase/database';
import NeonCard from '../NeonCard';
import { handleFirebaseError } from '../../utils';

interface SystemNotificationProps {
  notifications: NotificationConfig[];
}

const FONT_OPTIONS = [
  { value: 'orbitron', label: 'Orbitron (Sci-Fi)' },
  { value: 'font-sans', label: 'Inter (Modern)' },
  { value: 'font-serif', label: 'Default Serif' }
];

const SIZE_OPTIONS = [
  { value: 'text-xs', label: 'Extra Small' },
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' }
];

const DEFAULT_NOTIFICATION: Omit<NotificationConfig, 'id'> = {
  text: '',
  font: 'orbitron',
  size: 'text-sm',
  duration: 20,
  pause: 3
};

const SystemNotification: React.FC<SystemNotificationProps> = ({ notifications }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationConfig | null>(null);
  const [formData, setFormData] = useState<Omit<NotificationConfig, 'id'>>(DEFAULT_NOTIFICATION);

  useEffect(() => {
    if (editingNotification) {
      setFormData({
        text: editingNotification.text,
        font: editingNotification.font,
        size: editingNotification.size,
        duration: editingNotification.duration,
        pause: editingNotification.pause
      });
      setIsFormVisible(true);
    } else {
      setFormData(DEFAULT_NOTIFICATION);
    }
  }, [editingNotification]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.text) {
      alert("Notification text cannot be empty.");
      return;
    }

    const path = editingNotification
      ? `notifications/${editingNotification.id}`
      : `notifications/${push(ref(db, 'notifications')).key}`;

    set(ref(db, path), formData)
      .then(() => {
        alert("Notification saved successfully!");
        handleCancel();
      })
      .catch((err) => alert("Error: " + err.message));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      remove(ref(db, `notifications/${id}`))
        .then(() => alert("Notification deleted."))
        .catch(handleFirebaseError);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingNotification(null);
    setFormData(DEFAULT_NOTIFICATION);
  };

  const handleAddNew = () => {
    setEditingNotification(null);
    setFormData(DEFAULT_NOTIFICATION);
    setIsFormVisible(true);
  }

  return (
    <NeonCard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold orbitron text-slate-200">System Notification Banners</h2>
        {!isFormVisible && (
          <button onClick={handleAddNew} className="px-4 py-2 text-xs font-bold orbitron uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/40 transition-colors">
            + Add New
          </button>
        )}
      </div>

      {isFormVisible && (
        <NeonCard className="bg-slate-900/50 border-slate-700/50">
          <h3 className="font-bold orbitron text-slate-300 mb-4">{editingNotification ? 'Edit Notification' : 'Add New Notification'}</h3>

          <textarea
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white h-20"
            placeholder="Scrolling text message..."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <select value={formData.font} onChange={(e) => handleInputChange('font', e.target.value)} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs">
              {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={formData.size} onChange={(e) => handleInputChange('size', e.target.value)} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs">
              {SIZE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="number" value={formData.duration} min="5" onChange={(e) => handleInputChange('duration', Number(e.target.value))} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs" title="Scroll Duration (seconds)" />
            <input type="number" value={formData.pause} min="0" onChange={(e) => handleInputChange('pause', Number(e.target.value))} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs" title="Pause Between Scrolls (seconds)" />
          </div>

          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-slate-700/50">
            <button onClick={handleCancel} className="px-4 py-2 text-xs font-bold orbitron uppercase bg-slate-600/20 text-slate-300 border border-slate-500/30 rounded-lg hover:bg-slate-600/40 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-xs font-bold orbitron uppercase bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/40 transition-colors">Save</button>
          </div>
        </NeonCard>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-4">No system notifications found.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-slate-800">
              <p className={`truncate ${n.size} ${n.font} text-slate-300`}>{n.text}</p>
              <div className="flex space-x-4 flex-shrink-0 ml-4">
                <button onClick={() => setEditingNotification(n)} className="text-cyan-400 text-xs font-bold hover:underline">EDIT</button>
                <button onClick={() => handleDelete(n.id)} className="text-red-500 text-xs font-bold hover:underline">DELETE</button>
              </div>
            </div>
          ))
        )}
      </div>
    </NeonCard>
  );
};

export default SystemNotification;
