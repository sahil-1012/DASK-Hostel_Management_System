import { useCallback } from "react";
import styles from "./Login.module.css";
const Login = () => {
  const onFrameButtonClick = useCallback(() => {
    // Please sync "Index" to the project
  }, []);

  return (
    <div className={styles.login}>
      <div className={styles.welcomeBack}>Welcome Back</div>
      <div className={styles.frameParent}>
        <div className={styles.labelParent}>
          <span className={styles.label}>User Name</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your username"
          />
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.labelGroup}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input1}
              type="password"
              placeholder="password"
              maxLength={12}
              minLength={4}
            />
          </div>
          <button className={styles.text}>Forgot password?</button>
        </div>
        <button className={styles.button}>
          <div className={styles.text1}>Login</div>
        </button>
      </div>
      <img className={styles.dakIcon} alt="" src="/dak.svg" />
      <img className={styles.loginChild} alt="" src="/frame-50.svg" />
      <img
        className={styles.clipVirtualRealityIcon}
        alt=""
        src="/clipvirtualreality.svg"
      />
      <button className={styles.pathWrapper} onClick={onFrameButtonClick}>
        <img className={styles.pathIcon} alt="" src="/path.svg" />
      </button>
    </div>
  );
};

export default Login;
