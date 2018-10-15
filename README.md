# Twitch Extensions Developer Rig
[![Build Status](https://travis-ci.org/twitchdev/developer-rig.svg?branch=master)](https://travis-ci.org/twitchdev/developer-rig) [![Coverage Status](https://coveralls.io/repos/github/twitchdev/developer-rig/badge.svg)](https://coveralls.io/github/twitchdev/developer-rig)

## Quickstart to Running the Developer Rig
The Developer Rig can be used in two modes to test your Extension, Online Mode and Local Mode.  Online Mode will let you test with production APIs and hosted assets on Twitch, but will first require completion of Extensions Developer onboarding [here](https://dev.twitch.tv/dashboard).  The Rig also supports Local Mode to let you get started building quickly pre-onboarding, using mock versions of the APIs.

Take these steps to get the Rig running:

1.  If you already have [Git](https://git-scm.com/download) installed, clone the rig.  Otherwise, [download and extract the Zip file](https://github.com/twitchdev/developer-rig/archive/master.zip).
2.  Open the `scripts` folder in the `developer-rig` folder.
3.  Double-click the `configure` file on Mac, `configure.cmd` file on Windows.  The first time you run the script it will take a while since it will install and configure all of the dependencies.
4. Double-click the `run` file on Mac, `run.cmd` file on Windows.  Alternatively, open a terminal, navigate to the root folder of the Developer Rig on your machine, type `yarn start`.

Once in the Rig, sign in with your Twitch credentials and create your first Extension Project.  Learn more [here](https://dev.twitch.tv/docs/extensions/rig/).


## Troubleshooting

#### I’m sure my Developer Rig configuration is correct, but my extension doesn’t work
Clear your browser cache and local storage and restart the developer rig.

To delete the rig's local storage open the javascript console in your browser on a tab with the rig open and do localStorage.clear(); then refresh.

Ensure you've included the Twitch Extensions Helper in your front-end files.

#### When setting up the Rig on Windows 10, my system settings do no allow me to run scripts downloaded from the internet
Make sure to adjust your security settings to “Developer Mode” in the For Developers section of your System Settings.

#### I get an error when trying to run yarn test
Sometimes deleting and reinstalling your node_modules fixes this issue.

On macOS, you may need to explicitly install watchman via brew install watchman.

#### yarn install fails in libssh2
See [issue #48](https://github.com/twitchdev/developer-rig/issues/48). Be sure libssh and its dependencies are installed.

#### I get an error when pulling in the example project
Ensure that Git is in your PATH variables by trying to run git at your command line. If that works, also ensure that the local folder does not currently exist.

#### The Developer Rig stops running unexpectedly in local mode
Try deleting the node_modules directory and rerunning yarn install in your root Developer Rig folder.

#### I created my extension manifest on the Twitch dev site but can’t find my front-end files
If you created your extension manifest on the Twitch dev site, you must specify your Base Testing URI as https://localhost.rig.twitch.tv:8080. This field is discussed under Asset Hosting, in Releasing & Maintaining an Extension.
