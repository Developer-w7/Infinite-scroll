import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './App.css';
import Loader from './components/Loader';
import { ServerUrl } from './config/connection';
import List from './components/ListItem';
import ListItem from './components/ListItem';

function App() {

  const [showLoader, setLoader] = useState(true);
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [fetching, setFetching] = useState<boolean>(false);
  const [endOfPage, setEndOfPage] = useState(false);

  let TimerRef:any= React.useRef();
 

  const setTimer:any=(time:number)=>{
    TimerRef=setTimeout(()=>setLoader(false),time)
  }

  const clearTimer:any=()=>{
    TimerRef.current && TimerRef.current.clearTimer();
  }
  
const getData =()=>{
   axios.get(`${ServerUrl}/${page}`).then((res)=>{
     
   
      
        setPage(page+1);
        setData([...data,...res.data.nodes]);
        setFetching(false);
        if(res.data.nodes.length === 0){
          setEndOfPage(true)
        }

 }).catch((e)=>console.error(e))
}
  useEffect(() => {
    getData();
    setTimer(4000);
    return clearTimer();
  }, []);
  useEffect(() => {
    if(fetching && !endOfPage)getData();

  }, [fetching,endOfPage]);

  function isScrolling(){
    if(window.innerHeight + document.documentElement.scrollTop!==document.documentElement.offsetHeight){
      return;
    }
    else {
      setFetching(true);
      console.log("scrolling down");
    }}
    

  useEffect(()=>{
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling);}, [])

  if(showLoader){
   return <Loader/>;
  }


  return (
    <div className="container">

     <div onScroll={()=>console.log('p')} className="">
    
      {data && data.map((item:object,index:number)=>{
      return(
        <ListItem key={index} item={item} />
      )
      })}
     {endOfPage && <p className='info'>-----No More Data----</p>}
     
    </div>

      </div>
  );
}

export default App;
