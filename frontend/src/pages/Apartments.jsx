import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Home, MapPin, Calendar, 
  Users, Wrench, FileText, AlertTriangle, PieChart, BarChart3,
  Calculator, Target, Clock, Building, Wallet, Receipt,
  Phone, Mail, Bell, Settings, Filter, Download, Eye,
  ChevronRight, Activity, Zap, Shield, ArrowUpRight
} from 'lucide-react';

const PropertyPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');

  // Mock data - replace with real API calls
  const portfolioStats = {
    totalValue: 2850000,
    totalProperties: 12,
    monthlyIncome: 18500,
    totalExpenses: 4200,
    netCashFlow: 14300,
    averageROI: 8.4,
    occupancyRate: 91.7,
    portfolioGrowth: 12.3
  };

  const propertyTypes = [
    { type: 'Single Family', count: 5, value: 1200000, percentage: 42.1 },
    { type: 'Apartments', count: 4, value: 980000, percentage: 34.4 },
    { type: 'Condos', count: 2, value: 450000, percentage: 15.8 },
    { type: 'Townhouses', count: 1, value: 220000, percentage: 7.7 }
  ];

  const recentActivities = [
    { id: 1, type: 'rent', property: 'Oak Street Apartment', amount: 2400, date: '2024-06-28', tenant: 'Sarah Johnson' },
    { id: 2, type: 'maintenance', property: 'Pine View House', amount: -350, date: '2024-06-26', description: 'HVAC Repair' },
    { id: 3, type: 'rent', property: 'Downtown Condo', amount: 1800, date: '2024-06-25', tenant: 'Mike Chen' },
    { id: 4, type: 'expense', property: 'Maple Drive Duplex', amount: -125, date: '2024-06-24', description: 'Property Insurance' }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Property Inspection - Oak Street', due: '2024-07-05', priority: 'high' },
    { id: 2, task: 'Lease Renewal - Downtown Condo', due: '2024-07-12', priority: 'medium' },
    { id: 3, task: 'Maintenance Check - Pine View', due: '2024-07-18', priority: 'low' },
    { id: 4, task: 'Tax Document Review', due: '2024-07-25', priority: 'medium' }
  ];

  const topPerformers = [
    { property: 'Oak Street Apartment', roi: 12.4, cashFlow: 2050, occupancy: 100 },
    { property: 'Downtown Condo', roi: 10.8, cashFlow: 1625, occupancy: 95 },
    { property: 'Pine View House', roi: 9.2, cashFlow: 1850, occupancy: 100 }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {/* <div>
            <h1 className="text-3xl font-thin text-gray-100">Property Portfolio</h1>
            <p className="text-gray-400 mt-1">Comprehensive real estate investment management</p>
          </div> */}
          <div className="flex items-center space-x-3">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-black/60 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'properties', label: 'Properties', icon: Building },
            { id: 'financial', label: 'Financial', icon: DollarSign },
            { id: 'tenants', label: 'Tenants', icon: Users },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-black/60'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-thin">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-black/60 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{portfolioStats.portfolioGrowth}%</span>
                </div>
              </div>
              <div className="text-2xl font-thin text-white mb-1">
                ${portfolioStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Portfolio Value</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-black/60 rounded-lg">
                  <Home className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm text-gray-400">Properties</div>
              </div>
              <div className="text-2xl font-thin text-white mb-1">
                {portfolioStats.totalProperties}
              </div>
              <div className="text-sm text-gray-400">Active Properties</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-black/60 rounded-lg">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center text-emerald-400 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="text-2xl font-thin text-white mb-1">
                ${portfolioStats.netCashFlow.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Monthly Net Cash Flow</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-black/60 rounded-lg">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-sm text-gray-400">ROI</div>
              </div>
              <div className="text-2xl font-thin text-white mb-1">
                {portfolioStats.averageROI}%
              </div>
              <div className="text-sm text-gray-400">Average ROI</div>
            </div>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Distribution */}
            <div className="lg:col-span-2 bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-thin text-white">Property Distribution</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {propertyTypes.map((type, index) => {
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500'];
                  return (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${colors[index]}`}></div>
                        <div>
                          <div className="text-white font-thin">{type.type}</div>
                          <div className="text-sm text-gray-400">{type.count} properties</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-thin">${type.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{type.percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-thin text-white">Recent Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      activity.type === 'rent' ? 'bg-green-900' :
                      activity.type === 'maintenance' ? 'bg-orange-900' : 'bg-red-900'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'rent' ? 'bg-green-400' :
                        activity.type === 'maintenance' ? 'bg-orange-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{activity.property}</div>
                      <div className="text-xs text-gray-400">
                        {activity.tenant || activity.description}
                      </div>
                      <div className="text-xs text-gray-500">{activity.date}</div>
                    </div>
                    <div className={`text-sm font-thin ${
                      activity.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-thin text-white">Top Performers</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-4">
                {topPerformers.map((property, index) => (
                  <div key={property.property} className="p-4 bg-black/60 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-thin text-white">{property.property}</div>
                      <div className="text-sm text-green-400 font-thin">{property.roi}% ROI</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Cash Flow</div>
                        <div className="text-white font-thin">${property.cashFlow}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Occupancy</div>
                        <div className="text-white font-thin">{property.occupancy}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-thin text-white">Upcoming Tasks</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-black/60 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <div>
                        <div className="text-sm text-white font-thin">{task.task}</div>
                        <div className="text-xs text-gray-400">{task.due}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-thin text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FileText, label: 'Generate Report', color: 'text-blue-400' },
                { icon: Calculator, label: 'ROI Calculator', color: 'text-green-400' },
                { icon: Bell, label: 'Set Alerts', color: 'text-yellow-400' },
                { icon: Shield, label: 'Risk Analysis', color: 'text-red-400' }
              ].map(action => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.label}
                    className="p-4 bg-black/60 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center space-y-2"
                  >
                    <IconComponent className={`w-6 h-6 ${action.color}`} />
                    <span className="text-sm text-gray-300">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-black/60 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-thin text-white mb-4">Portfolio Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-black/60 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue Trends Chart</p>
                </div>
              </div>
              <div className="h-64 bg-black/60 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <PieChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Expense Breakdown Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab !== 'overview' && activeTab !== 'analytics' && (
        <div className="bg-black/60 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-gray-400">
            <Building className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-thin text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p>This section would contain detailed {activeTab} management features.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPortfolio;