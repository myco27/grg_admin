import React, { useState } from 'react'
import { Card, Typography, Input, Button, Checkbox } from '@material-tailwind/react'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login submitted:', { email, password })
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <Card color="white" shadow={false} className='p-8 w-[500px] items-center'>
            <Typography variant="h4" color="blue-gray" className='font-bold'>
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to register.
            </Typography>
            <form className="mt-8 mb-2 w-full">
                <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Your Name
                </Typography>
                <Input
                    size="lg"
                    label="Enter name here..."
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Your Email
                </Typography>
                <Input
                    size="lg"
                    label='Enter email here...'
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Password
                </Typography>
                <Input
                    type="password"
                    size="lg"
                    label='********'
                />
                </div>
                <div className='mt-3'>
                    <Checkbox
                    label={
                        <Typography
                        variant="small"
                        color="gray"
                        className="flex items-center font-normal"
                        >
                        I agree the
                        <a
                            href="#"
                            className="font-medium transition-colors hover:text-gray-900"
                        >
                            &nbsp;Terms and Conditions
                        </a>
                        </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                    />
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-400 transition-colors py-3 mt-3 text-base font-medium">
                sign up
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal">
                Already have an account?{" "}
                <a href="/" className="font-medium text-blue-500 underline">
                    Sign In
                </a>
                </Typography>
            </form>
        </Card>
    </div>
  )
}

export default Signup