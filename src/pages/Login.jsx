import React, { useState } from 'react';
import { Card, Typography, Input, Button } from '@material-tailwind/react';
import loginData from "../data/users.json";
import { useNavigate } from 'react-router-dom';

function Login({setIsAuthenticated, setUser}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const users = Array.isArray(loginData) ? loginData : loginData.users || [];
            
            const user = users.find(user => user.email === email);

            if (!user) {
              setError('Invalid email');
              return;
            }
            
            if (user.password !== password) {
              setError('Invalid password');
              return;
            }

            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/orders');


        } catch (error) {
            console.error('Login failed:', error);
            setError('An error occurred during login');
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 p-2'>
            <Card className='p-4 md:p-8 w-[500px] items-center shadow-xl rounded-xl bg-white border border-gray-100'>
                <div className="w-full text-center mb-4">
                    <Typography variant="h3" className='font-bold text-gray-800 mb-2'>
                        Welcome Back
                    </Typography>
                    <Typography className="text-gray-600 font-normal">
                        Please enter your credentials to continue
                    </Typography>
                </div>
                
                <form className="mt-4 w-full space-y-5 flex flex-col">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Typography className="text-gray-700 font-medium">
                            Email Address
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="your@email.com"
                            className="!border-gray-200 focus:!border-gray-900"
                            labelProps={{
                                className: "hidden",
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Typography className="text-gray-700 font-medium">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="Enter your password"
                            className="!border-gray-200 focus:!border-gray-900"
                            labelProps={{
                                className: "hidden",
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button 
                        className="w-full bg-purple-600 hover:bg-purple-400 transition-colors py-3 text-base font-medium"
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>

                    <Typography className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <a href="/signup" className="font-medium text-blue-500 underline">
                            Sign up
                        </a>
                    </Typography>
                </form>
            </Card>
        </div>
    );
}

export default Login;