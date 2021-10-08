import { createGlobalStyle, ThemeProvider } from 'styled-components'
import {breakpoint} from 'styled-components-breakpoint';
import theme from 'base/style';
import Web3, { utils } from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
export const wcConnector = new WalletConnectConnector({
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
});

function getLibrary(provider){
  return new Web3(provider);
}


const GlobalStyle = createGlobalStyle`
    
  body {

    font-family: ${theme.font};
    font-size: 4vw;
    letter-spacing: 0.06em;
    background-color: ${theme.colors.bg};
    color: ${theme.colors.text};

    ${breakpoint('md')`
      font-size: 2.5vw;
    `}

    ${breakpoint('lg')`
      font-size: 1.4vw;
    `}
  }

  h1, h2, h3, h4, h5 {
    margin-top: 0;
  }

  p {
    margin: 0 0 20px 0;
  }

  a {
    color: inherit;
    &:hover {
      text-decoration: none;
    }
  }

  button {
    background-color: ${theme.colors.bg};
    padding: 1vw 2vw;
    border: 2px solid ${theme.colors.text};
    color: ${theme.colors.text};
    font-family: ${theme.font};
    font-size: inherit;
    box-shadow: 3px 3px 0px ${theme.colors.text};
    &:active {
      position: relative;   
      top: 2px;
      left: 2px;
      box-shadow: 1px 1px 0px ${theme.colors.text};
    }
    & + & {
      margin-left: 2vw;
    }
  }

`


export default function App({ Component, pageProps }) {

  return (
        <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
            <Component {...pageProps} />
        </ThemeProvider>
       </Web3ReactProvider>
  )
}
