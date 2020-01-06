import { Component, h, State, Prop } from "@stencil/core";
import { interpret, Interpreter } from "xstate";
import { mediaMachine, MediaContext, MediaStateSchema, MediaEvent, Events } from "./media-machine";

@Component({
  tag: "x-media",
  styleUrl: "media.css",
  shadow: true
})
export class XMedia {

  @State() state: MediaStateSchema;

  @Prop() src: string;

  private _service: Interpreter<MediaContext, MediaStateSchema, MediaEvent>;
  private _videoEl: HTMLVideoElement;

  componentWillLoad() {
    const that = this;
    this._service = interpret<MediaContext, MediaStateSchema, MediaEvent>(mediaMachine.withConfig({
      actions: {
        play: (_ctx, _event) => {if (that._videoEl) { that._videoEl.play() }},
        pause: (_ctx, _event) => {if (that._videoEl) { that._videoEl.pause() }}
      }
    })).onTransition(current => {
      this.state = { current }
    });

    this._service.start();
    this._service.send(Events.START);
  }

  componentDidUnload() {
    this._service.stop();
  }

  render() {
    const { current } = this.state;
    const { send } = this._service;

    return (
      <div>
        <video
          ref={el => (this._videoEl = el)}
          width="300"
          src={this.src}
        />
        <div>
          {current.matches("active.playing") ? (
            <button onClick={() => send(Events.PAUSE)}>Pause</button>
          ) : (
            <button onClick={() => send(Events.PLAY)}>Play</button>
          )}
        </div>
      </div>
    );
  }
}
