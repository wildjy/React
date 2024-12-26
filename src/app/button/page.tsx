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
            <Button label="Primary Small" size="sm" />
            <Button type="submit" label="Primary submit" />
            <Button label="Primary Large" size="lg" />
            <Button label="Primary" round="full" />
            <Button label="Primary" round="rec" />
            <Button label="Primary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="secondary" label="secondary" />
            <Button mode="secondary" round="full" label="secondary" />
            <Button mode="secondary" round="rec" label="secondary" />
            <Button mode="secondary" label="secondary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="tertiary" label="tertiary" />
            <Button mode="tertiary" round="full" label="tertiary" />
            <Button mode="tertiary" round="rec" label="tertiary" />
            <Button mode="tertiary" label="tertiary disabled" disabled />
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[A link]</b></p>
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link href="https://www.jinhak.com/" blank mode="primary" size="sm" label="Primary Small + blank" />
            <Link mode="primary" label="Primary" />
            <Link mode="primary" size="lg" label="Primary Large" />
            <Link label="Primary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="secondary" label="secondary" />
            <Link mode="secondary" label="secondary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="tertiary" label="tertiary" />
            <Link size="auto" addClass="px-2 md:px-4 py-2 text-s text-white bg-red-700" label="ok" />
            <Link mode="tertiary" size="auto" addClass="" label="cancel" />
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[ButtonBox]</b></p>

        <ButtonBox align="left" addClass="border border-red-400">
          <Button mode="secondary" size="sm" label="취소 Small" />
          <Link href="https://www.jinhak.com/" blank size="sm" label="모의지원 Small" />
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" label="취소" />
          <Link href="https://www.jinhak.com/" blank label="모의지원" />
        </ButtonBox>

        <ButtonBox align="right">
          <Link href="https://www.jinhak.com/" blank label="리포트" />
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" label="취소" />
          <Link href="https://www.jinhak.com/" blank label="모의지원" />
          <Link href="https://www.jinhak.com/" blank label="모의지원" />
        </ButtonBox>

        <ButtonBox>
          <Link size="auto" addClass="px-2 md:px-4 py-2" label="ok" />
          <Link mode="tertiary" size="auto" addClass="py-2 text-white bg-blue-1000" label="cancel" />
        </ButtonBox>
      </div>
    </>
  )
}

export default ButtonPage;