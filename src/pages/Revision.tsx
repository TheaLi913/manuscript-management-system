import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Revision = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const editorTabs = [
    { value: "waiting-review", label: t("revision.waitingForReview") },
    { value: "pending-reviewer", label: t("revision.pendingReviewer") },
    { value: "assigned-reviewer", label: t("revision.assignedReviewer") },
    { value: "waiting-decision", label: t("revision.waitingForDecision") },
  ];

  const reviewerTabs = [
    { value: "review-invitation", label: t("revision.reviewInvitation") },
    { value: "pending-reviewer", label: t("revision.pendingReviewer") },
    { value: "completed-reviewer", label: t("revision.completedReviewer") },
    { value: "rejected", label: t("revision.rejected") },
  ];

  const tabs = user?.role === "Editor" ? editorTabs : reviewerTabs;
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("revision.title")}</h1>
          <p className="text-muted-foreground">{t("revision.description")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{tab.label}</CardTitle>
                  <CardDescription>
                    {t("revision.tabDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("revision.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      {t("revision.filter")}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    {t("revision.noData")}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Revision;
