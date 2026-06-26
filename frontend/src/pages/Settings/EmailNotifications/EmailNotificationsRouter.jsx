import React, { useState } from 'react';
import EmailNotificationsDashboard from './EmailNotificationsDashboard';
import NotificationCategoryPage from './NotificationCategoryPage';
import EmailTemplateEditor from './EmailTemplateEditor';

export default function EmailNotificationsRouter() {
  // view: 'dashboard' | 'category' | 'editor'
  const [view, setView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const goToDashboard = () => {
    setSelectedCategory(null);
    setSelectedNotification(null);
    setView('dashboard');
  };

  const goToCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedNotification(null);
    setView('category');
  };

  const goToEditor = (notification) => {
    setSelectedNotification(notification);
    setView('editor');
  };

  return (
    <div className="h-full w-full bg-stone-50 overflow-y-auto">
      {view === 'dashboard' && (
        <EmailNotificationsDashboard 
          onSelectCategory={goToCategory} 
        />
      )}
      
      {view === 'category' && (
        <NotificationCategoryPage 
          categoryName={selectedCategory} 
          onBack={goToDashboard}
          onEdit={goToEditor}
        />
      )}

      {view === 'editor' && (
        <EmailTemplateEditor 
          notification={selectedNotification}
          categoryName={selectedCategory}
          onBack={() => setView('category')}
        />
      )}
    </div>
  );
}
