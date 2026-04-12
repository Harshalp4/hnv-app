import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

// Re-export style classes for inputs
export const inputClass = styles.input;
export const selectClass = styles.select;
export const textareaClass = styles.textarea;
