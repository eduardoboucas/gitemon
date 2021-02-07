![Gitémon logo](https://raw.githubusercontent.com/eduardoboucas/gitemon/master/public/logo192.png)

# Gitémon

> Gotta Catch 'Em All!

[![Deploy with Netlify button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/eduardoboucas/gitemon)

This is an experiment using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) and [Netlify Functions](https://www.netlify.com/products/functions/).

It's a fun little game that gives points to the player for every member of a GitHub organization they can name.

## Development

To run the application locally:

1. Clone this repository

2. Install the dependencies

    ```sh
    yarn
    ```

3. Start the application in development mode

    ```sh
    yarn start
    ```
    
## Connecting to GitHub

The application gets its data from the GitHub API. It can do so via unauthenticated requests, but that way you'll hit the rate limits of the API pretty quickly. Alternatively, players can sign in using their GitHub accounts, which offers a much more generous allowance of requests.

This is done using a GitHub app, configuring using the `GITHUB_APP_CLIENT_ID`, `REACT_APP_GITHUB_APP_CLIENT_ID`,  and`GITHUB_APP_CLIENT_SECRET` environment variables (`REACT_APP_GITHUB_APP_CLIENT_ID` is the same as `GITHUB_APP_CLIENT_ID`, but it's accessible in the React application).

To run the application locally, you can place these variables in a `.env` file — but make sure not to commit your secrets to a public repository! Alternatively, you can configure the variables on Netlify and run the application using [Netlify Dev](https://www.netlify.com/products/dev/), which will inject the variables for you automatically.
