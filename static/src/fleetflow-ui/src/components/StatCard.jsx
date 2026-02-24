









export default function StatCard({ title, value, icon: Icon, trend, trendColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
                {trend &&
        <span className={`text-sm font-semibold ${trendColor || 'text-green-600'}`}>
                        {trend}
                    </span>
        }
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
        </div>);

}