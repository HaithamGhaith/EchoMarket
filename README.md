# EchoMarket

![EchoMarket Logo](./src/assets/images/EchoMarket.png)

A modern, voice-controlled e-commerce web application built with React.

## Description

EchoMarket is a proof-of-concept online store that allows users to browse products, add them to a cart, and simulate a checkout process. The standout feature of this application is the integration of voice commands, allowing for hands-free navigation and interaction.

## Features

-   **Product Listings:** Browse a catalog of products.
-   **Shopping Cart:** Add/remove items from your cart.
-   **Checkout Process:** A simulated checkout page.
-   **User Authentication:** A simple sign-in form.
-   **Voice Commands:** Control the application using your voice.
    -   Navigate between pages.
    -   Add items to the cart.
    -   ...and more!

## Tech Stack

-   **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
-   **UI Components:** [Material-UI](https://mui.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Voice Recognition:** [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition)

## Setup and Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  Clone the repo
    ```sh
    git clone <your-repo-url>
    ```
2.  Navigate to the project directory
    ```sh
    cd EchoMarket
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`

Runs a local server to preview the production build from the `dist` folder.

### `npm run lint`

Lints the project files for any errors.

## Deployment

This project is set up for deployment to GitHub Pages.

To deploy the application, run:

```sh
npm run deploy
```

This will create a `gh-pages` branch and push the contents of the `dist` folder to it.
The live application can be found at the `homepage` URL specified in `package.json`: [https://haithamghaith.github.io/EchoMarket/](https://haithamghaith.github.io/EchoMarket/)
