import React from "react";

interface Step {
  label: string;
  isCompleted: boolean;
}

interface StepBarProps {
  steps: Step[];
  currentStep: number;
  activeCircle: string;
  inactiveCircle: string;
  onStepClick?: (stepIndex: number) => void;
}

const StepBars: React.FC<StepBarProps> = ({ steps, activeCircle, inactiveCircle, currentStep, onStepClick }) => {
  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <div key={index} style={styles.stepContainer}>
          {/* Step Circle */}
          <div
          className={(index <= currentStep ? `activeCircle` : `inactiveCircle`)}
            style={{
              ...styles.circle,
              ...(index <= currentStep ? styles.activeCircle : styles.inactiveCircle),
            }}
            onClick={() => onStepClick && onStepClick(index)}
          >
            {index + 1}
          </div>

          {/* Step Label */}
          <span 
          className={(index <= currentStep ? `activeCircle` : `inactiveCircle`)}
          style={styles.label}>{step.label}</span>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
            className={(index <= currentStep ? `activeCircle` : `inactiveCircle`)}
              style={{
                ...styles.line,
                ...(index < currentStep ? styles.activeLine : styles.inactiveLine),
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: "20px 0",
  } as React.CSSProperties,
  stepContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  } as React.CSSProperties,
  circle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    border: "2px solid gray",
  } as React.CSSProperties,
  activeCircle: {
    backgroundColor: "#4caf50",
    color: "white",
    borderColor: "#4caf50",
  } as React.CSSProperties,
  inactiveCircle: {
    backgroundColor: "white",
    color: "gray",
  } as React.CSSProperties,
  label: {
    marginTop: "10px",
    fontSize: "12px",
    textAlign: "center",
    position: "absolute",
    top: "50px",
    left: "-10px",
    width: "60px",
  } as React.CSSProperties,
  line: {
    height: "4px",
    width: "50px",
    backgroundColor: "gray",
    marginLeft: "20px",
    marginRight: "20px",
  } as React.CSSProperties,
  activeLine: {
    backgroundColor: "#4caf50",
  } as React.CSSProperties,
  inactiveLine: {
    backgroundColor: "gray",
  } as React.CSSProperties,
};

export default StepBars;