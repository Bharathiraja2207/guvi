import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Navigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { Route,Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import { useFormik } from 'formik';
import {Card,CardActions,CardContent, TextField } from '@mui/material';
// import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
// import { useFormik } from 'formik';
// import { TextField } from '@mui/material';


export default function App() {
  return (
    <div className="App">
      <ButtonAppBar/>
      <Routes>
      <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Login />} />
      <Route path='/mycomponent' element={<Proudctedroute> <MyComponent/></Proudctedroute> }> </Route>
      <Route path='/id' element={<Proudctedroute> < MovieList/></Proudctedroute> }></Route>
      </Routes>
       </div>
  )
}

function ButtonAppBar() {
  const navigate=useNavigate()

  const handleClick = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate("/login")
    }, 1500);
    console.log("logout")
  }
   return (
     <div  className='navbar'>
     <Box sx={{ flexGrow: 1 }}>
       <AppBar position="static">
         <Toolbar>
           <IconButton
             size="large"
             edge="start"
             color="inherit"
             aria-label="menu"
             sx={{ mr: 2 }}
           >
           </IconButton>
           <div className='button_nav'>
            <div>
              <Button color="inherit"  onClick={()=>navigate("/")}>Home</Button>
              <Button color="inherit"  onClick={()=>navigate("/id")}>USERID</Button>
              <Button color="inherit"  onClick={()=>navigate("/mycomponent")}>ADDUSER</Button>
           </div>
            <div>
            {
        localStorage.getItem("token") == null ?
          (<Button sx={{ m: 1 }} variant="outlined" color="inherit" onClick={() => navigate("/login")}>Login</Button>
          ) : (
            <Button onClick={handleClick} variant="outlined" color="inherit">LOGOUT</Button>
          )}
            </div>
           </div>
           
          
         </Toolbar>    
       </AppBar>
      
     </Box>
     </div>
   );
 }

function Login() {
  const navigate = useNavigate();
  const [formstate, setformstate] = useState("success");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    // validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      console.log("submit");
      const data = await fetch("https://ysquare-backend-bice.vercel.app/users/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(values)
      });
      if (data.status === 400) {
        console.log("error");
        setformstate("error");
      } else {
        setformstate("success");
        const result = await data.json();
        console.log("success", result);
        localStorage.setItem("token", result.token);
        navigate("/mycomponent");
      }

    }
  });
  return (
    <div className="login-card">

      <Card sx={{ mx: 2, minHeight: 300 }} className="card">
        <CardContent>
          <form onSubmit={formik.handleSubmit} className='loginform'>
            <h2>LOGIN</h2>
            <div className='loginfield'>
              <TextField
                name='email'
                value={formik.values.username}
                onChange={formik.handleChange}
                label="email"
                variant="outlined" />
              <TextField
                value={formik.values.password}
                onChange={formik.handleChange}
                label="Password"
                name="password"
                type="password"
                variant="outlined" />

              <CardActions className="btn">
                <Button color={formstate} type='submit' variant="contained">{formstate === "success" ? "submit" : "retry"}</Button>
                <label className="alreadyuser" onClick={() => navigate("/")}>Sign in</label>
              </CardActions>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
function Signin() {
  const navigate = useNavigate();
  const [formstate, setformstate] = useState("success");
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    onSubmit: (newdata) => {
      adddata(newdata);
    }
  });

  const adddata = async(newdata) => {
    console.log(newdata);

    const data=await fetch("https://ysquare-backend-bice.vercel.app/users/signup", {
      method: "POST",
      body: JSON.stringify(newdata),
      headers: {
        "content-type": "application/json"
      }
    });
    if (data.status === 400) {
      console.log("error");
      setformstate("error");
    } else {
      setformstate("success");
      navigate("/login");
    }
    
  };
  return (
    <div className="signin-card">
      <Card sx={{ mx: 2, minHeighteight: 350 }} className="card">
        <form onSubmit={formik.handleSubmit} className='loginform'>
          <h2>SIGNUP</h2>
          <div className='loginfield'>
            <TextField
              placeholder="username"
              name='username'
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Username"
              variant="outlined" required />
            <TextField
              placeholder="email"
              name='email'
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="email"
              type='email'
              variant="outlined" required />
           
             <TextField
              placeholder="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Password"
              name="password"
              type="password"
              variant="outlined" required />
             <Button color={formstate} type='submit' variant="contained">{formstate === "success" ? "submit" : "retry"}</Button>

            <p className="alreadyuser" onClick={() => navigate("/login")} sx={{ fontSize: 7 }}>
              <a>Login</a>
            </p>
          </div>

        </form>
      </Card>
    </div>

  );
}


