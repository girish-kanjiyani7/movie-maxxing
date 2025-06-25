import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from '../appwrite';

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
    const [trendingMovies, settrendingMovies]= useState([]);

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
        if (query && data.results.length>0){
          await updateSearchCount(query,data.results[0]);
        }
      } catch (error){
        console.error(`Error fetching Movies: ${error}`);
        seterrorMessage(`Error fetching Movies. Please try again later.`);
      }
      finally{
        setisLoading(false);
      }
   }
   const loadTrendingMovies =  async() =>{
    try{
      const movies = await getTrendingMovies();
      settrendingMovies(movies);
    }
    catch (error){
      console.error(`Error fetching Movies: ${error}`);
      
   }
  }
    useEffect(() => {
      fetchMovies(debouncesearchitem);
    }, [debouncesearchitem]);

    useEffect(() => {
      loadTrendingMovies();
    }, []);


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
        

          
        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index +1}</p>
                  <img src={movie.poster_url} alt={movie.title}/>

                </li>
              ))}
            </ul>

          </section>
        )}

        

<section className='all-movies'>
          <h2>All movies</h2>
          { isLoading ? (
            <Spinner/>
          ) 
          :errorMessage ? (
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
