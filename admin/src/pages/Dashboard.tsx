import { useEffect, useState } from "react";
import { Users, UserCheck, TrendingUp, Loader2, Target, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  type PieLabelRenderProps,
} from "recharts";
import api from "../lib/api";
import type { Stats } from "../types";

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  converted: "#10b981",
};

const TYPE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

// Custom label for pie chart
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const ri = typeof innerRadius === "number" ? innerRadius : 0;
  const ro = typeof outerRadius === "number" ? outerRadius : 0;
  const ma = typeof midAngle === "number" ? midAngle : 0;
  const cxn = typeof cx === "number" ? cx : 0;
  const cyn = typeof cy === "number" ? cy : 0;
  // Position label OUTSIDE the ring
  const radius = ro + 35;
  const x = cxn + radius * Math.cos(-ma * RADIAN);
  const y = cyn + radius * Math.sin(-ma * RADIAN);
  return (
    <text x={x} y={y} fill="#4b5563" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/leads/stats")
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  const statusPieData = stats?.statusCounts
    ? [
        { name: "New", value: stats.statusCounts.new ?? 0, color: STATUS_COLORS.new },
        { name: "Contacted", value: stats.statusCounts.contacted ?? 0, color: STATUS_COLORS.contacted },
        { name: "Converted", value: stats.statusCounts.converted ?? 0, color: STATUS_COLORS.converted },
      ].filter((d) => d.value > 0)
    : [];

  const cards = [
    {
      label: "Total Leads",
      value: stats?.totalLeads ?? 0,
      icon: Users,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "+12%",
    },
    {
      label: "New Today",
      value: stats?.newLeadsToday ?? 0,
      icon: UserCheck,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      trend: "Today",
    },
    {
      label: "Conversion Rate",
      value: `${stats?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: "Converted",
    },
    {
      label: "Contacted",
      value: stats?.statusCounts?.contacted ?? 0,
      icon: Activity,
      color: "text-amber-600",
      iconBg: "bg-amber-100",
      trend: "In Progress",
    },
    {
      label: "Converted",
      value: stats?.statusCounts?.converted ?? 0,
      icon: Target,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      trend: "Closed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of your workspace platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3"
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                <c.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${c.color}`} />
              </div>
              <span className="text-xs text-gray-400 font-medium">{c.trend}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart - Leads over 7 days */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Leads — Last 7 Days</h2>
            <p className="text-xs text-gray-400 mt-0.5">Daily enquiry volume</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.leadsByDay ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Leads"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#leadGrad)"
                dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Lead Status</h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribution by stage</p>
          </div>
          {statusPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {statusPieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[170px] flex items-center justify-center text-xs text-gray-400">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar Chart - Top Workspaces */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Top Workspaces</h2>
            <p className="text-xs text-gray-400 mt-0.5">By number of enquiries</p>
          </div>
          {(stats?.topWorkspaces ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats?.topWorkspaces}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + "…" : v}
                />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="leads" name="Leads" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">
              No data yet
            </div>
          )}
        </div>

        {/* Pie / Bar Chart - Workspace Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Workspace Type Interest</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enquiries by workspace type</p>
          </div>
          {(stats?.typeDistribution ?? []).length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats?.typeDistribution} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: string) => v.split(" ")[0]}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="value" name="Enquiries" radius={[6, 6, 0, 0]} barSize={28}>
                    {(stats?.typeDistribution ?? []).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {(stats?.typeDistribution ?? []).map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                    {d.name} <span className="font-semibold text-gray-700">{d.value}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-xs text-gray-400">
              No type data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
