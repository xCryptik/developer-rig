import React, { Component } from 'react';
import PropTypes from 'prop-types';
import closeButton from '../img/close_icon.png';
import './component.sass';

export class EditViewDialog extends Component {
  constructor(args) {
    super(args);
    this.state = {
      x: 0,
      y: 0,
    }
  }

  onChange = (input) => {
    const newState = {};
    newState[input.target.name] = input.target.value;
    this.setState(newState);
  }

  componentDidMount() {
    this.props.views.forEach(element => {
      if (element.id === this.props.idToEdit) {
        this.setState({
          x: element.x,
          y: element.y,
        });
      }
    });
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="edit-view">
        <div className="edit-view__background"/>
        <div className="edit-view__dialog">
          <div className="dialog__top-bar-container">
            <div className="top-bar-container__title"> Edit View </div>
            <div className="top-bar-container__escape" onClick={this.props.closeHandler}><img alt="Close" src={closeButton}/></div>
          </div>
          <hr className="dialog__divider"/>
          <div className="edit-view__content">
            <div className="type-and-size-container__type-title">
                  Position (Percent)
            </div>
              <div className='overlay-custom-container'>
                <div className='overlay-custom-container'>
                <div className="edit-subcontainer__input">
                  <label className="inputs__option-label">X</label>
                  <input type="text" name="x" value={this.state.x} onChange={this.onChange}/>
                </div>
                <div className="edit-subcontainer__input">
                  <label className="inputs__option-label">Y</label>
                  <input type="text" name="y" value={this.state.y} onChange={this.onChange}/>
                </div>
                </div>
              </div>
            </div>
          <hr className="dialog__divider"/>
          <div className="dialog_bottom-bar">
            <div className="bottom-bar__save" onClick={() => this.props.saveViewHandler({ x: this.state.x, y: this.state.y })}> Save </div>
            <div className="bottom-bar__cancel" onClick={this.props.closeHandler}> Cancel </div>
          </div>
        </div>
      </div>
    );
  }
}

EditViewDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  idToEdit: PropTypes.string.isRequired,
  views: PropTypes.array.isRequired,
  closeHandler: PropTypes.func.isRequired,
  saveViewHandler: PropTypes.func.isRequired,
};
