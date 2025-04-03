import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { FriendsDetails } from "@/schemas/relation/relation.schema";
import { createGroupChat } from "@/store/action/chat.action";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ open, onOpenChange }) =>  {
  const dispatch = useAppDispatch();
  const { friends } = useAppSelector(state => state.relation);
  const [selectedFriends, setSelectedFriends] = useState<FriendsDetails[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    return () => {
      // Cleanup function to ensure dialog is properly closed
      if (onOpenChange) {
        onOpenChange(false);
      }
    };
  }, [onOpenChange]);

  const handleFriendToggle = (friend: FriendsDetails) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.userId === friend.userId);
      if (isSelected) {
        return prev.filter(f => f.userId !== friend.userId);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleCreateGroup = () => {
    const groupData = {
      groupName,
      users: selectedFriends.map(friend => friend.userId)
    };
    console.log('Creating group with data:', groupData);
    // Here you would typically make an API call to create the group
    dispatch(createGroupChat(groupData));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create a new group chat with your friends.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-2">
              <h4 className="text-sm font-medium">Select Friends</h4>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {friends.map((friend) => (
                  <div key={friend.userId} className="flex items-center space-x-2">
                    <Checkbox
                      id={friend.userId}
                      checked={selectedFriends.some(f => f.userId === friend.userId)}
                      onCheckedChange={() => handleFriendToggle(friend)}
                    />
                    <label
                      htmlFor={friend.userId}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {friend.userName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleCreateGroup}
            disabled={!groupName || selectedFriends.length === 0}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default CreateGroupDialog
