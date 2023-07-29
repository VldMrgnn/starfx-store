import React, { Component } from "react";
import LunaObjectViewer from "luna-object-viewer";
import "luna-object-viewer/luna-object-viewer.css";
import "./viewer.scss";

class LunaStateViewer extends Component {
  public stateViewer?: LunaObjectViewer;
  stateViewerRef = React.createRef<HTMLDivElement>();
  componentDidMount() {
    const stateContainer = this.stateViewerRef.current;
    this.stateViewer = new LunaObjectViewer(stateContainer, {
      unenumerable: true,
      accessGetter: true,
    });
    window.fx.subscribe(() => {
      this.setState({
        state: window.fx.getState(),
      });
    });
    this.stateViewer?.set(window.fx.getState());
  }
  componentDidUpdate(prevProps, prevState, snapshot?: any): void {
    this.stateViewer?.set(this.state);
  }
  componentWillUnmount() {
    this.stateViewer?.destroy();
  }
  render() {
    return <div id={"StateView"} ref={this.stateViewerRef} />;
  }
}

export default LunaStateViewer;
