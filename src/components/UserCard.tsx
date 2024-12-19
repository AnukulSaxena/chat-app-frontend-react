import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { User } from "@/schemas";
import { createRelationship } from "@/store/action/relationship.action";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FC } from "react";
import { FaUserPlus, FaUserAstronaut } from "react-icons/fa"; // Importing "Add Friend" icon from react-icons

interface UserCardProps {
  user: User; // Callback to handle sending the request
}

const UserCard: FC<UserCardProps> = ({ user }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.auth);
  if (!userData || userData._id === user._id) return <></>;

  const onSendRequest = () => {
    dispatch(
      createRelationship({ fromUserId: userData?._id, toUserId: user._id })
    );
  };
  return (
    <Card className="max-w-xs shadow-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div>
            <FaUserAstronaut className="text-4xl" />
          </div>
          <CardTitle className="text-lg font-semibold">
            {user.userName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Additional User Info */}
        <p className="text-sm text-gray-600">Some user information...</p>
      </CardContent>
      <CardFooter>
        {/* Action Button: Send Request */}
        <button
          onClick={onSendRequest}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <FaUserPlus className="text-xl" />
          <span>Send Friend Request</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
