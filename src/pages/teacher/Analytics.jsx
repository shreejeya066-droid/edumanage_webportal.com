import React from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const Analytics = () => {
    const { user } = useAuth();

    // --- Power BI Configuration ---
    // PASTE YOUR POWER BI EMBED URL HERE
    // Ensure it is a valid "Publish to Web" or "Website or Portal" link.
    const POWER_BI_EMBED_URL = "https://app.powerbi.com/reportEmbed?reportId=18f2d481-a684-4b3d-8ce3-f897d6ea99b1&autoAuth=true&ctid=406a6e9a-2c6d-4cd4-b5fc-299c924534e7";

    // Access Control Fallback
    if (user && !['teacher', 'admin'].includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Access Denied</h3>
                    <p>You do not have permission to view the Analysis Dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
                <p className="text-gray-500">Live academic performance data and insights from Power BI.</p>
            </div>

            {/* Power BI Embed Section */}
            <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-gray-200">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 19h4v-7H4v7zm6 0h4V9h-4v10zm6 0h4v-3h-4v3zM4 5v2h16V5H4z" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Live Power BI Report</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-white border px-2 py-1 rounded">
                        Live Data
                    </span>
                </div>

                {/* Responsive Iframe Container */}
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gray-100">
                    {POWER_BI_EMBED_URL.includes('0000') ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <p className="mb-2 font-medium">Power BI Configuration Required</p>
                            <p className="text-sm">Please update <code>POWER_BI_EMBED_URL</code> in code with your dashboard link.</p>
                        </div>
                    ) : (
                        <iframe
                            title="Analytics Dashboard"
                            width="100%"
                            height="100%"
                            src={POWER_BI_EMBED_URL}
                            frameBorder="0"
                            allowFullScreen={true}
                            className="block"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

