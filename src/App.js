
import { useRef, useLayoutEffect, useState } from 'react';
import './App.css';

function App() {
  const [displaytime,setDisplayTime]=useState(25*60)
  const[breaktime,setBreakTime]=useState(5*60)
  const[sessiontime,setSessionTime]=useState(25*60)
  const[timerOn,setTimerOn]=useState(false)
  const[onBreak,setBreak]=useState(false)


  const formattime=(time)=>{
    let minutes=Math.floor(time/60);
    let seconds= time%60;
    return ((minutes <10 ? '0'+minutes : minutes) + ":" + (seconds <10 ? '0'+seconds : seconds));
  }

  const changeTime = (amount, type) => {
    let maxTime = 60 * 60; 
  
    if (type === 'break') {
      if ((breaktime + amount) <= 0 || (breaktime + amount) > maxTime) {
        return;
      }
      setBreakTime(prev => prev + amount);
    } else {
      if ((sessiontime + amount) <= 0 || (sessiontime + amount) > maxTime) {
        return;
      }
      setSessionTime(prev => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessiontime+amount);
      }
    }
  };
  const onBreakRef = useRef();
  useLayoutEffect(() => {
  onBreakRef.current = onBreak;
  }, [onBreak]);
  
  const controlTime=()=>{
    let second=1000;
    let date=new Date().getTime();
    let nextdate= new Date().getTime()+second;
    if(!timerOn){
      let interval = setInterval(()=>{
        date=new Date().getTime();
        if (date>nextdate){
          setDisplayTime(prev=>{
            if(prev<=0 && !onBreakRef.current){
              setBreak(true)
              return breaktime
            }else if(prev<=0 && onBreakRef.current){
              setBreak(false)
              return sessiontime
            }
            return prev-1;
          })
          nextdate+=second;
        }
      },30)
      localStorage.clear();
      localStorage.setItem('interval-id',interval);
    }
    if (timerOn){
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimerOn(!timerOn)
  }
  const resetTime=()=>{
    setDisplayTime(25*60)
    setBreakTime(5*60)
    setSessionTime(25*60)
    if (timerOn) {
      clearInterval(localStorage.getItem('interval-id'));
      setTimerOn(false);
    }
  }

  return (
    <div className="App">
      <h1 className='heading'>25+5 clock</h1>
      <div className='dual-container'>
        <div className='firstc' >
          <h3>Break Length</h3>
          <div className='time-sets'>
            <button onClick={()=>changeTime(-60,"break")}>Decrease</button>
            <h3>{formattime(breaktime)}</h3>
            <button onClick={()=>changeTime(60,"break")}>Increase</button>
          </div>
        </div>
        <div className='firstc' >
          <h3>Session Length</h3>
          <div className='time-sets'>
            <button onClick={()=>changeTime(-60,"")}>Decrease</button>
            <h3>{formattime(sessiontime)}</h3>
            <button onClick={()=>changeTime(60,"")}>Increase</button>
          </div>
        </div>
      </div>
      <h1 className='final'>{formattime(displaytime)}</h1>
      <div className='lastbtn'>
        <button onClick={()=>controlTime()}>{timerOn? "Pause" : "Play"}</button>
        <button onClick={()=>resetTime()}>Reset</button>
      </div>

    </div>
  );
}

export default App;
