
import logo from "../../public/logo.jpg"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react';

const Home = () => {
  const [data, setData] = useState({});

  // useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/google-drive');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // fetchData();
  // }, [setData]); // Add setData as a dependency for useEffect

  useEffect(() => {
    // console.log("result4",  data); // This will show the updated state
    // getDayData(data,"2024","04","01")
  }, [data]); // Add data as a dependency for useEffect


  return (
    <div>
      <div className="flex justify-between">
        <Image src={logo} alt="logo" className="my-2" />
        <Link href="/signout" className="flex items-center pr-8 font-bold text-[20px]"  >Sign out</Link>
      </div>
      <div className='flex justify-center items-center h-screen'>

        <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">実行</button>
        {/* <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}
      </div>
    </div>

  );
};

export default Home;
Home.requireAuth = true
