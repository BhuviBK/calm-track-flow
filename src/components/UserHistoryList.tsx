
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserHistoryList: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Your Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4 text-gray-500">
          Activity tracking feature removed
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHistoryList;
