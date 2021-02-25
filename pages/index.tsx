import Head from 'next/head'
import styles from '../styles/index.module.css'

import Home from './home';
import Earn from './earn';

import Header from './components/header';
import ChatBox from './components/chatBox';
import ErrorPage from 'next/error';

import { useState,useEffect } from "react";

function Section(props) {
  switch (props.content) {
    case '/':
      return <Home />;
    case '/earn':
      return <Earn />;
    // case '/withdraw':
    //   return <div>Withdraw</div>;
    default:
      return <ErrorPage statusCode={404}/>
  }
}

const Index = (props) => {
  const [selection, setSelection] = useState(props.path);

  const updateSelection = (path) => {
    setSelection(`/${path}`);
  };


  useEffect(() => {});

  return (
    <div className={"main-container"}>
      <Head>
        <title>GeekBux - Main</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header func={updateSelection}/>
      <main className={styles.main}>
        <Section {...props} selection={selection} content={selection}/>
        <ChatBox {...props}/>
      </main>
    </div>
  )
}

export default Index;
/*
<div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
*/