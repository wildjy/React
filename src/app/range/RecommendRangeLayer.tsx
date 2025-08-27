import React, { useState, useEffect } from 'react';

import { Title } from "../../sharedUI/Title/Title";
import { InfoText } from "../../sharedUI/Info/InfoText";
import { Button } from '../../sharedUI/Button/Button';
import { ButtonBox } from '../../sharedUI/Button/ButtonBox';
import { DualRangeSlider } from "../../sharedUI/Range/DualRangeSlider";
import  LayerPopup  from "../../sharedUI/LayerPopup/LayerPopup";

interface UnivSaveLayerProps {
  active: boolean;
  value: {min: number, max: number},
  onReset?: () => void;
  onChangeRange?: (newRange: {min: number, max: number}) => void;
  onClosed?: () => void;
}

export default function RecommendRangeLayer ({
  active,
  value,
  onReset,
  onChangeRange,
  onClosed,
}: UnivSaveLayerProps) {

  const [range, setRange] = useState(value);

  useEffect(() => {
    setRange(value);
  }, [value]);

  return (
    <LayerPopup align="center" close={true} isOpen={active} OpenEvent={onClosed}>
      <LayerPopup.Header>
        <Title title="추천 범위 설정" align='center' />
      </LayerPopup.Header>

      <LayerPopup.Body addClass="mt-5 sm:mt-8 overflow-y-hidden">
        <div className='w-full md:w-[33.125rem]'>
          <div className=''>
            <DualRangeSlider
              type='recom'
              min={0}
              max={9}
              step={0.5}
              tick
              input={{ show: true, readonly: true}}
              value={range}
              onChange={(min, max) => setRange({ min, max })}
            />
          </div>

          <div className='mt-5 sm:mt-7 md:mt-8'>
            <InfoText
              texts={[
                {
                  text: '진학사에서는 합격안정성 3.5~7.5칸 까지를 추천하고 있지만, 직접 범위를 바꾸어 확인하실 수 있습니다.'
                },
                {
                  text: '원하는 최소칸과 최대칸을 선택하여 색을 채우거나, 화살표를 이동시켜 범위를 설정하세요.'
                },
                {
                  text: '합격안정성은 최소 1칸부터 최대 8.5칸까지 0.5칸 단위로 선택할 수 있습니다. (합격안정성 1칸 미만과 9칸은 선택 불가)'
                }
              ]}
            />
          </div>
        </div>
      </LayerPopup.Body>

      <LayerPopup.Footer>
        <ButtonBox>
          <Button mode="secondary" onClick={onReset}>
            초기화
          </Button>
          <Button onClick={() => onChangeRange?.(range)}>
            설정 완료
          </Button>
        </ButtonBox>
      </LayerPopup.Footer>
    </LayerPopup>
  )
}