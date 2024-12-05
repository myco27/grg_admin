import React from 'react';
import { Button } from "@material-tailwind/react"
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div className='flex-col flex items-center mx-auto'>
      <h1>Welcome to Home</h1>
      <h1>Welcome to Test</h1>
      <Button>
        <Link to="/orders">
          Go to Orders
        </Link>
      </Button>
    </div>
  );
};

export default Home;
