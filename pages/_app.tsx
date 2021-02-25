import '../styles/globals.css';

import App from "next/app";
import type { AppContext } from 'next/app';

import dynamic from 'next/dynamic';

import ErrorPage from 'next/error';
import { Component } from 'react';

import Index from './index';

// import {newMessage} from './components/chatBox';

function Desktop({props}) {
  if(props.path.match(/mobile/i)) return <ErrorPage statusCode={187} title={"No mobile version for Desktop"} />
  return <Index {...props}/>
}

function Mobile({props}) {
  if(props.component.name == 'Error') return <ErrorPage statusCode={187} title={"No mobile version available"} />
  const DynamicComponent = dynamic(import(`./mobile/${props.component.name}`), { ssr: false });
  return <DynamicComponent />;
}

function Type(props: {isMobile: any, component:Component, pageProps:any, path: String}) {
  if (props.isMobile) {
    return <Mobile props={props} />;
  }
  return <Desktop props={props} />;
}

function MyApp({ Component, pageProps, isMobile, path, query}) {

  return(
    <Type isMobile={isMobile} component={Component} pageProps={pageProps} path={path} />
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, isMobile: isMobile.any(appContext.ctx.req), path: appContext.ctx.asPath};
}

export default MyApp;

{/*





*/}

const parseIp = (req:any) =>
(typeof req.headers['x-forwarded-for'] === 'string'
    && req.headers['x-forwarded-for'].split(',').shift())
|| req.connection?.remoteAddress
|| req.socket?.remoteAddress
|| req.connection?.socket?.remoteAddress;

var isMobile = {
Android: function (req:any) {
return req?.headers['user-agent']?.match(/Android/i);
},
BlackBerry: function (req:any) {
return req?.headers['user-agent']?.match(/BlackBerry/i);
},
iOS: function (req:any) {
return req?.headers['user-agent']?.match(/iPhone|iPad|iPod/i);
},
Opera: function (req:any) {
return req?.headers['user-agent']?.match(/Opera Mini/i);
},
Windows: function (req:any) {
return req?.headers['user-agent']?.match(/IEMobile/i) || req?.headers['user-agent']?.match(/WPDesktop/i);
},
any: function (req:any) {
return (isMobile.Android(req) || isMobile.BlackBerry(req) || isMobile.iOS(req) || isMobile.Opera(req) || isMobile.Windows(req));
}
}; 
