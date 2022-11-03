# Scramble Organizer ![GitHub](https://img.shields.io/github/license/simonkellly/scramble-organizer)

![GitHub last commit](https://img.shields.io/github/last-commit/simonkellly/scramble-organizer)
![GitHub deployments](https://img.shields.io/github/deployments/simonkellly/scramble-organizer/github-pages)
![GitHub top language](https://img.shields.io/github/languages/top/simonkellly/scramble-organizer)

A quick tool to sort the passwords used for protecting WCA scramble pdfs in competitions. This will organize them in order of the events as they are held as per the schedule, and can then be used sequentially in something like Google Keep

This was originally a script in my [WCIF Tools](https://github.com/simonkellly/wcif-tools/blob/main/scripts/ScramblePasswordOrganizer.ts) but I decided to make a web interface for it so that it could be used a bit easier.

## Development

### Required Tools
To be able to work on this project, the following tools are required:

- Git
- Node.js v18
- Yarn

### Setup

```
# clone the repo
$ git clone https://github.com/simonkellly/scramble-organizer.git

# change directory
$ cd scramble-organizer

# install nodejs dependenies
$ yarn

# run the development build
$ yarn dev
```
Open http://localhost:5173/scramble-organizer/ with your browser to see the result.
