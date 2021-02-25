import styles from '../styles/index.module.css'

export default function earn(props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">GeekBux!</a></h1>
        <p className={styles.description}>
          Get started earning{' '}
          <code className={styles.code}>Crypto/CSGO Skins/PayPal</code>
        </p>
        <h1>EARN</h1>
      </main>
    </div>
  )
}