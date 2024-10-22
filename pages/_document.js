import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps
    return (
      <Html>
        <link
          href="https://fonts.googleapis.com/css2?family=Agdasima:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
          rel="stylesheet"
        />
        <Head />
        <body className={pageProps.isDark ? 'bg-gray-950' : 'bg-emerald-50'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
