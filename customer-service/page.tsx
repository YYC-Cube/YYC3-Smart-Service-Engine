"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SmartCustomerService from "@/customer-service/smart-customer-service"
import ScriptManagement from "@/customer-service/script-management"
import SofaSalesSystem from "@/customer-service/sofa-sales-system"

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900">
      <Tabs defaultValue="service" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700/50">
          <TabsTrigger value="service">智能客服</TabsTrigger>
          <TabsTrigger value="management">话术管理</TabsTrigger>
          <TabsTrigger value="sofa-sales">左右沙发电销</TabsTrigger>
        </TabsList>

        <TabsContent value="service" className="mt-0">
          <SmartCustomerService />
        </TabsContent>

        <TabsContent value="management" className="mt-0">
          <ScriptManagement />
        </TabsContent>

        <TabsContent value="sofa-sales" className="mt-0">
          <SofaSalesSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}
