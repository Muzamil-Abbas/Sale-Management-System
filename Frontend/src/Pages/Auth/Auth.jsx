
import React, { useState } from 'react'
import { setloginStatus } from "../../Redux/login/isLogin";
import { useDispatch } from 'react-redux';
import baseurl from '../../utils/baseurl';

import { useForm } from 'react-hook-form';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
    const [isLoginPage, setisLoginPage] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [eyePassword, seteyePassword] = useState(false);
    const [eyeConfirmPassword, seteyeConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({/** resolver: yupResolver(schema), */ });
    const validateEmail = (email) => {
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return "Invalid email format";
        };
    }
    const validatePassword = (password) => {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s).{8,}$/g;
        // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s)/g;
        if (!password.match(regex)) {
            return "invalid password format";
        };
    }

    const loginUser = async (obj) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(obj),
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            const response = await fetch(`${baseurl}/login`, requestOptions);
            const result = await response.json();
            if (result.status) {
                dispatch(setloginStatus(true));
                toast.success("Login success");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error(result.message || "Invalid credentials");
                console.log('Error::Auth::loginUser::result', result.message)
            }
        } catch (error) {
            toast.error("Network error! Please try again");
            console.log('Error::Auth::loginUser', error)
        }
    }

    const registerUser = async (obj) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(obj),
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            const response = await fetch(`${baseurl}/register`, requestOptions);
            
            // Check if response is ok first
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = "Registration failed";
                try {
                    const errorResult = await response.json();
                    errorMessage = errorResult.message || errorResult.error || `Server error (${response.status})`;
                } catch (jsonError) {
                    errorMessage = `Server error (${response.status})`;
                }
                toast.error(errorMessage);
                console.log('Error::Auth::registerUser::HTTP Error', response.status, errorMessage);
                return;
            }

            const result = await response.json();
            if (result.status) {
                toast.success("Registration success! Login to account");
                setisLoginPage(!isLoginPage);
                reset(); // Clear form
            } else {
                toast.error(result.message || "Registration failed");
                console.log('Error::Auth::registerUser::result', result.message)
            }
        } catch (error) {
            toast.error("Network error! Please try again");
            console.log('Error::Auth::registerUser::Network Error', error)
        }
    }

    const onSubmit = (data) => {
        console.log(data);
        if (data.btnOption === "REGISTER") {
            // register btn is clicked:
            if (data.password !== data.cpassword) {
                toast.error("Password and confirm password do not match!");
                return false;
            }
            registerUser(data);
            return false;
        }
        // else login btn clicked:
        loginUser(data)
        return false;
    }
    return (
            <div className="mt-16">
            <main className='p-4 md:w-2/6 md:mx-auto border border-gray-700 dark:border-gray-600 rounded-xl'>
                
            <div className="h2 text-center text-xl font-bold ">{isLoginPage ? "Login into Account" : "Register Account"}</div>
            <div className='flex justify-center  mx-auto mt-4'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full lg:max-w-xs' autoComplete='off' noValidate>
                    {/* email */}
                    <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.email ? "input-error" : "input-success"} `}>
                        <EnvelopeIcon className="h-4 w-4 opacity-70" />
                        <input type="text" name='email' className="grow bg-transparent " placeholder="Email"
                            {...register('email', { validate: validateEmail })} />
                    </label>
                    <div className="label-text text-xs text-error h-8 pt-2">
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>


                    {/* password */}
                    <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.password ? "input-error" : "input-success"} `}>
                        <KeyIcon className="h-4 w-4 opacity-70" />
                        <input type={eyePassword ? "text" : "password"} name='password' className="grow bg-transparent" placeholder="password"
                            {...register('password', { validate: validatePassword })} />
                        {eyePassword ? <EyeIcon className="h-4 w-4 opacity-70" onClick={() => { seteyePassword(!eyePassword) }} />
                            :
                            <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => { seteyePassword(!eyePassword) }} />}
                    </label>

                    <div className="label-text text-xs text-error h-8 pt-2">
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    <div className="label">
                        <span className="label-text text-xs text-gray-500">Min 8 chars and must include Uppercase, Lowercase, Number and Special character.</span>
                    </div>

                    {/* confirm password */}
                    {!isLoginPage && (<>
                        <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.cpassword ? "input-error" : "input-success"} `}>

                            <KeyIcon className="h-4 w-4 opacity-70" />
                            <input type={eyeConfirmPassword ? "password" : "text"} name='cpassword' className="grow bg-transparent" placeholder="confirm password"
                                {...register('cpassword', { validate: validatePassword })} />
                            {!eyeConfirmPassword ? <EyeIcon className="h-4 w-4 opacity-70" onClick={() => { seteyeConfirmPassword(!eyeConfirmPassword) }} />
                                :
                                <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => { seteyeConfirmPassword(!eyeConfirmPassword) }} />}
                        </label>
                        <div className="label-text text-xs text-error h-8 pt-2">
                            {errors.cpassword && <p>{errors.cpassword.message}</p>}
                        </div>
                    </>)}

                    <input type="hidden" name='btnOption' {...register('btnOption')} id='btnHiddenForm' />

                    {isLoginPage ? (<input type="submit" className='btn w-full lg:max-w-xs btn-primary mt-4' value="Login"
                        onClick={() => { reset({"btnOption":"LOGIN"}) }} />)
                        : (<input type="submit" className='btn w-full lg:max-w-xs btn-primary mt-4' value="Register"
                            onClick={() => { reset({"btnOption":"REGISTER"}) }} />)
                    }
                </form>
            </div>

            <div className="more text-center mt-4">
                <h5>OR</h5>
                {isLoginPage ? (<div>Do not have account? <span className='underline cursor-pointer'
                    onClick={() => { setisLoginPage(!isLoginPage) }}>Register</span></div>)
                    : (<div>Already have account? <span className='underline cursor-pointer'
                        onClick={() => { setisLoginPage(!isLoginPage) }}>Login</span></div>)
                }
            </div>

            <Toaster />
        </main>
        </div>
    )
}

export default Auth