interface popupBottomProps {
  children?: React.ReactNode;
}

const PopupBottom: React.FC<popupBottomProps> = ({ children }) => {
  return (
    <>
      <div>
        { children }
      </div>
    </>
  )
};

export default PopupBottom;