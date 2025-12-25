
import React, { useState, useEffect } from 'react';
import { NotificationConfig } from '../../types';
import { db } from '../../firebase';
import { ref, set, push, remove } from 'firebase/database';

interface SystemNotificationProps {
  notifications: NotificationConfig[];
}

const FONT_OPTIONS = [
  { value: 'orbitron', label: 'Orbitron (Sci-Fi)' },
  { value: 'inter', label: 'Inter (Modern)' },
  { value: 'dancing-script', label: 'Dancing Script (Cursive)' }
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
        .catch((err) => alert("Error: " + err.message));
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
    <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold orbitron text-slate-200">System Notification Banners</h2>
        {!isFormVisible && (
          <button onClick={handleAddNew} className="silver-gradient text-slate-900 px-4 py-1 rounded text-xs font-bold uppercase orbitron">
            + Add New
          </button>
        )}
      </div>

      {isFormVisible && (
        <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg space-y-4">
          <h3 className="font-bold orbitron text-slate-300">{editingNotification ? 'Edit Notification' : 'Add New Notification'}</h3>
          
          <textarea 
            value={formData.text} 
            onChange={(e) => handleInputChange('text', e.target.value)} 
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white h-20" 
            placeholder="Scrolling text message..." 
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <select value={formData.font} onChange={(e) => handleInputChange('font', e.target.value)} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs">
              {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={formData.size} onChange={(e) => handleInputChange('size', e.target.value)} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs">
              {SIZE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="number" value={formData.duration} min="5" onChange={(e) => handleInputChange('duration', Number(e.target.value))} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs" title="Scroll Duration (seconds)" />
            <input type="number" value={formData.pause} min="0" onChange={(e) => handleInputChange('pause', Number(e.target.value))} className="bg-slate-800 border border-slate-600 p-2 rounded text-white text-xs" title="Pause Between Scrolls (seconds)" />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button onClick={handleCancel} className="bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold uppercase orbitron">Cancel</button>
            <button onClick={handleSave} className="bg-green-700 text-white px-4 py-2 rounded text-xs font-bold uppercase orbitron">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-4">No system notifications found.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-slate-800">
              <p className={`truncate ${n.size} ${n.font} text-slate-300`}>{n.text}</p>
              <div className="flex space-x-2 flex-shrink-0 ml-4">
                <button onClick={() => setEditingNotification(n)} className="text-blue-400 text-xs font-bold hover:underline">EDIT</button>
                <button onClick={() => handleDelete(n.id)} className="text-red-500 text-xs font-bold hover:underline">DELETE</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SystemNotification;
