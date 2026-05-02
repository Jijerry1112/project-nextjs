import styles from "./card.module.css";

const Card = ({name, title, image}) => {
  return (
    <div className={styles.profileCard}>
        <div className={styles.top}>
            <img src={image} alt={name} />
        </div>
        <div className={styles.bottom}>
            <p>{name}</p>
            <p>{title}</p>
        </div>
    </div>
  );
};

export default Card;