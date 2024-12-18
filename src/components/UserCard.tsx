import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FC } from "react"
  

const UserCard : FC<{user: {userName: string}}> = (props): JSX.Element => {
  const {user} = props;
  return (
    <Card>
  <CardHeader>
    <CardTitle>{user.userName}</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
</Card>

  )
}

export default UserCard