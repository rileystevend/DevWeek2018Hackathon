import { Audio } from 'expo';
// import {
//   withHandlers,
//   hoistStatics,
//   compose,
//   withStateHandlers,
//   lifecycle,
// } from 'recompose';
import uuid from 'uuid';
import moment from 'moment';

import React from 'react';
import T from 'prop-types';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons/index';
import durationToStr from './dateHelper';
// const s = require('./src/styles');
// import { colors } from './src/styles';


export default class App extends React.Component {

state = {
      recording: null,
      isRecording: false,
      durationMillis: 0,
      isDoneRecording: false,
      fileUrl: null,
      audioName: '',
    }
  
  recordingCallback ({ durationMillis, isRecording, isDoneRecording }) {
   this.setState({ durationMillis, isRecording: false, isDoneRecording: true})
  }

  setAudioName (audioName) {
    this.setState({ audioName })
  }

    async onStartRecording () {
      console.log(this)
        await setAudioMode({ allowsRecordingIOS: true });

        const recording = new Audio.Recording();
        // recording.setOnRecordingStatusUpdate(this.recordingCallback);
        recording.setProgressUpdateInterval(200);

        this.setState({ fileUrl: null });

        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        this.setState({ recording });

        function setAudioMode ({ allowsRecordingIOS }) {
          Audio.setAudioModeAsync({
            allowsRecordingIOS,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true
          });
      }
      
    }



    async onEndRecording () {
        await this.state.recording.stopAndUnloadAsync();
        await this.setAudioMode({ allowsRecordingIOS: false });

      if (this.state.recording) {
        const fileUrl = this.state.recording.getURI();
        this.state.recording.setOnRecordingStatusUpdate(null);
        this.setState({ recording: null, fileUrl });
      }
    }

    async onCancelRecording () {
      if (!this.state.recording) {return}

        await this.state.recording.stopAndUnloadAsync();


      this.state.recording.setOnRecordingStatusUpdate(null);
      this.setState({ recording: null });
    }

    onSubmit () {
      if (this.state.audioName && this.state.fileUrl) {
        const audioItem = {
          id: uuid(),
          recordDate: moment().format(),
          title: this.state.audioName,
          audioUrl: this.state.fileUrl,
          duration: this.state.durationMillis,
        };

        this.addAudio(audioItem);
        this.setState({
          audioName: '',
          isDoneRecording: false,
        });
      }
    }
    onCancelSave () {
      this.setState({
        audioName: '',
        isDoneRecording: false,
        fileUrl: null,
      });
    }
  
    render () {
      if (this.state.isDoneRecording) {
        return (
          <View >
            <TouchableOpacity
              onPress={this.onCancelSave}
              
            >
              {/* <Icon
                size={36}
                color={colors.red}
                IconSet={Ionicons}
                iconName="md-close"
              /> */}
              <Button title="click me" onPress={() => {console.log('hello world')}}/>
            </TouchableOpacity>
    
            <TextInput
              
              placeholder="Give a name for your audio"
              value={this.state.audioName}
              onChangeText={this.setAudioName}
              underlineColorAndroid={colors.transparent}
              autoCorrect={false}
              onSubmitEditing={this.onSubmit}
              returnKeyType="done"
              autoFocus
            />
    
            <Button
              
              buttonStyle={s.submitButton}
              title="Continue"
              onPress={this.onSubmit}
              disabled={!this.state.audioName}
            />
          </View>
        );
      } else if (this.state.isRecording) {
        return (
          <View >
    
            <View >
              <Text >Recording Audio</Text>
              {/* <Text >
                {durationToStr(this.state.durationMillis)}
              </Text> */}
            </View>
    
            <TouchableOpacity
              
              onPress={this.onEndRecording}
            >
             
              <Button title="clicker" onPress={() => {this.onEndRecording}}/>
            </TouchableOpacity>
    
          </View>
        );
      }
    
      return (
        <View>

        <Text>{'----------------------------\/n----------------------------------------------------------'}</Text>
       
            
            <Button title='hey click!' style={{marginTop: 150}} onPress={this.onStartRecording}/>

        </View>
      );
    
    
}
    
}

