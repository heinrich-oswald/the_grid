# The Grid - Event Website

A modern event platform for hosting coding competitions with different formats: Multiplier, Time Bound, and Teams.

## Project Overview

This website provides a platform for organizing and participating in coding challenges with three distinct event types. Each event has its own rules, timeline, and prize structure. The site features a responsive design with interactive elements for registration, FAQ accordions, and a sponsor carousel.

## Event Pages

### 1. Multiplier Event
- **Registration slots:** 10
- **Entry fee:** ₹100
- **Cash prize:** ₹500
- **Preparation time:** 7 days before judging
- **File:** `multiplier.html`
- **Description:** Individual competition with a week to prepare a project based on a given theme.

### 2. Time Bound Event
- **Registration slots:** 10
- **Entry fee:** ₹100
- **Cash prize:** ₹500
- **Challenge time:** 2 hours
- **File:** `timebound.html`
- **Description:** Rapid coding sprint where participants have exactly 2 hours to complete a project once the theme is revealed.

### 3. Teams Event
- **Registration slots:** 5 teams
- **Entry fee:** ₹300 per team
- **Cash prize:** ₹750 (half of total entry fees)
- **Development time:** 1 week before judging
- **File:** `teams.html`
- **Description:** Collaborative challenge for teams of 2-4 developers to work on a project over a week-long period.

## Features

- Responsive design that works on desktop and mobile devices
- Interactive FAQ accordions
- Smooth sponsor carousel with pause-on-hover functionality
- Registration forms with CSV export for admin processing
- Sticky registration buttons and modals for easy access
- Consistent branding and styling across all pages
- Accessible semantic HTML structure

## Setup Instructions

1. Clone this repository to your local machine
2. Ensure you have the following files in place:
   - All HTML files (`index.html`, `multiplier.html`, `timebound.html`, `teams.html`, `rules.html`)
   - An `assets` folder containing `logo.png` and `banner.png`
3. Run a local web server to view the site

### Running the Site Locally

You can use any simple HTTP server to run the site locally. Here are a few options:

#### Using Node.js
```bash
# Install http-server if you haven't already
npm install -g http-server

# Navigate to the project directory
cd the_grid

# Start the server
http-server -p 8000
```

Then open your browser and visit `http://localhost:8000`

## Development Notes

- The site uses pure HTML, CSS, and JavaScript without any frameworks
- Colors, typography, and spacing are defined in CSS variables for consistency
- The registration forms simulate submission by generating CSV files for testing purposes
- All interactive elements (FAQ, carousel, modals) are implemented with vanilla JavaScript
- The design uses a dark theme with accent colors for visual hierarchy

## License

This project is for demonstration purposes only.

## Contact

For more information, contact the event organizers at heinrich.oswald24@gmail.com