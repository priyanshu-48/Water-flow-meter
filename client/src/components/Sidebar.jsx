import React from 'react';
import { 
  Droplets, 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  Settings, 
  Home,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/', active: true },
    { icon: Droplets, label: 'Flow Monitor', path: '/flow' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-700 to-primary-800 
        transform transition-transform duration-300 ease-in-out z-50
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-white font-semibold text-lg">FlowMeter</h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600">
          <div className="text-center text-primary-200 text-sm">
            <p>Sensor Status: <span className="text-green-400">Active</span></p>
            <p className="mt-1">Last updated: 2 min ago</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
