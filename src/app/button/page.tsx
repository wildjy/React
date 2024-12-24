"use client";
import Button from "../../sharedUI/Button/ButtonUi";
import Link from "../../sharedUI/Button/Link";

const ButtonPage = () => {
  return (
    <>
      <div className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button name="Primary" size="sm" />
            <Button type="submit" name="Primary submit" />
            <Button name="Primary" size="lg" />
            <Button name="Primary" round="full" />
            <Button name="Primary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="secondary" name="secondary" />
            <Button mode="secondary" name="secondary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="tertiary" name="tertiary" />
            <Button mode="tertiary" name="tertiary disabled" disabled />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link href="https://www.jinhak.com/" blank mode="primary" size="sm" name="a Primary + blank" />
            <Link mode="primary" name="a Primary" />
            <Link mode="primary" size="lg" name="a Primary" />
            <Link name="Primary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="secondary" name="a secondary" />
            <Link mode="secondary" name="secondary disabled" disabled />
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="tertiary" name="a tertiary" />
            <Link mode="tertiary" name="tertiary disabled" disabled />
          </div>
        </div>
      </div>
    </>
  )
}

export default ButtonPage;