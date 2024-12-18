import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import  ProfileForm  from "./ProfileForm"
import { FormValues } from "@/schemas"
import { useAppDispatch } from "@/store/store"
import { loginUser } from "@/store/action/user.action"



const LoginForm = () => {
  const dispatch = useAppDispatch();

  const onSubmit = (values: FormValues) => {
    console.log(values);
    dispatch(loginUser(values));
   }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button >Login</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ProfileForm onSubmit={onSubmit}/>
      </PopoverContent>
    </Popover>
  )
}

export default LoginForm