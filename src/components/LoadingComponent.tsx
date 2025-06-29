import styles from "./loadingComponent.module.css";

export default function LoadingComponent() {
  return (
    <div className={styles.loadingComponent}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading...</p>
    </div>
  );
}
