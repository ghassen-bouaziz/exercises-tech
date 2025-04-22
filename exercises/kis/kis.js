// KISS Principle Exercise
//
// This component violates the KISS principle in several ways:
// - It uses unnecessary abstractions (useCallback, useMemo)
// - It has complex state management that's hard to follow
// - It mixes concerns between data fetching, processing, and UI rendering
//
// Your task: Simplify this component by:
// 1. Removing unnecessary abstractions 
// 2. Streamlining the data fetching
// 3. Making the code more straightforward
// 4. Keeping the existing functionality and Tailwind styling

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from './api';

const UserStatistics = ({ userId, preferences }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      const { ok, data, error } = await api.get(`/api/users/${userId}`);
      if (!ok) throw new Error(error);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }

  const getTransactions = async () => {
    try {
      const { ok, data, error } = await api.post(`/api/transactions`, { userId });
      if (!ok) throw new Error(error);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  }

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      await getUser();
      await getTransactions();
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const averageSpend = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
  const topCategory = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  const userTier = user?.totalSpent > 10000 ? 'Platinum' : user?.totalSpent > 5000 ? 'Gold' : 'Silver';

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const getStyle = () => {
    if (userTier === 'Platinum') {
      return 'bg-purple-200 text-purple-800';
    }
    if (userTier === 'Gold') {
      return 'bg-yellow-200 text-yellow-800';
    }
    return 'bg-gray-200 text-gray-800';

  }

  return (
    <div className={`bg-gray-800 dark:bg-white shadow-lg rounded-lg p-6 m-4 transition-all duration-300 ${preferences?.animations ? 'animate-fade-in' : ''}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <h3 className={"text-white dark:text-gray-800 font-bold text-xl mb-4"}>User Statistics</h3>
          <div className={"text-gray-300 dark:text-gray-600"}>
            <p className="mb-2">Average Spend: {preferences?.currencySymbol || '$'}{averageSpend}</p>
            <p className="mb-2">Top Category: {topCategory}</p>
            <p className="mb-2">User Tier:
              <span className={`ml-2 px-2 py-1 rounded text-xs ${getStyle()}`}>
                {userTier}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatistics;
