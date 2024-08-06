import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";

export default function page() {
  return (
    <>
      <main className={styles.main_landing}>
        <div className={styles.potrait_container}>
          <img className={styles.potrait} src="/potrait.webp" alt="cheems" />
        </div>
        {/* <h1 className={styles.title}></h1> */}
        <p className={styles.subtitle}>Que puede o no comer tu mascota, potenciado por IA.</p>
        <div className={styles.buttons_container}>
          <Link className={styles.button_link} href="/app">
            Empezar
          </Link>
        </div>
        <Image className={styles.image_app} src={"/banner.webp"} alt="App capture" width={960} height={720} priority />
      </main>
    </>
  );
}
