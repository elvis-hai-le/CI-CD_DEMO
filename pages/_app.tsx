import type { AppProps } from 'next/app'

// Import SCSS
import 'styles/main.scss'
// Import initial FontAwesome Styles: https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-476276516
import '@fortawesome/fontawesome-svg-core/styles.css'

// Import FontAwesome Icons
const { config, library } = require('@fortawesome/fontawesome-svg-core')

import {
  faStar,
  faArrowUp,
  faArrowRight,
  faArrowDown,
  faArrowLeft,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(
  faStar,
  faArrowUp,
  faArrowRight,
  faArrowDown,
  faArrowLeft,
  faTrophy,
  faGithub
)
config.autoAddCss = false

// export default function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

import React, { useEffect } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.className = pageProps.isDark ? 'bg-gray-950' : 'bg-emerald-50'
  })
  return <Component {...pageProps} />
}
