"use client";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Button from "../../sharedUI/Button/Button";
import Link from "../../sharedUI/Button/Link";

const ButtonPage = () => {
  return (
    <>
      <div className="p-4">
        <p className="text-xl"><b>[Button]</b></p>
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button size="sm" endIcon={['icon_btn_arrow.svg', 'w-[0.4rem]']}>
              Primary Small
            </Button>
            <Button type="submit" startIcon={['icon_checked.svg', 'w-[0.75rem]']}>Primary submit</Button>
            <Button size="lg">Primary Large</Button>
            <Button round="full">Primary</Button>
            <Button round="rec">Primary</Button>
            <Button disabled>Primary disabled</Button>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="secondary">secondary</Button>
            <Button mode="secondary" round="full">취소</Button>
            <Button mode="secondary" round="rec">secondary</Button>
            <Button mode="secondary" disabled>secondary disabled</Button>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="tertiary">tertiary</Button>
            <Button mode="tertiary" round="full">tertiary</Button>
            <Button mode="tertiary" round="rec">tertiary</Button>
            <Button mode="tertiary" disabled>tertiary disabled</Button>
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[A link]</b></p>
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link href="https://www.jinhak.com/" blank mode="primary" size="sm">Primary Small + blank</Link>
            <Link mode="primary" startIcon={['icon_checked.svg', 'w-[0.75rem]']}>primary</Link>
            <Link mode="primary" size="lg" endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>Primary Large</Link>
            <Link disabled>Primary disabled</Link>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="secondary">secondary</Link>
            <Link mode="secondary" disabled>secondary disabled</Link>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="tertiary">tertiary</Link>
            <Link size="auto" addClass="px-2 md:px-4 py-2 text-s text-white bg-red-700">ok</Link>
            <Link mode="tertiary" size="auto" addClass="">cancel</Link>
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[ButtonBox]</b></p>

        <ButtonBox align="left" addClass="border border-red-400">
          <Button mode="secondary" size="sm" >취소 Small</Button>
          <Link href="https://www.jinhak.com/" blank size="sm">모의지원 Small</Link>
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" >취소</Button>
          <Link href="https://www.jinhak.com/" blank>모의지원</Link>
        </ButtonBox>

        <ButtonBox align="right">
          <Link href="https://www.jinhak.com/" blank>리포트</Link>
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" >취소</Button>
          <Link href="https://www.jinhak.com/" blank>모의지원</Link>
          <Link href="https://www.jinhak.com/" blank endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>모의지원</Link>
        </ButtonBox>

        <ButtonBox>
          <Link size="auto" addClass="px-2 md:px-4 py-2">ok</Link>
          <Link mode="tertiary" size="auto" addClass="py-2 text-white bg-blue-1000">cancel</Link>
        </ButtonBox>
      </div>
    </>
  )
}

export default ButtonPage;