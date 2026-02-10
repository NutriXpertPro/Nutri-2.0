'use client';

import React, { useState } from 'react';
import FoodManagementContent from '@/components/foods/FoodManagementContent';
import SupplementManagementContent from '@/components/foods/SupplementManagementContent';
import { DashboardLayout } from "@/components/layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Salad } from "lucide-react";

export default function FoodsPage() {
    const [activeTab, setActiveTab] = useState("foods");

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-h1 capitalize font-normal">
                        Gestão de <span className="text-primary">Alimentos</span>
                    </h1>
                    <p className="text-subtitle max-w-2xl flex items-center gap-2">
                        <Salad className="h-4 w-4 text-amber-500" />
                        Consulte as tabelas oficiais ou gerencie sua base personalizada de alimentos e suplementos de forma profissional.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent h-14 p-0 border-none mb-6">
                        <TabsTrigger
                            value="foods"
                            className="h-full flex items-center justify-center rounded-xl border border-border/50 bg-muted/30 shadow-sm transition-all data-[state=inactive]:border-primary/40 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:border-primary font-medium"
                        >
                            Alimentos
                        </TabsTrigger>
                        <TabsTrigger
                            value="supplements"
                            className="h-full flex items-center justify-center rounded-xl border border-border/50 bg-muted/30 shadow-sm transition-all data-[state=inactive]:border-primary/40 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:border-primary font-medium"
                        >
                            Suplementos
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === "foods" && <FoodManagementContent />}
                    {activeTab === "supplements" && <SupplementManagementContent />}
                </Tabs>
            </div>
        </DashboardLayout>
    );
}