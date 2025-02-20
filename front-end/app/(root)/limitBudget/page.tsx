"use client";
import Image from "next/image";
import PiggyBank from "@/public/images/piggy-bank.png";
import { TextInput } from "@/components/customeInput";
import { DropdownMenuDemo } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// http://localhost:3000/limitBudget
export default function LimitBudgetPage() {
  const containerClasses =
    "min-h-screen flex flex-col items-center justify-center px-4 gap-4";
  const contentWrapperClasses =
    "w-full max-w-md space-y-8 flex flex-col items-center";
  const textCenterClasses = "text-center";
  const inputGroupClasses = "flex flex-row items-center";
  const formClasses = "space-y-4 flex flex-col gap-y-4";
  const footerClasses = "flex flex-col gap-4 items-end text-center";
  const router = useRouter();

  return (
    <div className={containerClasses}>
      <div className={contentWrapperClasses}>
        <div className={textCenterClasses}>
          <h1 className="header">Limit Your Monthly Budget</h1>
          <p className="description-medium mt-2">
            Spend wisely, waste less, save more
          </p>
        </div>

        <Image src={PiggyBank} width={124} height={124} alt="Piggy Bank" />

        <form className={formClasses}>
          <div className={inputGroupClasses}>
            <TextInput type="number" placeholder="0000" />
            <DropdownMenuDemo />
          </div>

          <div className={footerClasses}>
            <p className="small-text">
              "Control your spending today to create a wealthier tomorrow. Small
              savings today grow into big opportunities for your future." 💰✨
            </p>
            <Button
              className="green-button !text-white"
              onClick={() => router.push("/")}
            >
              Set goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
