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
  feed: "/streams/cam1-.m3u8",
  captures: "camera1/"
}, {
  name: "garage",
  feed: "/streams/cam2-.m3u8",
  captures: "camera2/"
}, {
  name: "stairs",
  feed: "/streams/cam3-.m3u8",
  captures: "camera3/"
}];

type State = {
  currentCamera: number;
  clips: Item[];
}

export class Main extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentCamera: 1,
      clips: []
    }
  }

  onClick(i: number) {
    this.setState({ currentCamera: i }, () => {
      // this.retrieveClips();
    });
  }

  render() {
    const { currentCamera } = this.state;
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
      <ReactHlsPlayer src={camera.feed}
      autoPlay={true}
      controls={true}
      width="100%"
      height="auto"
    />
    </React.Fragment>);
  }
}


ReactDOM.render(<Main />, document.getElementById("app"));