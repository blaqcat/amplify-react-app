import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import SongList from './components/songList/index'


Amplify.configure(awsconfig)

function App() {


  return (
    <div className="App">
      <header className="App-header">
       <AmplifySignOut />
       <h2>My App Content</h2>
      </header>
      <SongList />
      
    </div>
  );
}

export default withAuthenticator(App);


