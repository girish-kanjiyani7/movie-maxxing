import React from 'react';

const Search = ({searchitem,setsearchitem}) => {
  return (
    <div className= 'search'>
        <div>
            <img src="search.svg" alt="search" />
            <input
            type='text'
            placeholder='Search through thousands of Movies'
            value={searchitem}
            onChange={(event) => setsearchitem(event.target.value)}/>
        </div>
    </div>
  )
}
export default Search