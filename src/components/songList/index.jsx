

import { IconButton, Paper, TextField} from '@material-ui/core';
import React from 'react';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PauseIcon from '@material-ui/icons/Pause';
import AddIcon from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';

import { listSongs } from '../../graphql/queries';
import { updateSong, createSong } from '../../graphql/mutations'

import { useState } from 'react';
import { useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import ReactPlayer from 'react-player';

import AddSong from '../AddSong';


const SongList = () => {
    const [songs, setSongs] = useState( [] );
    const [songPlaying, setSongPlaying] = useState('');
    const [audioURL, setAudioURL] = useState('');
    const [showAddSong, setShowAddNewSong] = useState(false);
  
    useEffect(() => {
      fetchSongs()
    }, []);
  
    const toggleSongs = async idx => {
      if (songPlaying === idx) {
        setSongPlaying('')
        return
      }
  
      const songFilePath = songs[idx].filePath;
      try {
          const fileAccessURL = await Storage.get(songFilePath, { expires: 60 });
          console.log('access url', fileAccessURL);
          setSongPlaying(idx);
          setAudioURL(fileAccessURL);
          return;
  
      } catch (error) {
        console.error('error accessing the file from s3', error);
        setAudioURL('');
        setSongPlaying('');
  
    }
    }
  
    
  
    const fetchSongs = async (req, res) => {
      try {
        const songData = await API.graphql(graphqlOperation(listSongs));
        const songList = songData.data.listSongs.items;
        console.log('song list', songList);
        setSongs(songList);
      } catch (error) {
          console.log('error on fetching songs', error);
      }
    };
  
    const addLike = async(idx) => {
      try {
        const song =  songs[idx];
        song.like = song.like +1;
        delete song.createdAt;
        delete song.updatedAt;
  
        const songData = await API.graphql(graphqlOperation(updateSong,{ input: song }));
        const songList = [...songs];
        songList[idx] = songData.data.updateSong;
        setSongs(songList);
  
      } catch (error) {
          console.log('error on adding Like to songs', error);
      }
    }
    return (
        <div className="songList">
        { songs.map((song, idx) =>{
          return (
            <Paper variant="outlined" elevation={2} key={'song${idx}'}>
              <div className="songCard">
                <IconButton aria-label="play" onClick={() => toggleSongs(idx)}>
                    {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon /> }
                </IconButton>
                <div>
                  <div className="songTitle">{song.title}</div>
                  <div className="songOwner">{song.owner}</div>
                </div>
                <div>
                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                      <FavoriteIcon />
                     </IconButton>
                      {song.like}
                </div>
                <div className="songDescription">{song.description}</div>
              </div>
              {
                songPlaying === idx ? (
                  <div class="ourAudioPLayer">
                    <ReactPlayer
                      url={audioURL}
                      controls
                      playing
                      height="50px"
                      onPause={() =>toggleSongs(idx)}
                     />
                  </div>
                ): null
              }
            </Paper>
          );
        })}
        {
            showAddSong ? (
              <AddSong onUpload={() => {
                setShowAddNewSong(false);
                fetchSongs();
              }}
               />
          ): (
              <IconButton onClick={() => setShowAddNewSong(true)}>
                <AddIcon />
              </IconButton>
        )}
      </div>
    )

}

export default SongList