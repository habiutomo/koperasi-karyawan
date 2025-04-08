import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@shared/schema";

interface PendingTasksProps {
  tasks: Task[];
  loading?: boolean;
  onViewTask: (taskId: number) => void;
  onProcessTask: (taskId: number) => void;
}

export function PendingTasks({ tasks, loading = false, onViewTask, onProcessTask }: PendingTasksProps) {
  const renderTaskIcon = (type: string) => {
    switch (type) {
      case "loan_approval":
        return (
          <div className="bg-amber-100 rounded-full p-1 mr-3 mt-1">
            <AlertTriangle className="text-amber-600 h-4 w-4" />
          </div>
        );
      case "member_registration":
        return (
          <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
            <Info className="text-blue-600 h-4 w-4" />
          </div>
        );
      case "overdue_payment":
        return (
          <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
            <AlertCircle className="text-red-600 h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
            <Info className="text-gray-600 h-4 w-4" />
          </div>
        );
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="h-60 flex items-center justify-center">
              <p className="text-muted-foreground">No pending tasks</p>
            </div>
          ) : (
            <>
              {tasks.map((task) => (
                <div key={task.id} className="border-b border-muted pb-4">
                  <div className="flex items-start mb-2">
                    {renderTaskIcon(task.type)}
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mr-3"
                      onClick={() => onViewTask(task.id)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onProcessTask(task.id)}
                    >
                      Process
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full">See All Tasks</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
