import '../styles/globals.css'
// import '../styles/index.css'
import { NextUIProvider } from '@nextui-org/react'
import { createTheme } from '@nextui-org/react'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { useSSR } from '@nextui-org/react'
const theme = createTheme({
  type: 'dark', // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      // primaryLight: '$green200',
      // primaryLightHover: '$green300',
      // primaryLightActive: '$green400',
      // primaryLightContrast: '$green600',
      // primary: '#4ADE7B',
      // primaryBorder: '$green500',
      // primaryBorderHover: '$green600',
      // primarySolidHover: '$green700',
      // primarySolidContrast: '$white',
      // primaryShadow: 'black',

      gradient: 'linear-gradient(112deg, #7EE8FA -50%, #EEC0C6 50%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#ff4ecd',

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
})

export default function App({ Component, pageProps }) {
  const { isBrowser } = useSSR()

  const uploadLink = createUploadLink({ 
    uri: "http://localhost:3000/api/graphql" });

    const client = new ApolloClient({
      link: uploadLink,
      cache: new InMemoryCache(),
});
  return (
    isBrowser && (
      <NextUIProvider theme={theme}>
      <ApolloProvider client={client}>
      <Component {...pageProps} />
      </ApolloProvider>
    </NextUIProvider>
    )
  )
}
