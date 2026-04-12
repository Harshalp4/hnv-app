import styles from './SmallInput.module.css';

interface SmallInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
}

export function SmallInput({ width, style, ...props }: SmallInputProps) {
  return (
    <input
      className={styles.input}
      style={{ ...style, ...(width ? { width } : {}) }}
      {...props}
    />
  );
}
