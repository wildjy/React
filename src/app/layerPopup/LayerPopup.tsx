
import PopupTitle from './title';
import PopupContents from '../highschool/test';
import PopupBottom from './bottom';

interface LayerPopupProps {
  children: React.ReactNode;
  openEvent: boolean;
  closeEvent: () => void;
}
interface LayerPopupType extends React.FC<LayerPopupProps> {
  Title: typeof PopupTitle;
  Contents_1: typeof PopupContents;
  Bottom: typeof PopupBottom;
}

const LayerPopup: LayerPopupType = ({ children, openEvent, closeEvent }) => {
  return (
    <>
      { openEvent && (
        <div className={`layerPopup fixed top-0 left-0 bottom-0 right-0 bg-gray-1000 bg-opacity-65 z-10`}>
          <div className="inner absolute p-5 w-4/5 md:w-2/5 xl:w-[400px] center_center bg-white border border-gray-700">
            { children }
            {/* <ComponentA />
            <ComponentB />
            <ComponentC /> */}

            <button onClick={closeEvent}>닫기</button>
          </div>
        </div>
      )}
    </>
  )
};

LayerPopup.Title = PopupTitle;
LayerPopup.Contents_1 = PopupContents;
LayerPopup.Bottom = PopupBottom;

export default LayerPopup;