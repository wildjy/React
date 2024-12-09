"use client";
import CcpPatternPage from './ccp';

const CCPPage = () => {
  return (
    <>
      <div>
        <CcpPatternPage>
          <CcpPatternPage.partA>
            <CcpPatternPage.item>1234</CcpPatternPage.item>
            <CcpPatternPage.item>sadadasdww</CcpPatternPage.item>
          </CcpPatternPage.partA>

          <CcpPatternPage.partB title={'CCP partB....'} sub_txt={'sub_txt'}>
            <CcpPatternPage.item>1234</CcpPatternPage.item>
          </CcpPatternPage.partB>
          <CcpPatternPage.partC title={'partC....'} />
        </CcpPatternPage>
      </div>
    </>
  )
}

export default CCPPage;