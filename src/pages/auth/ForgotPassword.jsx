import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Send, CheckCircle, RefreshCcw } from 'lucide-react';

export const ForgotPassword = () => {
    const { forgotPasswordAsync } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [debugToken, setDebugToken] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Please enter your registered email address.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await forgotPasswordAsync(email);
            // Always show the same message for security (don't reveal if email exists)
            setMessage(result.message || "If this email is registered, a reset link has been sent.");
            if (result.debugToken) {
                setDebugToken(result.debugToken);
            }
            setEmail('');
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl border-t-4 border-indigo-600">
                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2">Enter your registered email address and we'll send you a link to reset your password.</p>
                </div>

                {message ? (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 transition-transform hover:scale-110">
                            <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        
                        {debugToken && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left shadow-inner">
                                <p className="text-[10px] font-bold text-amber-800 uppercase mb-2 tracking-wider">Debug Mode: Manual Reset Link</p>
                                <p className="text-[11px] text-amber-700 break-all bg-white/50 p-2 border border-amber-100 rounded font-mono">
                                    {window.location.origin}/reset-password?token={debugToken}
                                </p>
                                <a 
                                    href={`/reset-password?token=${debugToken}`}
                                    className="block mt-3 py-2 text-xs text-center font-bold text-white bg-amber-600 rounded hover:bg-amber-700 transition-colors shadow-sm"
                                >
                                    TEST RESET NOW
                                </a>
                            </div>
                        )}

                        <Button 
                            variant="outline" 
                            className="w-full mt-6"
                            onClick={() => {
                                setMessage('');
                                setDebugToken('');
                            }}
                        >
                            Try another email
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            required
                        />

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" 
                            size="lg" 
                            isLoading={isLoading}
                        >
                            Send Reset Link
                        </Button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-sm text-gray-500">
                        Can't remember your email? <span className="text-indigo-600 font-medium italic">Contact the Admin</span>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
