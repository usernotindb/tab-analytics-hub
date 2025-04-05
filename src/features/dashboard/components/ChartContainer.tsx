
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainerProps } from "../types";

export const ChartContainer: React.FC<React.PropsWithChildren<ChartContainerProps>> = ({ 
  title, 
  isLoading, 
  height = "h-80", 
  children 
}) => {
  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={`p-2 ${height} flex items-center justify-center`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
