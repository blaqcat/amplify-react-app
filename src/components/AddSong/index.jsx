

import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';

import {IconButton, TextField } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { updateSong, createSong} from '../../graphql/mutations'


const AddSong = ({onUpload}) => {

    const [songData, setSongData] = useState({});
    const [mp3Data, setMp3Data] = useState({});
  
    const uploadSong = async () => {
      console.log('songData', songData);
      const {title, description,owner} = songData;
  
      const { key } = await Storage.put(`${uuid()}.mp3`,mp3Data, {contentType: 'audio/mp3' });
  
      const CreateSongInput = {
        id: uuid(),
        title,
        description,
        owner,
        filePath: key,
        like: 0
      }
      await API.graphql(graphqlOperation(createSong, {input: CreateSongInput}));
      onUpload();
      // Upload the song
    }
  
    return (
      <div className="newSong">
        <TextField label="Title"
          value={songData.title}
          onChange ={e => setSongData({ ...songData, title: e.target.value})
          }/>
        <TextField label="Artist"
          value={songData.owner}
          onChange ={e => setSongData({ ...songData, owner: e.target.value})}
        />
        <TextField label="Description"
          value={songData.description}
          onChange ={e => setSongData({ ...songData, title: e.target.value})}
        />
        <input type="file" accept="audio/mp3" onChange={e => setMp3Data(e.target.files[0])} />
        <IconButton onClick={onUpload}>
          <PublishIcon onClick={uploadSong} />
        </IconButton>
      </div>
    )
  }

  export default AddSong;