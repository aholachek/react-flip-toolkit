import { css } from '@emotion/core'

export const breakpoint = 768 + 1

export const globalStyles = css`
  :root {
    --light: #f2f4f6;
    --dark: #242223;
  }

  @import url('https://fonts.googleapis.com/css?family=DM+Sans:400,700&display=swap');
  html {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
  }
  body {
    ${'' /* only works in certain browsers */}
    overscroll-behavior: contain;
    line-height: 1.4;
    color: var(--dark);
    overflow: hidden;
    @media (min-width: ${breakpoint}px) {
      overflow: visible;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--dark);
  }

  p {
    margin-bottom: 0;
  }
`
