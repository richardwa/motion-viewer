import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Item, getListing } from './util/util';
import ReactHlsPlayer from 'react-hls-player';
import jss from 'jss';
import preset from 'jss-preset-default';
jss.setup(preset());

const { classes } = jss.createStyleSheet({
  preview: {
    display: "inline-block",
    width: "250px",
    cursor: "pointer",
    margin: 4,
    textAlign: "center"
  },
  stream: {
    width: "100%",
    maxWidth: "1920px",
    margin: "auto",
    display: "block"
  },
  captures: {
    overflowX: "scroll",
    overflowY: "hidden",
    marginTop: "4px",
    whiteSpace: "nowrap",
    "& > div": {
      margin: "4px",
      display: "inline-block"
    },
    "& video": {
      width: "200px",
      height: "112.5px",
      display: "block"
    },
    "& label": {
      textAlign: "center",
      display: "block"
    }
  }
}).attach();


type Camera = {
  name: string,
  feed: string,
  captures: string
}

const cameras: Camera[] = [{
  name: "doorbell",
  feed: "/streams2/cam1-.m3u8",
  captures: "camera1/"
}, {
  name: "garage",
  feed: "/streams2/cam2-.m3u8",
  captures: "camera2/"
}, {
  name: "stairs",
  feed: "/streams2/cam3-.m3u8",
  captures: "camera3/"
}];

type State = {
  currentCamera: number;
  clips: Item[];
}


function VideoPlayer(props) {
  const {src,...rest} = props;
  return (
    <ReactHlsPlayer
      src={src}
      startPosition={Infinity}
      backBufferLength={30}
      liveSyncDuration={2}
      liveMaxLatencyDuration={3}
      autoPlay="true"
      muted="true"
      {...rest}
    />
  );
}

export class Main extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentCamera: 0,
      clips: []
    }
    this.retrieveClips();
  }

  onClick(i: number) {
    this.setState({ currentCamera: i }, () => {
      this.retrieveClips();
    });
  }
  
  retrieveClips = () => {
    const { currentCamera } = this.state;
    const camera = cameras[currentCamera];
    getListing(`${camera.captures}?C=M;O=D`).then(list => {
      this.setState({ clips: list.files.slice(0, 10) });
    })
  }

  render() {
    
    const { currentCamera, clips } = this.state;
    const camera = cameras[currentCamera];
    return (
    <React.Fragment>
      <div>{
          cameras.map((c, i) => <div key={c.name} className={classes.preview} onClick={() => this.onClick(i)}>{
            (() => i === currentCamera?
                <div className={classes.preview}><b>{c.name}</b></div>:
                <div className={classes.preview}>{c.name}</div>

                //<VideoPlayer title={c.name} className={classes.preview} src={c.feed} controls={false}></VideoPlayer>
                )()
          }</div>)
      }</div>
      
      <VideoPlayer className={classes.stream} src={camera.feed} controls={true}></VideoPlayer>

      <div className={classes.captures}>{
        clips.map(f =>
          <div key={f.name}>
            <video src={f.path} preload="metadata" controls={true} />
            <label>{f.name}</label>
          </div>
        )
      }</div>
    </React.Fragment>);
  }
}


ReactDOM.render(<Main />, document.getElementById("app"));