import "./MenuButton.css";

export const MenuButton = ({ className = "", size, style, ...props }) => {
  return (
    <button
      className={`menu-button ${className}`}
      style={size ? { fontSize: size, ...style } : style}
      {...props}
    />
  );
};
