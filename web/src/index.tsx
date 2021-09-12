import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Item, getListing } from './util/util';
import ReactHlsPlayer from 'react-hls-player';
import jss from 'jss';
import preset from 'jss-preset-default';
jss.setup(preset());

const { classes } = jss.createStyleSheet({
  preview: {
    width: "200px",
    height: "112.5px",
    cursor: "pointer",
    margin: 4
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
  feed: "/streams/1",
  captures: "camera1/"
}, {
  name: "garage",
  feed: "/streams/2",
  captures: "camera2/"
}, {
  name: "stairs",
  feed: "/streams/3",
  captures: "camera3/"
}];

type State = {
  currentCamera: number;
  clips: Item[];
}


function VideoPlayer(props) {
  const playerRef = React.useRef();
  const {src} = props;
  return (
    <ReactHlsPlayer
      playerRef={playerRef}
      src={src}
      autoplay="true"
      muted={true}
      controls={true}
      width="100%"
      height="auto"
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
        cameras.map((c, i) =>
          <img title={c.name} key={c.name}
            className={classes.preview}
            onClick={() => this.onClick(i)}
            src={c.feed}></img>)
      }</div>
      <img className={classes.stream} src={camera.feed}></img>
      <div className={classes.captures}>{
        clips.map(f =>
          <div>
            <video src={f.path} preload="metadata" controls={true} />
            <label>{f.name}</label>
          </div>
        )
      }</div>
    </React.Fragment>);
  }
}


ReactDOM.render(<Main />, document.getElementById("app"));