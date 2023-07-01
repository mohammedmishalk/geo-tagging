import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/user/signup', {
        name,
        email,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error);
    }
  };

  return (
    <MDBContainer fluid>
      <form onSubmit={handleSubmit}>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <h2 className='fw-bold mb-2 text-uppercase'>SignUp</h2>
                <p className='text-white-50 mb-5'>Please enter your details</p>
                {error && <p className='text-danger fs-3'>{error}</p>}
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  labelClass='text-white'
                  label='Name'
                  id='name'
                  type='text'
                  size='lg'
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  labelClass='text-white'
                  label='Email address'
                  id='email'
                  type='email'
                  size='lg'
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  labelClass='text-white'
                  label='Password'
                  id='password'
                  type='password'
                  size='lg'
                />
                <MDBBtn className='mx-2 px-5' type='submit' size='lg'>
                  Sign Up
                </MDBBtn>
                <div>
                  <p className='mb-0'>
                    Already have an account?{' '}
                    <span className='text-white-50 fw-bold'>
                      <Link to={'/'}>Login</Link>
                    </span>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  );
}
