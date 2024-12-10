interface popupContentsProps {
  children?: React.ReactNode;
}

const PopupContents: React.FC<popupContentsProps> = ({ children }) => {
  return (
    <>
      <div>
        { children }
      </div>
    </>
  )
};

export default PopupContents;