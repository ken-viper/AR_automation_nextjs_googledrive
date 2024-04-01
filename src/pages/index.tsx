// import { useAuth } from "components/AuthProvider"
// import { PageLinks } from "components/PageLinks"
// import { UserStatus } from "components/UserStatus"
// import logo from "../../public/logo.jpg"
// import Image from "next/image"
// import { Button } from "antd"
// import Link from "next/link"
// export default function Home() {
//   const { user } = useAuth()

//   return (
//     <div className="px-40 h-screen">
//       <div className="flex justify-between">
//         <Image src={logo} alt="logo" className="my-2" />
//         <Link href="/signout" className="flex items-center pr-8 font-bold text-[20px]"  >Sign out</Link>
//       </div>
//       {/* <div className="h-full g-cover bg-center bg-slate-400 rounded-lg flex" style={{ backgroundImage: 'url("/images/front.png")' }}>
//         <div className="flex items-center -rotate-12 ml-10   text-8xl font-bold text-blue-500 hover:text-yellow-500 transition duration-500 ease-in-out">AR自動システム</div>
//       </div> */}

//     </div>

//   )
// }

// Home.requireAuth = true

// pages/index.tsx

import { useEffect, useState } from 'react';

const Home = () => {
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('/api/google-drive');
    //             const jsonData = await response.json();
    //             setData(jsonData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    return (
        <div className='flex justify-center items-center h-screen'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">実行</button>
            {/* <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul> */}
        </div>
    );
};

export default Home;

