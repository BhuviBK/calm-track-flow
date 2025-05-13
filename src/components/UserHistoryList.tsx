
import React from "react";
import { format } from "date-fns";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserHistoryList: React.FC = () => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Your Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {currentUser.history.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No activity recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            {currentUser.history.slice().reverse().map((item, index) => (
              <div key={index} className="p-3 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.page}</p>
                    <p className="text-sm text-gray-500">{item.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserHistoryList;
