import React, { useEffect, useRef } from "react";
import Lottie from "react-lottie";
import Typewriter from 'typewriter-effect/dist/core';

import * as location from "../assets/1055-world-locations.json";
import * as success from "../assets/1127-success.json";

const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: location.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: success.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function PreLoader2() {
    //   const [data, setData] = useState([]);
    //   const [loading, setloading] = useState(undefined);
    //   const [completed, setcompleted] = useState(undefined);

    //   useEffect(() => {
    //     setTimeout(() => {
    //       fetch("https://jsonplaceholder.typicode.com/posts")
    //         .then((response) => response.json())
    //         .then((json) => {
    //           console.log(json);
    //           setData(json);
    //           setloading(true);

    //           setTimeout(() => {
    //             setcompleted(true);
    //           }, 1000);
    //         });
    //     }, 2000);
    //   }, []);

    const textRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            const typewriter = new Typewriter(textRef.current, {
                loop: true,
                delay: 105,
            });

            typewriter
                .pauseFor(1000)
                .typeString('<span style="color: #ffffff; font-size: 2rem ">লোড হচ্ছে ...</span>') 
                .pauseFor(1000)
                .start();
        }
    }, []);


    return (
        <>
            <div className="flex flex-col w-100vw h-full bg-blue-900 items-center justify-center"
            >
                <Lottie options={defaultOptions1} height={200} width={200} />
                <span ref={textRef} ></span>
            </div>
        </>
    );
}

export default PreLoader2;