import * as React from 'react';
import './component.sass';
import { LoginButton } from '../login-button';

export class SignInDialog extends React.Component {
  public render() {
    return (
      <div className="sign-in">
        <div className="sign-in__background" />
        <div className="sign-in__dialog">
          <div className="dialog__top-bar-container">
            <div className="top-bar-container__title"> Please Sign In </div>
          </div>
          <div>
            <hr className="dialog__divider" />
            <div className='sign-in__text'>
              <p>Why do I need to sign in?</p>
              <p>We built the Developer Rig with one goal in mind: helping developers build extensions faster.  We want to make sure you’re spending your time coding, not on process.  To take advantage of the Rig’s features, we need you to sign in.  You can look forward to more new features the coming months.</p>
              <p>We really appreciate you being part of the Twitch developer community. We’re excited to see what kind of extensions you’ll make!</p>
            </div>
            <div className="sign-in__bottom-bar">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
