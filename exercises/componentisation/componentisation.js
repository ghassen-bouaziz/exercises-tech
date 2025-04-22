// javascript// Componentization 101 Exercise
//
// This Dashboard component has several issues:
// 1. It's a monolithic component that does too many things
// 2. Contains multiple UI sections that should be separate components
// 3. Mixes data fetching with presentation
// 4. Has repeated UI patterns that could be componentized
//
// Your task: Refactor this component by:
// 1. Breaking it down into smaller, focused components
// 2. Identifying reusable UI patterns
// 3. Separating concerns between container and presentation components
// 4. Improving overall code organization

import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const { ok, data } = await api.get('/dashboard/stats');
      if (!ok) throw new Error('Failed to fetch stats');
      setStats(data);
    } catch (err) {
      setError('Failed to fetch stats');
    }
  }

  const fetchRecentUsers = async () => {
    try {
      const { ok, data } = await api.post('/users/search', {
        query: 'recent',
      });
      if (!ok) throw new Error('Failed to fetch recent users');
      setRecentUsers(data);
    } catch (err) {
      setError('Failed to fetch recent users');
    }
  }

  const fetchPopularProducts = async () => {
    try {
      const { ok, data, error } = await api.get('/products/search', {
        query: 'popular'
      });
      if (!ok) throw new Error(error || 'Failed to fetch popular products');
      setPopularProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch popular products');
    }
  }

  const fetchNotifications = async () => {
    try {
      const { ok, data } = await api.post('/notifications/search', {
        query: 'all'
      });
      if (!ok) throw new Error('Failed to fetch notifications');
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      await fetchStats();
      await fetchRecentUsers();
      await fetchPopularProducts();
      await fetchNotifications();
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  const cardList = [
    {
      title: 'Total Users',
      color: 'blue',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      key: 'totalUsers'
    },
    {
      title: 'Active Users',
      color: 'green',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      key: 'activeUsers'
    },
    {
      title: 'Pending Orders',
      color: 'purple',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      key: 'pendingOrders'
    },
    {
      title: 'Total Revenue',
      color: 'yellow',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      key: 'totalRevenue'
    }
  ]

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardList.map(card => (
          <Card title={card.title} color={card.color} icon={card.icon} value={stats[card.key] || 0} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <SectionTitle title="Recent Users" />
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map(user => <UserRow user={user} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <SectionTitle title="Notifications" />
            <div className="p-6">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No new notifications</p>
                ) : (
                  notifications.map(notification => <NotificationRow key={notification.id} notification={notification} />)
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-8">
            <SectionTitle title="Popular Products" />
            <div className="p-6">
              <div className="space-y-4">
                {popularProducts.map(product => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => {
  return <div className="p-6 border-b">
    <h2 className="text-xl font-semibold">{title}</h2>
  </div>
};

const Card = ({ title, color, icon, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-500 mr-4`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const NotificationRow = ({ notification, setNotifications }) => {
  const markAsRead = async () => {
    try {
      const { ok } = await api.put(`/notifications/${notification.id}`, { read: true });
      if (!ok) throw new Error('Failed to mark notification as read');
      setNotifications(prevNotifications => prevNotifications.map(notification =>
        notification.id === notification.id
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };
  return (
    <div
      key={notification.id}
      className={`p-4 border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-blue-50'
        }`}
    >
      <div className="flex justify-between">
        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
          {notification.message}
        </p>
        {!notification.read && (
          <button
            className="text-blue-500 text-xs hover:text-blue-700"
            onClick={markAsRead}
          >
            Mark as read
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(notification.date).toLocaleString()}
      </p>
    </div>
  );
};

const ProductRow = ({ product }) => {
  return (
    <div key={product.id} className="flex items-center">
      <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
        <img src={product.image || 'https://via.placeholder.com/48'} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-900">{product.name}</p>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        {product.sales} sales
      </div>
    </div>
  );
};
const UserRow = ({ user }) => {
  return (
    <tr key={user.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
            <img src={user.avatar || 'https://via.placeholder.com/40'} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {new Date(user.joinedAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {user.status}
        </span>
      </td>
    </tr>
  );
};
export default Dashboard;