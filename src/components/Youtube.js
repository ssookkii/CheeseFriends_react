import React from 'react';
import YouTube from 'react-youtube';

class Youtube extends React.Component {
    render() {
      const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
  
      // youtube videoID 입력 
      // youtuve videoID 알아보는 방법 
      // https://www.youtube.com/watch?v=jdTsJzXmgU0&list=PLuHgQVnccGMCeAy-2-llhw3nWoQKUvQck
      //여기서 watch?v= 하고 나오는 부분이 videoID , 조심할 것 videoID 뒤에 붙는 아이들, & 이나 = 이나 제외하고  ID 만 입력할것
      return <YouTube videoId="Ttwoztq_-Bw" opts={opts} onReady={this._onReady} />;
    }
  
    _onReady(event) {
      // access to player in all event handlers via event.target
      event.target.pauseVideo();
    }
  }

export default Youtube;