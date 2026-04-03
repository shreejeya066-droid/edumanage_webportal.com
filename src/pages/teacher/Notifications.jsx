import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Bell, Clock, FileText, Loader2 } from 'lucide-react';
import { fetchNotifications } from '../../services/api';

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (err) {
                console.error("Failed to load notifications", err);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    // Helper for time formatting
    const getTimeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            
            {notifications.length === 0 ? (
                <Card className="p-12 text-center text-gray-500 bg-gray-50/50 border-dashed">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700">No Notifications</h3>
                    <p>There are currently no student requests or updates.</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {notifications.map((notif) => (
                        <Card key={notif._id} className="transition-all hover:bg-gray-50 flex flex-row items-center p-4">
                            <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                {notif.type.includes('Profile') ? <FileText className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900">
                                        {notif.studentName} <span className="text-gray-500 text-sm">({notif.studentId})</span>
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {getTimeAgo(notif.timestamp || notif.createdAt)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">{notif.message}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        notif.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        notif.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {notif.status.charAt(0) + notif.status.slice(1)}
                                    </span>
                                    <span className="text-xs text-gray-400">• {notif.type}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
