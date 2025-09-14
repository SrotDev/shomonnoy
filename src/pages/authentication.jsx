import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { useState, useEffect } from "react";
import '../css/authentication.css'
import PreLoader2 from "./LoadingPage";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Authentication() {

    const [isLoading, setIsLoading] = useState(true)


    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [regRole, setregRole] = useState("citizen");
    const [mobileError, setMobileError] = useState("");
    const [role, setRole] = useState("citizen");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");


    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regCity, setRegCity] = useState("");
    const [regDesignation, setRegDesignation] = useState("");
    const [regOrganization, setRegOrganization] = useState("");
    const [regNationalId, setRegNationalId] = useState("");
    const [registerError, setRegisterError] = useState("");

    const variants = {
        login: { backgroundColor: 'grey' },
        signup: { backgroundColor: 'white' },
        hover: { backgroundColor: 'lightgrey' },
    };

    async function checkAvailablility() {
        try {
            console.log("request sent");
            const response = await fetch(`${baseUrl}/`, { method: "GET" });

            if (!response.ok) {
                console.log("Backend not ready, status:", response.status);
                return false;
            }

            // Only parse if response is ok
            const data = await response.json();
            console.log("Backend response:", data);
            return true;
        } catch (err) {
            console.error("Error checking availability:", err);
            return false;
        }
    }

    

    async function handleLogin(email, password, role ) {
        setLoginError("");

        if (!email) {
            setLoginError("ইমেইল প্রদান করুন");
            return;
        }
        if (!password) {
            setLoginError("পাসওয়ার্ড প্রদান করুন");
            return;
        }
        try {
            console.log(email + " " + password + " " + role)
            const response = await fetch(`${baseUrl}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setLoginError(data.message || 'লগইন ব্যর্থ হয়েছে');
                return;
            }



            if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
            if (data.access) localStorage.setItem('access_token', data.access);

            console.log(data.access)
        
            

            if (data.role === 'authority') {
                navigate('/authority');
            } else if (data.role === 'stakeholder') {
                navigate('/stakeholder');
            } else {
                navigate('/');
            }
        } catch (error) {
            setLoginError(error.message || 'লগইন ব্যর্থ হয়েছে');
        }
    }


    async function handleRegister() {
        setRegisterError("");
        let formData = {};
        if (regRole === "citizen") {
            formData = {
                name: regName,
                email: regEmail,
                password: regPassword,
                phone_number: regPhone,
                role: regRole,
                city: regCity,
                national_id: regNationalId
            };
        } else if (regRole === "authority" || regRole === "stakeholder") {
            formData = {
                name: regName,
                email: regEmail,
                password: regPassword,
                phone_number: regPhone,
                role: regRole,
                city: regCity,
                designation: regDesignation,
                organization: regOrganization
            };
        }

        console.log(formData)
        try {
            const response = await fetch(`${baseUrl}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
            } else {

                await handleLogin(regEmail, regPassword, regRole)
            }
            
            return data;
        } catch (error) {
            setRegisterError(error.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
            throw error;
        }
    }


    useEffect(() => {
        let intervalId;

        async function pollAvailability() {
            const available = await checkAvailablility();
            if (available) {
                setIsLoading(false);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }


        pollAvailability();
        intervalId = setInterval(pollAvailability, 5000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);







    if (isLoading) {
        return (
            <PreLoader2 />
        )
    }



    return (
        <div className="auth-bg items-center justify-center min-h-screen">
            <div className="flex flex-col bg-white p-8 shadow-[4px_2px_40px_20px_rgba(0,0,0,0.25)] w-[480px] max-w-full rounded-xl" style={{ minHeight: 'auto', maxHeight: '700px' }}>
                <div>{/* image */}

                </div>

                <div className="flex flex-row rounded-lg border-1 border-gray-300 w-full "> {/*login signup select */}
                    <motion.div
                        className="flex-1 py-2 rounded-l-lg cursor-pointer"
                        animate={{ backgroundColor: isLogin ? '#b0b0b0' : '#ffffff' }} // use hex codes
                        whileHover={{ backgroundColor: '#CECECEFF' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        onClick={() => setIsLogin(true)}
                    >
                        <p className="text-center">লগইন</p>
                    </motion.div>

                    {/* <div className="flex border-1 h-full"></div> */}

                    <motion.div
                        className="flex-1 py-2 rounded-r-lg cursor-pointer"
                        animate={{ backgroundColor: isLogin ? '#ffffff' : '#b0b0b0' }}
                        whileHover={{ backgroundColor: '#CECECEFF' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        onClick={() => setIsLogin(false)}
                    >
                        <p className="text-center">রেজিস্টার</p>
                    </motion.div>
                </div>

                {
                    !isLogin && <div className="flex flex-row rounded-lg border-1 border-gray-300 w-full mt-5"> {/*login signup select */}
                        <motion.div
                            className="flex-1 py-2 rounded-l-lg cursor-pointer"
                            animate={{ backgroundColor: regRole === "citizen" ? '#b0b0b0' : '#ffffff' }} // use hex codes
                            whileHover={{ backgroundColor: '#CECECEFF' }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            onClick={() => setregRole("citizen")}
                        >
                            <p className="text-center">নাগরিক</p>
                        </motion.div>

                        {/* <div className="flex border-1 h-full"></div> */}

                        <motion.div
                            className="flex-1 py-2  cursor-pointer"
                            animate={{ backgroundColor: regRole === "stakeholder" ? '#b0b0b0' : '#ffffff' }}
                            whileHover={{ backgroundColor: '#CECECEFF' }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            onClick={() => setregRole("stakeholder")}
                        >
                            <p className="text-center">সংস্থা</p>
                        </motion.div>
                        <motion.div
                            className="flex-1 py-2 rounded-r-lg cursor-pointer"
                            animate={{ backgroundColor: regRole === "authority" ? '#b0b0b0' : '#ffffff' }}
                            whileHover={{ backgroundColor: '#CECECEFF' }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            onClick={() => setregRole("authority")}
                        >
                            <p className="text-center">কর্তৃপক্ষ</p>
                        </motion.div>
                    </div>
                }

                {
                    isLogin &&
                    <div className="flex flex-col items-left mt-5">
                        {/* Role selection radio buttons */}
                        <div className="flex flex-row gap-6 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="citizen"
                                    checked={role === "citizen"}
                                    onChange={() => setRole("citizen")}
                                    className="accent-blue-500"
                                />
                                <span>নাগরিক</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="stakeholder"
                                    checked={role === "stakeholder"}

                                    onChange={() => setRole("stakeholder")}
                                    className="accent-blue-500"
                                />
                                <span>সংস্থা</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="authority"
                                    checked={role === "authority"}
                                    onChange={() => setRole("authority")}
                                    className="accent-blue-500"
                                />
                                <span>কর্তৃপক্ষ</span>
                            </label>
                        </div>

                        {/* ...existing code for mobile/password fields and submit button... */}
                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="mobile"
                                name="username"

                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="মোবাইল নম্বর (ইংরেজিতে)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                আপনার ইমেইল
                            </label>
                            {mobileError && <div className="text-red-500 text-sm mt-1">{mobileError}</div>}
                        </div>

                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="password"
                                id="pass"
                                name="pass"

                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="পাসওয়ার্ড"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                পাসওয়ার্ড
                            </label>
                        </div>
                        <div className="mt-5"></div>
                        <motion.div
                            onClick={() => { handleLogin(email,password, role) }}
                            className="cursor-pointer px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md text-center select-none"
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "#2563EB",
                                boxShadow: "0px 8px 20px rgba(37, 99, 235, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}

                        >
                            সাবমিট করুন
                        </motion.div>

                        <div> {/* Login Error */}
                            {loginError && <span className="text-red-600">
                                {loginError}
                            </span>}
                        </div>
                    </div>
                }

                {
                    !isLogin && (
                        <div className="flex flex-col items-left mt-5">
                            <form className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className="col-span-1 relative">
                                    <input type="text" id="name" name="name" required autoComplete="off" value={regName} onChange={e => setRegName(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="নাম" />
                                    <label htmlFor="name" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">নাম</label>
                                </div>
                                <div className="col-span-1 relative">
                                    <input type="email" id="email" name="email" required autoComplete="off" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="ইমেইল" />
                                    <label htmlFor="email" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">ইমেইল</label>
                                </div>
                                <div className="col-span-1 relative">
                                    <input type="password" id="password" name="password" required autoComplete="off" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="পাসওয়ার্ড" />
                                    <label htmlFor="password" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">পাসওয়ার্ড</label>
                                </div>
                                <div className="col-span-1 relative">
                                    <input type="text" id="phone_number" name="phone_number" required autoComplete="off" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="মোবাইল নম্বর" />
                                    <label htmlFor="phone_number" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">মোবাইল নম্বর</label>
                                </div>
                                <div className="col-span-1 relative">
                                    <input type="text" id="city" name="city" required autoComplete="off" value={regCity} onChange={e => setRegCity(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="শহর" />
                                    <label htmlFor="city" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">শহর</label>
                                </div>
                                {/* Conditional fields */}
                                {(regRole === "authority" || regRole === "stakeholder") && (
                                    <>
                                        <div className="col-span-1 relative">
                                            <input type="text" id="designation" name="designation" required autoComplete="off" value={regDesignation} onChange={e => setRegDesignation(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="পদবী" />
                                            <label htmlFor="designation" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">পদবী</label>
                                        </div>
                                        <div className="col-span-1 relative">
                                            <input type="text" id="organization" name="organization" required autoComplete="off" value={regOrganization} onChange={e => setRegOrganization(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="সংস্থা" />
                                            <label htmlFor="organization" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">সংস্থা</label>
                                        </div>
                                    </>
                                )}
                                {regRole === "citizen" && (
                                    <div className="col-span-2 relative">
                                        <input type="text" id="national_id" name="national_id" required autoComplete="off" value={regNationalId} onChange={e => setRegNationalId(e.target.value)} className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="জাতীয় পরিচয়পত্র নম্বর" />
                                        <label htmlFor="national_id" className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">জাতীয় পরিচয়পত্র নম্বর</label>
                                    </div>
                                )}
                                <div className="col-span-2 mt-4">
                                    <motion.div
                                        onClick={() => { handleRegister() }}
                                        className="cursor-pointer px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md text-center select-none"
                                        whileHover={{
                                            scale: 1.02,
                                            backgroundColor: "#2563EB",
                                            boxShadow: "0px 8px 20px rgba(37, 99, 235, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        সাবমিট করুন
                                    </motion.div>
                                </div>
                                <div className="col-span-2"> {/* Register Error */}</div>
                            </form>
                        </div>
                    )
                }





            </div>
        </div>

    )
}