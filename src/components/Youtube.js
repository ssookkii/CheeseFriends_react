import React, {useState} from 'react';
import YouTube from 'react-youtube';
import Modal from 'react-modal'

class Youtube extends React.Component {
    render() {
      const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1,
        },
      };
  
      return <YouTube videoId="Ttwoztq_-Bw" opts={opts} onReady={this._onReady} />;
    }
  
    _onReady(event) {
      event.target.pauseVideo();
    }
  }

export default Youtube;