function Proudctedroute({children}){
  const token=localStorage.getItem('token');
  return(
   token? <section>{children}</section>:<Navigate replace to="/"/>
  )
}


function MyComponent() {
 
  const navigate = useNavigate();
  const { handleChange, handleSubmit, handleBlur, values } = useFormik({
    initialValues: {
      id: "",
      name: "",
      age: "",
      DOB: "",
      mobile: "",
      blood: ""
    },
    onSubmit: (values) => {
      console.log("form values", values);
      addMovies(values);
      navigate("/id");
    }
  });
  const addMovies = (values) => {
    fetch("https://guvibackend-nine.vercel.app/", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "content-type": "application/json"
      }
    });
  };
  return (
    <div className='main addmovie'>
      <form className="addmovies" onSubmit={handleSubmit}>
        <TextField name="id"
          fullWidth sx={{ m: 1 }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.id}
          id="outlined-basic"
          label="id"
          variant="standard"></TextField>
        <TextField name="name"
          fullWidth sx={{ m: 1 }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.name}
          id="outlined-basic"
          label="name"
          variant="standard"></TextField>
          <TextField name="age"
          fullWidth sx={{ m: 1 }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.age}
          id="outlined-basic"
          label="age"
          variant="standard"></TextField>
        <TextField name="DOB"
          fullWidth sx={{ m: 1 }}
          id="outlined-basic"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.DOB}
          label="DOB"
        
          variant="standard"></TextField>
           <TextField name="mobile"
          fullWidth sx={{ m: 1 }}
          id="outlined-basic"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.mobile}
          label="mobile"
          variant="standard"></TextField>
        <TextField name="blood"
          fullWidth sx={{ m: 1 }}
          id="outlined-basic"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.blood}
          label="blood"
          variant="standard"></TextField>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

function MovieList() {
  const [search, setsearch] = useState("");
  const [movieList, setMovieList] = useState([]);
  useEffect(() => {
    fetch("https://guvibackend-nine.vercel.app/guvi/")
      .then((data) => data.json())
      .then((mvs) => setMovieList(mvs));
  }, []);

  return (
    <div className="movie-list...">
      {/* <div className='searchbar'> <TextField type="text" placeholder='search movie...' onChange={(event) => setsearch(event.target.value)} /></div> */}
      <div className='movie-list'>
        {movieList.filter((mv) => {
          if (search === "") {
            return mv;
          } else if (mv.name.toLowerCase().includes(search.toLowerCase())) {
            return mv;
          }
        }).map((mv, id, key) => <Movies keys={key} movie={mv} id={mv.id} />)}
      </div>
    </div>

  );
}

function Movies({ movie, id, keys }) {
  const navigate = useNavigate();
  return (
    <div className='moviearrange'>
      <Card >

        <div key={keys} className="movie-container">

          {/* <img className="movie-poster" src={movie.poster} alt={movie.name} /> */}
          <CardContent>
            <div>
              <div className="movie-data">
                <CardActions>
                  <p className="movie-name"><h2>{movie.name}
                    <IconButton color="primary" fontSize="small"
                      onClick={() => navigate(`/movies/${id}`)}>
                      </IconButton>
                  </h2></p>
                 <h2>Age</h2>: <p className="movie-rating">{movie.age}</p>
                 <h2>mobile</h2>:  <p className="movie-summary">{movie.mobile}</p>
                 <h2>blood</h2>: <p className="movie-summary">{movie.blood}</p>
                </CardActions>
              </div>
              
            </div>

          </CardContent>
        </div>

      </Card>
    </div>

  );
}
