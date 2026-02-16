import { useState, useEffect } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { getStudentProgress, getQuizHistory } from '../../services/AnalyticsService';
import { Award, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [progressData, setProgressData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progress, history] = await Promise.all([
                    getStudentProgress(user.id),
                    getQuizHistory(user.id)
                ]);
                setProgressData(progress);
                setHistoryData(history);
            } catch (error) {
                console.error("Failed to fetch student analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat data progress...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Halo, {user.name}! 👋</h1>
                    <p className="text-gray-500 dark:text-gray-400">Siap lanjutkan belajar hari ini?</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Materi Selesai</p>
                        <h3 className="text-2xl font-bold">4 / 12</h3>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-purple-100 text-sm">Rata-rata Skor</p>
                        <h3 className="text-2xl font-bold">82.5</h3>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-green-100 text-sm">Jam Belajar</p>
                        <h3 className="text-2xl font-bold">12.5 Jam</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance Radar Chart */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analisis Kemampuan</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={progressData} height={320}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                    name="Skor Saya"
                                    dataKey="score"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fill="#3B82F6"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Rata-rata Siswa"
                                    dataKey="avg"
                                    stroke="#9CA3AF"
                                    strokeWidth={2}
                                    fill="transparent"
                                    strokeDasharray="3 3"
                                />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score History Line Chart */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riwayat Skor Quiz</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
