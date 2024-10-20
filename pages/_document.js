import Document, { Html, Head, Main, NextScript } from 'next/document'
// export default function Document() {
//   return (
//     <Html>
//       <Head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Agdasima:wght@700&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
//           rel="stylesheet"
//         />
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

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
        <body className={pageProps.isDark ? 'bg-zinc-950' : 'bg-slate-200'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
