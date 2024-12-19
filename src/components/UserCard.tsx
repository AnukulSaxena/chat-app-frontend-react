import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { User } from "@/schemas";
import {
  createRelationship,
  updateRelationShip,
} from "@/store/action/relationship.action";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FC } from "react";
import { FaUserPlus, FaUserAstronaut, FaUserCheck } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { Button } from "./ui/button";
import {
  UpdateRelationStatus,
  UserRelationStatus,
} from "@/schemas/relation/relation.schema";

interface UserCardProps {
  user: User; // Callback to handle sending the request
}

const UserCard: FC<UserCardProps> = ({ user }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.auth);
  if (!userData || userData._id === user._id ) return <></>;

  const onSendRequest = () => {
    dispatch(
      createRelationship({ fromUserId: userData?._id, toUserId: user._id })
    );
  };

  const handleClick = (status: UpdateRelationStatus) => {
    dispatch(updateRelationShip({ relationId: user.relationId ? user.relationId : "", status }));
  };
  return (
    <Card className="min-w-72 shadow-md">
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
        <div className="flex gap-2 w-full justify-between">
          {user.relationshipStatus === UserRelationStatus.None && (
            <Button
              onClick={onSendRequest}
              className="flex items-center bg-neutral-200 hover:bg-neutral-300 space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaUserPlus className="text-xl" />
              <span>Send Friend Request</span>
            </Button>
          )}

          {user.relationshipStatus === UserRelationStatus.SentRequest && (
            <>
              <div className="flex px-3 rounded-lg items-center space-x-2 text-blue-600">
                <FaUserPlus className="text-xl" />
                <span>Request Sent</span>
              </div>
              <Button className="flex items-center bg-neutral-200 hover:bg-red-300 space-x-2 text-blue-600 hover:text-neutral-800">
                <span>Undo</span>
              </Button>
            </>
          )}

          {user.relationshipStatus === UserRelationStatus.Friend && (
            <>
              <div className="flex px-3 rounded-lg items-center space-x-2 text-blue-600">
                <FaUserPlus className="text-xl" />
                <span>Friend</span>
              </div>
              <Button className="flex items-center bg-neutral-200 hover:bg-red-300 space-x-2 text-blue-600 hover:text-neutral-800">
                <span>Unfriend</span>
              </Button>
            </>
          )}

          {user.relationshipStatus === UserRelationStatus.ReceivedRequest && (
            <>
              <Button
                onClick={() => handleClick(UpdateRelationStatus.Confirmed)}
                className="flex items-center bg-neutral-200 hover:bg-green-300 space-x-2 text-blue-600 hover:text-neutral-800"
              >
                <FaUserCheck className="text-xl" />
                <span>Accept</span>
              </Button>
              <Button className="flex items-center bg-neutral-200 hover:bg-red-300 space-x-2 text-blue-600 hover:text-neutral-800">
                <FaUserXmark className="text-xl" />

                <span>Reject</span>
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
