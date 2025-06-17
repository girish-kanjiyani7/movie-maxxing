import { useState } from 'react'
import './App.css'

const Card = ({title}) => {
  const [hasLiked, sethasLiked] = useState(false);

  return (
    
    <div className='card'>
    <h2> {title}</h2>
    <button onClick= {() => sethasLiked(!hasLiked)}>
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
