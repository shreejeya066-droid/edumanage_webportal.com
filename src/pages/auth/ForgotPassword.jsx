import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Send, CheckCircle, RefreshCcw } from 'lucide-react';

export const ForgotPassword = () => {
    const { forgotPasswordAsync, verifyOTPAsync, resetPasswordAsync } = useAuth();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
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
            // Always show the same message for security
            setMessage(result.message || "If the email is registered, OTP has been sent.");
            setStep(2);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!otp) {
            setError('Please enter the OTP sent to your email.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyOTPAsync(email, otp);
            if (result.success) {
                setStep(3);
                setMessage('');
            } else {
                setError(result.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await resetPasswordAsync(email, otp, password);
            if (result.success) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(result.message || 'Reset failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during reset.');
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
                    <h1 className="text-3xl font-bold text-gray-900">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "New Password"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 && "Enter your registered email and we'll send you an OTP."}
                        {step === 2 && `An OTP has been sent to ${email}.`}
                        {step === 3 && "Enter your new password below."}
                    </p>
                </div>

                {message && !error && (
                    <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" /> {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="student@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full bg-indigo-600" isLoading={isLoading}>
                            Send OTP
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <Input
                            label="Enter OTP"
                            type="text"
                            placeholder="6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                        <Button type="submit" className="w-full bg-indigo-600" isLoading={isLoading}>
                            Verify OTP
                        </Button>
                        <button 
                            type="button" 
                            className="w-full text-sm text-indigo-600 hover:underline"
                            onClick={() => setStep(1)}
                        >
                            Back to email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full bg-indigo-600" isLoading={isLoading}>
                            Reset Password
                        </Button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-sm text-gray-500">
                        Need help? <span className="text-indigo-600 font-medium">Contact Support</span>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
