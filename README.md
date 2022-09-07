# Climatology
Climatology BETA - monday.com app

Hey, and thanks for helping me submit my app for the hackathon!

All the code is here, in development status.

TODO:
(ordered by urgency)
- Collaborators! Working solo can be difficult, and a team could be very helpful and rewarding :)
- Climatiq API call rate limit checker (right now it is just a timing function)
- Improved range of Climatiq emissions factors, right now only five (albeit very general candidates) are supported.
    - This will also need new citations vetted and added.
    - For larger organizations, possibly add option to use their own Climatiq API key
- Better GPT-3 bakes, needs to be more specific on moto vehicles
- Better GPT-3 bakes, greater range of industries to support

### Build Instructions
- requires `create-react-app`
- simply follow the [monday.com board views tutorial](https://developer.monday.com/api-reference/docs/board-view-queries), and replace the `App.js` and `index.css` with their respective files here. Everything else is unnecessary to replace.
