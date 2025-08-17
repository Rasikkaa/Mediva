
import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Include your CSS file for styling
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:8000/api/auth/login'; // Replace with your API URL

    try {
      const response = await axios.post(apiUrl, { userName, passWord });
console.log(response);

      // Set token for everyone
      localStorage.setItem('authToken', response.data.token);
console.log(response.data.token);

      setSuccessMessage('Login successful!');
      alert(response.data.message);

      const userRole = response.data.user.role;

      // Save user-specific details based on role and navigate
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'user') {
        localStorage.setItem('userlogId', response.data.user.id);
        navigate('/user-home');
      } else if (userRole === 'doctor') {
        localStorage.setItem('doctorlogId', response.data.user.id);
        navigate('/doctor-home');
      } else if(userRole=='shop'){
        localStorage.setItem('shoplogId', response.data.user.id);
        navigate('/shophome')
      }else if(userRole=='labStaff'){
       
        navigate('/labhome')
        localStorage.setItem('lablogId',response.data.user.id)
        
      }  else if(userRole=='deliveryboy'){
        localStorage.setItem('lablogId',response.data.user.id)
        navigate('/deliveryboy')
      }
      else if(userRole=='companion'){
        localStorage.setItem('complogId',response.data.user.id)
        navigate('/requests')
      }
      
      else {
        // Handle any additional roles or default behavior
        navigate('/');
      }
    } catch (error) {
      // alert(error.response.data.message);
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
          <img
               src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAEfASoDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAQFAQIDBv/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/aAAwDAQACEAMQAAAC9SEAAAAAAAAAAAAAAAAAAAAAAAAAAGNUbueqOyPqiUhzEgsAAAAAAAAAAAABiDLqbc8iOrtMJeazN62Umm6xN/LhzMOwI0AAAAAAAAAAAAYzqcqyxrr8iLKsZzoeXrKW2lV15ddea/lxJfL6ARoAAAAAAAAAMGWhG7Qb88xJjeBZVtuZY11iiTS3VK2quvLrvwX0yNtzeh3aZjTZrg3abpAAAAAAAV9hBnPbGeDDtjjiY794GsraNBxEzpFTrMXlLpiVd3k7aY3seBVU6PQ48/m2V+oBf6c+me88U6AAAAAAEGdCnPHLlBtx2WI9pEwtZ+FoGLDEoGtjgrsWSVZtYdVq+q9HGtFKusWzpmdL420qLKw7J4z6gAAAAAEGdBnOohzYfTwzvReXssui2VKmts4aReUhlZiEJqCJyAlPV4pOXfTo4LKXHkY9U8Z9IAAAAACFNgznVQ7Ou6ODVstTVsLrhIj4dLXKctcbYlrjbEzrjbEtcbYlrjbErDtjOPTPGfQAAAAAAr7DE1iYllYmJiULtIgIl+Zv/P6c2t/QX8xP4d6/Hs2zW7X5r2PjenRySRFShE1m7ARoAAAAAAAAA49uExGo7yj34db+gv4T6+wr8uqBtrtpyWUuJLy7AjQAAAAAAAAAAABw78JrGo7yj34tenPF8O/WDKrpI212rNlLhzMe0I0AAAAAAAAMckdkTSaTkDBYaQtpSIXfuYrbgUWL5NKCRbk1facraPiTzG8fQmIOCegCehdlu4iwADGRz17FeG3UYyLAAAAAAAAAAAY5diIu0hMcemyJBIAAAAAAAAAAAAAAAAAAAADn0hTXWf470d8Z0WT5SL+i60tggpbC1JU+nuKawFBaXxnS/NSotdQ5PmIt6yBP83E+kQtovzneb9LakbFFrbL1Iy6gAAAAEKbBmnnpuvHfiuaHtMi+thXWNdKKVpd2pzncO+PV5D1vkvU6c+lBZwC/8x6fzCfWVtlrnvRZgt+K5ldqbLpiZ4Z25fQy6G+w7AroAAAAiyiKWRZLUoLKaKiZLJ829Itn5z0WVdPO6+kTn5+3kovzovQokIvUYuFsnn/QItzzui3nvQk1CLgAf//aAAwDAQACAAMAAAAh999999999999999999999999999/z++99999999999999lAPyI999999999999961XyAA99999999998/wC4PFaQ529+PPfffffbs0hbtzzjGIg/PfffffexD1dV8+ihh4/fffffff7Fv/M+++aQwvffffffb9/vvmscMMsAfffffffbFjV9/wCh8E66v3333333332xT+n4D33333333333331TsH0j333333333pHZnKX/ANuJnfzs099sTec99999999999Ppv9999999999999999999999pFg1Ehn5xTKwzV99999vv4dIZ/qAwZtYd99999riCAAQDRSIHbzm999//2gAMAwEAAgADAAAAEPvvvvvvvvvvvvvvvvvvvvvvvvvvtdI0fvvvvvvvvvvvvqvRDJ+vvvvvvvvvvvvvvHQyPlvvvvvvvvvvrwRT91l16KRXv/vvvvvvm4hbxT+1mkaH/vvvvvuLgksH+cTWeo1vvvvvvvqTzTWMIgGC61vvvvvvqCwk/Ef/AL+2+hb777777xtQXutaqaX3pb7777777764qpWr77777777777777+u3qlr777777776WI/j4ijDLFi455f74u8Pf77777777777BTH7777777777777777777777ulAIJLK+ZojVHb77776+vUoi6hIJ/9Ppb77777qy2327s79MmI2f777//EADARAAEDAgMGBQQCAwAAAAAAAAEAAgMEERITMSEwMjNBUQUUUnGBFSAioUDwQlNh/9oACAECAQE/AP5llhRaW67+FgN7qCBjnWIQpIfSpaOLAbNTuEb4bSFELEozOh/Jqpq58sgjIUnAU/hG8sVY9lGxznABRkFziFPwKg5wUnAURdgVirFW3ERtcoSv7oSSepEyPFi7YmxFvC5GFzhYlU8OU8Pvonz/AIEW6KnoDIwPDrXX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"
              alt="Logo"
              className="logo-image"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="userName">Username:</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="login-button">
                Login
              </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <div className="register-link">
              <p>
                Don't have an account? <Link to="/user">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

