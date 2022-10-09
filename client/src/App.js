import React, {useState, useEffect} from "react";
import './App.css';
import Axios from 'axios';

function App() {
  const [movieName, setMovieName]= useState("");
  const [review, setReview]= useState("");
  const [movieReviewList, setMovieList]=useState([]);
  const [searchedMovie, setSearchedMovie] = useState([{"movieReview":"No movie selected"}])
  const [searchedMovieName, setSearchedMovieName] = useState("")

  const [newReview, setNewReview]= useState("");

  useEffect(()=>{
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setMovieList(response.data.sort((movie1, movie2) => movie1.movieName.localeCompare(movie2.movieName)));
    });
  }, []);

  function getSearchedMovie() { 
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setSearchedMovie(response.data.filter(movie => movie.movieName == searchedMovieName))
    })
  }

  const submitReview=()=>{

    Axios.post("http://localhost:3001/api/insert", {
      movieName: movieName,
      movieReview: review,
    });

      setMovieList([
        ...movieReviewList,
        { movieName: movieName, movieReview: review },
      ]);

   document.location.reload()

 };


 const deleteReview = (movie) => {
   Axios.delete(`http://localhost:3001/api/delete/${movie}`);
   document.location.reload()
 };

 const updateReview = (movie) => {
   Axios.put("http://localhost:3001/api/update", {
     movieName: movie,
     movieReview: newReview,
   });
   setNewReview("")
   document.location.reload()
 };

  return (
    <div className="App"><h1 id="titre"> CRUD APPLICATION </h1>
    <div className="form">
    <div className="box">
    <label><h3>Add a Movie</h3></label>
    <label>Movie Name:</label>
    <input type="text" name="movieName" onChange={(e)=>{
      setMovieName(e.target.value)
    }}/>
    <label>Review:</label>
    <input type="text" name="Review" onChange={(e)=>{
      setReview(e.target.value)
    }}/>



    <button onClick={submitReview}> Submit </button>
    </div>
    <div className="box">
      <label><h3>Search for Movie:</h3></label>
      <label>Enter Movie Name:</label>
      <input type="text" onChange={(event) => setSearchedMovieName(event.target.value)}></input>
      <button onClick={getSearchedMovie}>Search</button>
      <h2>Review: {searchedMovie[0]?.movieReview}</h2>
    </div>

    <div className="box">
    <label><h2>Movie List</h2></label>
    
    {movieReviewList.map((val)=>{
      return (
        <div>
          
          <div className="card">
            <h1> {val.movieName} </h1>
            <p> {val.movieReview} </p>

            <button onClick={() => {deleteReview(val.movieName)}}>Delete</button>
            <input type="text" id="updateInput" onChange={(e) => {setNewReview(e.target.value)}}/>
            <button onClick={()=> {updateReview(val.movieName)}}>Update</button>
          </div>
        </div>
      );
    })}
    </div>
  </div>
</div>
);
}

export default App;
