import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ProfileForm } from "../auth/ProfileForm"

export function CreateForm() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button >Create Account</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ProfileForm/>
      </PopoverContent>
    </Popover>
  )
}
