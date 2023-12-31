import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useSnackbar } from '../hooks/useSnackbar';
import Skeleton from '@mui/material/Skeleton';
import postData from '../utilities/postData';

const Login = () => {
  const { handleSnackbarOpen } = useSnackbar();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const isValid = /^[EH]\d+$/.test(data.id);

    if (!isValid) {
      handleSnackbarOpen('Check id again. It should start with "E" or "H" followed by numbers.');
      return;
    }

    const url = '/api/login';
    const result = await postData(url, data);

    if (result.success) {
      const { token, id, role } = result.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('role', role);
      navigate('/home');
      handleSnackbarOpen('Login successful', 'success');
    } else {
      handleSnackbarOpen('Invalid Credentials', 'error');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const img = new Image();
    img.src = "/icons/logo.svg";
    img.onload = () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <>
      <div className="grid relative w-full grid-cols-2 h-screen">
        <div className="col-span-full md:col-span-1 bg-slate-50 flex flex-col w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col xs:p-8 p-6 mt-10 items-center w-full">
              <div className="flex items-center justify-center w-full">
                <IconButton className="xs:h-12 xs:w-12 h-6 w-6" type='button' onClick={() => navigate('/')}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <div className="flex-grow flex-shrink-0 h-16 xss:h-20 xs:h-24 md:h-20 lg:h-28 mx-auto">
                  {isLoading ? <Skeleton variant="rect" className='h-full w-full' />
                    : <img src="/icons/logo.svg" alt="" className="h-16 xss:h-20 xs:h-24 md:h-20 lg:h-28 mx-auto" />
                  }
                </div>
                <div className='xs:h-12 xs:w-12 h-6 w-6'>
                </div>
              </div>

              <div className="items-center text-gray-950 font-semibold text-2xl mb:text-4xl mt-10 lg:mt-20">
                Welcome Back
              </div>
              <div className="mt-5 mb:mt-10 flex w-full max-w-96 h-auto">
                <TextField fullWidth label="User ID" placeholder="Enter your ID ex: H001 | E001" {...register("id")} required
                />
              </div>


              <div className="my-5 flex flex-col w-full max-w-96 items-end">
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
                <Link className="text-green-500 text-mb cursor-pointer mt-2">Forgot password?</Link>
              </div>

              <div className="my-4 w-full max-w-96 " >
                <Button variant="contained" color="success" type="submit"
                  size='large'
                  fullWidth >
                  Submit
                </Button>
              </div>

            </div>
          </form>
        </div>

        <div className=" col-span-1 bg-gradient-to-r from-green-cust-300 to-green-cust-100 items-center justify-center hidden md:grid p-4 h-auto">
          <img src="icons/login/loginIcon.svg" alt="" className="h-full" />
        </div>

      </div >



    </>
  );
};

export default Login;