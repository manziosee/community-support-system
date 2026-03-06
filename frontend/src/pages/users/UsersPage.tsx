import React from 'react';
import { useTranslation } from 'react-i18next';

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <p className="text-gray-600 mt-2">This page is under construction.</p>
    </div>
  );
};

export default UsersPage;