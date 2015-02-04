# Scribble

## Setup

Requires:
- Ruby -- see Gemfile for version
- Rails -- see Gemfile for version

## Basic code overview

The code is split into a few distinct pieces: API, Static site (think marketing site / landing page), and what will be several client apps.

*API*

The API is more fleshed out than it should be, as it was built before the UI was designed. Not the best approach, but at this point it is what it is :)

*Static*

This can more or less be ignored, as it is getting a completely new redesign, in part because the UI is way different than it was when that page was designed (if you are curious, you can see it at http://scribble.ly. It's on the free Heroku tier right now, so it's going to load super slow).

*Client*

All client pieces are built with React.js and Flux. Due to the nature of the UI, each client piece has its own app directory `app/assets/javascripts`, with other directories serving as pieces that will be shared between each client. Again, it wasn't this way in the beginning, so there is a bit of stray code, and code that is not as well encapsulated. The lesson here, as with the API, is that coding before UI/UX design is just asking for rework :)

Right now, each client app will contain it's own Flux-style components and actions, while sharing all constants, stores, helpers, and the dispatcher. I'm not married to this design, it just seems to be a good balance between code separation and DRY-ness. The rails views and controller directories should probably be split along these lines to, but have not been as of now. Each app is responsible for everything that happens in it's UI space (in its iframe). Coordination between client apps is handled by `crayon` (see the crayon repo for more info.)

Currently (2/4/15), the only client app that is somewhat encapsulated is `bubble` this piece is responsible for all client code specific to the speech bubble style popup that displays annotations, when clicking on an annotated piece of text. Other modules either in progress or planned, are an authentication client, a client for writing comments / annotations, and a client for handling replies. Coordination between each app wil

`notebook` was the old implementation, that is kept around just to pull code from when reimplementing it's pieces in a more isolated fashion. Getting the chance to reorg code from here is making it a lot cleaner, as this was the first bit of React I'd written, and one of my earliest non-CoffeScript JS projects. In that light, the shared stores should also be cleaned up :)

## Testing

All `rspec`, all the time. Unit and API integration tests are all under the `spec` directory. The `features` directory contains golden-path style acceptance tests, utilizing Capybara on the Chrome driver. There are no JS unit tests. There need to be. `crayon` has a heavy dose of Jasmine for JS testing, which should be implemented here at some point.
