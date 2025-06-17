import { useEffect, useState } from 'react'
import './App.css'

const Card = ({title}) => {
  const [hasLiked, sethasLiked] = useState(false);
  const [count, setcount] = useState(0);

  useEffect(()=> {
    console.log(`${title} has been liked ${hasLiked}`);
  })

  return (
    
    <div className='card' onClick={()=> setcount((prev)=> prev+1)}>
    <h2> {title}<br /> {count}</h2>
    <button onClick= {() => sethasLiked((prev)=> !prev)}>
    {hasLiked ? "Liked": "Like"}

    </button>
    </div>
  )
}
const App = () => {
  
  return (
    <div className="card-container">
    
    
    <Card title = "Star wars" />
    <Card title = "The Lion king" />
    <Card title = "Dasani"/>
    </div>
  )
}

export default App
