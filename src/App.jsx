
import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import SongList from './components/songList/index'
import { Button } from '@material-ui/core';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Signin from './components/signIn/index';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AssessLoggedInState()
  }, [])

  const AssessLoggedInState = () => {
    Auth.currentAuthenticatedUser()
    .then(sess => {
      setLoggedIn(true)
    }).catch(() => {
      setLoggedIn(false)
    });
  }

  const signOut = async () => {
    try {
      await Auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.log('error signing out ', error);
    }
  };

  const onSignIn = () => {
    setLoggedIn(true);
  }

  return (
    <Router>
       <div className="App">
      <header className="App-header">
      { loggedIn ? (
      <Button variant="contained" color="primary" onClick={signOut}>
         Sign Out
         </Button> ) : (
           <Link to="signin"> <Button variant="contained" color="primary">
           Sign In
           </Button></Link> )} 
       <h2>My App Content</h2>
      </header>


        <Route exact path="/">
         <SongList />
        </Route>
        <Route exact path='/signin'> 
          <Signin onSignIn={AssessLoggedInState}>
            Sign In
          </Signin>

        </Route>
    

      
      
    </div>
    </Router>
   
  );
}

export default App;


