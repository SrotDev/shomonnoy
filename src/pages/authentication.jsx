import { Link } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { useState } from "react";
import '../css/authentication.css'

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [isUser, setIsUser] = useState(true);
    const [mobileError, setMobileError] = useState("");

    const variants = {
        login: { backgroundColor: 'grey' },
        signup: { backgroundColor: 'white' },
        hover: { backgroundColor: 'lightgrey' },
    };

    var mobileNo;
    var NidNo;
    var password;



    function mobileCheck(value) {

        const cleaned = value.replace(/\D/g, "");

        if (cleaned.length === 0) {
            setMobileError("");
        } else if (!/^[0-9]{11}$/.test(cleaned)) {
            setMobileError("মোবাইল নম্বর ইংরেজিতে ১১ ডিজিট হতে হবে ");
        } else {
            setMobileError("");
        }
    }


    return (
        <div className="auth-bg items-center justify-center">
            <div className="flex flex-col bg-white p-6 shadow-[4px_2px_40px_20px_rgba(0,0,0,0.25)] w-100 rounded-xl">
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
                            animate={{ backgroundColor: isUser ? '#b0b0b0' : '#ffffff' }} // use hex codes
                            whileHover={{ backgroundColor: '#CECECEFF' }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            onClick={() => setIsUser(true)}
                        >
                            <p className="text-center">নাগরিক</p>
                        </motion.div>

                        {/* <div className="flex border-1 h-full"></div> */}

                        <motion.div
                            className="flex-1 py-2 rounded-r-lg cursor-pointer"
                            animate={{ backgroundColor: isUser ? '#ffffff' : '#b0b0b0' }}
                            whileHover={{ backgroundColor: '#CECECEFF' }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            onClick={() => setIsUser(false)}
                        >
                            <p className="text-center">সংস্থা</p>
                        </motion.div>
                    </div>
                }

                {
                    isLogin &&
                    <div className="flex flex-col items-left mt-5">

                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="mobile"
                                name="username"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="মোবাইল নম্বর (ইংরেজিতে)"
                                onChange={(e) => mobileCheck(e.target.value)}
                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                মোবাইল নম্বর (ইংরেজিতে)
                            </label>
                            {mobileError && <div className="text-red-500 text-sm mt-1">{mobileError}</div>}
                        </div>
                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="nid"
                                name="nidNo"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="জাতীয় পরিচয়পত্র নম্বর (ইংরেজিতে)"

                            />
                            <label
                                htmlFor="nid"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                জাতীয় পরিচয়পত্র নম্বর (ইংরেজিতে)
                            </label>

                        </div>

                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="password"
                                id="pass"
                                name="pass"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="পাসওয়ার্ড"

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
                            onClick={() => { null }}
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

                        </div>
                    </div>
                }

                {
                    !isLogin && isUser && <div className="flex flex-col items-left mt-5">

                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="mobile"
                                name="username"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="মোবাইল নম্বর (ইংরেজিতে)"
                                onChange={(e) => mobileCheck(e.target.value)}
                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                মোবাইল নম্বর (ইংরেজিতে)
                            </label>
                            {mobileError && <div className="text-red-500 text-sm mt-1">{mobileError}</div>}
                        </div>
                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="nid"
                                name="nidNo"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="জাতীয় পরিচয়পত্র নম্বর (ইংরেজিতে)"

                            />
                            <label
                                htmlFor="nid"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                জাতীয় পরিচয়পত্র নম্বর (ইংরেজিতে)
                            </label>

                        </div>

                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="password"
                                id="pass"
                                name="pass"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="পাসওয়ার্ড"

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
                        <div className="col-9 relative w-full">
                            <input
                                type="password"
                                id="pass"
                                name="pass"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="পাসওয়ার্ড নিশ্চিত করুন"

                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                        </div>
                        <div className="mt-5"></div>
                        <motion.div
                            onClick={() => { null }}
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

                        <div> {/* Register Error */}

                        </div>
                    </div>

                }



                {
                    (!isLogin && !isUser) && <div className="flex flex-col items-left mt-5">

                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="mobile"
                                name="username"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="মোবাইল নম্বর (ইংরেজিতে)"
                                onChange={(e) => mobileCheck(e.target.value)}
                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                মোবাইল নম্বর (ইংরেজিতে)
                            </label>
                            {mobileError && <div className="text-red-500 text-sm mt-1">{mobileError}</div>}
                        </div>
                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="nid"
                                name="nidNo"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="সংস্থার নাম"

                            />
                            <label
                                htmlFor="nid"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                সংস্থার নাম
                            </label>

                        </div>

                        <div className="mt-5"></div>
                        <div className="col-9 relative w-full">
                            <input
                                type="text"
                                id="pass"
                                name="pass"
                                maxLength={11}
                                required
                                autoComplete="off"
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="পাসওয়ার্ড"

                            />
                            <label
                                htmlFor="mobile"
                                className="absolute left-3 top-2 text-gray-400 text-base transition-all duration-200 ease-in-out 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                সিটি কর্পোরেশন
                            </label>
                        </div>

                        <div className="mt-5"></div>
                        <motion.div
                            onClick={() => { null }}
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

                        <div> {/* Register Error */}

                        </div>
                    </div>
                }

            </div>
        </div>

    )
}