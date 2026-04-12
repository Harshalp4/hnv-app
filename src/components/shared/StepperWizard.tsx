import styles from './StepperWizard.module.css';

interface StepperWizardProps {
  steps: string[];
  current: number;
}

export function StepperWizard({ steps, current }: StepperWizardProps) {
  return (
    <div className={styles.steps}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={i} style={{ display: 'contents' }}>
            <div className={styles.step}>
              <div className={`${styles.dot} ${isDone ? styles.dotDone : isActive ? styles.dotActive : ''}`}>
                {isDone ? '\u2713' : stepNum}
              </div>
              <div className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`${styles.line} ${isDone ? styles.lineDone : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
