
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUser, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  svg {
    margin-right: 5px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    position: absolute;
    left: 10px;
    color: #aaa;
    font-size: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 15px;
`;

function UserRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    photo: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return; // Allow only numbers in phone field
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.address) {
      setError('Address is required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const response = await axios.post('http://localhost:8000/api/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        alert('User registered successfully');
        setFormData({ name: '', email: '', phone: '', address: '', password: '', confirmPassword: '', photo: null });
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data.message || 'Registration failed');
    }
  };

  return (
    <div className='login-body pt-5'>
      <Container>
        <HomeLink to='/'>
          <FaHome /> Back to Home
        </HomeLink>
        <Title>Register</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FaUser />
            <Input type='text' name='name' placeholder='Enter your name' value={formData.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <FaEnvelope />
            <Input type='email' name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <FaPhone />
            <Input type='text' name='phone' placeholder='Enter your phone number' value={formData.phone} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <FaMapMarkerAlt />
            <Input type='text' name='address' placeholder='Enter your address' value={formData.address} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <FaLock />
            <Input type='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <FaLock />
            <Input type='password' name='confirmPassword' placeholder='Confirm your password' value={formData.confirmPassword} onChange={handleChange} required />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {/* <FormGroup>
            <FaCamera />
            <Input type='file' name='photo' accept='image/*' onChange={handleFileChange} />
          </FormGroup> */}
          <Button type='submit'>Register</Button>
        </Form>
      </Container>
    </div>
  );
}

export default UserRegister;
