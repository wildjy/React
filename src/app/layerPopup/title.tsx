interface popupTitleProps {
  children?: React.ReactNode;
}

const PopupTitle: React.FC<popupTitleProps> = ({ children }) => {
  return (
    <>
      { children }
    </>
  )
};

export default PopupTitle;