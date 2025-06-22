import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/moviecard';
import {useDebounce} from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
const App = () => {
    const [searchitem, setsearchitem] = useState('');
    const [errorMessage, seterrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [debouncesearchitem, setdebouncesearchitem] = useState('');

    useDebounce(() => setdebouncesearchitem(searchitem), 500,[searchitem] )

    const fetchMovies = async(query = '') => {
      setisLoading(true);
      seterrorMessage('');
      try{
        const endpoint = query? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
                          :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch (endpoint, API_OPTIONS);
        

        if(!response.ok){
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        if(data.Response=='False'){
          seterrorMessage(data.Error || 'Failed to fetch Movies');
          setMovieList([]);
          return;
        }
        setMovieList(data.results || [])
      } catch (error){
        console.error(`Error fetching Movies: ${error}`);
        seterrorMessage(`Error fetching Movies. Please try again later.`);
      }
      finally{
        setisLoading(false);
      }
   }

    useEffect(() => {
      fetchMovies(debouncesearchitem);
    }, [debouncesearchitem]);



  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
            <img src='./hero.png' alt='Hero banner'/>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
        </header>

        <Search searchitem={searchitem} setsearchitem={setsearchitem}  />
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All movies</h2>
          { isLoading ? (
            <Spinner/>
          ) :errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>{movieList.map((movie)=>(
              <MovieCard key={movie.id} movie={movie}/>
            ))}</ul>
          )}
        </section>
        
      </div>
    </main>
  )
}

export default App;
