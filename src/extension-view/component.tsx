import * as React from 'react';
import './component.sass';
import { ExtensionFrame } from '../extension-frame';
import { IdentityOptions } from '../constants/identity-options';
import { ViewerTypes } from '../constants/viewer-types';
import * as closeButton from '../img/close_icon.png';
import { ExtensionComponentView } from '../extension-component-view';
import { ExtensionMobileView } from '../extension-mobile-view/component';
import { RigExtension, FrameSize } from '../core/models/rig';
import { Position } from '../types/extension-coordinator';
import { ExtensionAnchor, ExtensionMode, ExtensionViewType, ExtensionPlatform} from '../constants/extension-coordinator';

export const ConfigViewWrapperDimensions = Object.freeze({
  overflow: "auto",
  height: "70vh",
});

export const ConfigViewDimensions = Object.freeze({
  width: "100%",
  height: "700px",
});

export const PanelViewDimensions = Object.freeze({
  width: "320",
  height: "300",
});


interface ExtensionViewProps {
  id: string;
  extension: RigExtension;
  type: string;
  mode: string;
  role?: string;
  linked?: boolean;
  orientation?: string;
  deleteViewHandler?: (id: string) => void;
  openEditViewHandler?: (id: string) => void;
  position?: Position;
  frameSize?: FrameSize;
}

interface State {
  mousedOver: boolean;
}

interface ExtensionProps {
  viewStyles: React.CSSProperties;
  viewWrapperStyles: React.CSSProperties;
}

export class ExtensionView extends React.Component<ExtensionViewProps, State> {
  public state: State = {
    mousedOver: false,
  };

  private mouseEnter() {
    this.setState({
      mousedOver: true,
    });
  }

  private mouseLeave() {
    this.setState({
      mousedOver: false
    });
  }

  public renderView(extensionProps: ExtensionProps) {
    let view = null;
    switch (this.props.type) {
      case ExtensionAnchor.Component:
        view = (<ExtensionComponentView
          id={`component-${this.props.id}`}
          role={this.props.role}
          className="view"
          extension={this.props.extension}
          frameSize={this.props.frameSize}
          position={this.props.position}
        />);
        break;
      case ExtensionViewType.Mobile:
        view = (<ExtensionMobileView
          id={`mobile-${this.props.id}`}
          className="view"
          role={this.props.role}
          extension={this.props.extension}
          frameSize={this.props.frameSize}
          position={this.props.position}
          orientation={this.props.orientation}
        />);
        break;
      default:
        // standard view for overlays, panels, live config, and broadcaster config
        view = (<div
          className="view"
          style={extensionProps.viewStyles}>
          <ExtensionFrame
            className="view"
            frameId={`frameid-${this.props.id}`}
            extension={this.props.extension}
            type={this.props.type}
            mode={this.props.mode}
          />
        </div>)
        break;
    }
    return view;
  }

  private renderLinkedOrUnlinked() {
    return this.props.linked ? IdentityOptions.Linked : IdentityOptions.Unlinked;
  }

  private isEditable() {
    return this.props.type === ExtensionAnchor.Component || this.props.type === ExtensionPlatform.Mobile;
  }

  public render() {
    let extensionProps = {
      viewStyles: {},
      viewWrapperStyles: {},
    };

    let panelHeight = PanelViewDimensions.height;
    if (this.props.extension.views.panel && this.props.extension.views.panel.height) {
      panelHeight = this.props.extension.views.panel.height + '';
    }
    switch(this.props.type) {
      case ExtensionAnchor.Panel:
        extensionProps.viewStyles = {
          height: panelHeight + 'px',
          width: PanelViewDimensions.width + 'px',
        }
        break;
      case ExtensionAnchor.Overlay:
        extensionProps.viewStyles = {
          width: this.props.frameSize.width + 'px',
          height: this.props.frameSize.height + 'px'
        };
        break;
      case ExtensionMode.Config:
        extensionProps.viewStyles = ConfigViewDimensions;
        extensionProps.viewWrapperStyles = ConfigViewWrapperDimensions;
        break;
      case ExtensionViewType.LiveConfig:
        extensionProps.viewStyles = {
          height: panelHeight + 'px',
          width: PanelViewDimensions.width + 'px',
        }
        break;
      default:
        extensionProps.viewStyles = {
          height: PanelViewDimensions.height + 'px',
          width: PanelViewDimensions.width + 'px',
        }
        break;
    }

    return (
      <div
        className={'view__wrapper'}
        onMouseEnter={() => { this.mouseEnter() }}
        onMouseLeave={() => { this.mouseLeave() }}
        style={extensionProps.viewWrapperStyles}>
        <div
          className={'view__header'}>
          {(this.props.deleteViewHandler !== undefined && this.state.mousedOver) &&
            (
            <div>
              <div className={'view__close_button'}
                onClick={() => { this.props.deleteViewHandler(this.props.id) }}>
              <img
                alt='Close'
                src={closeButton}
              />
              </div>
              { this.isEditable() &&
                <div className='view__edit_button'
                onClick={() => { this.props.openEditViewHandler(this.props.id) }}>
                Edit
                </div>}
            </div>
          )
          }
          <div className={'view__descriptor'}>
            { this.props.role }
          </div>
          <div className={'view__descriptor'}>
            {(this.props.role === ViewerTypes.LoggedIn) ?
              this.renderLinkedOrUnlinked() : null}
          </div>
        </div>
        {this.renderView(extensionProps)}
      </div>
    );
  }
}
