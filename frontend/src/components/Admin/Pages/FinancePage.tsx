import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { adminApi } from '../../../services/api';
import { Wallet, TrendingUp, Users, ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const FinancePage = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const [resKpis, resBalance] = await Promise.all([
        adminApi.getKpis().catch(() => ({ data: {} })),
        adminApi.getBalanceSheet().catch(() => ({ data: {} }))
      ]);
      
      if (resKpis.data) {
        setKpis(resKpis.data);
      }
      if (resBalance.data) {
        setBalanceSheet(resBalance.data);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  if (loading) return <div className="p-8 text-gray-500 font-bold">加载大盘数据中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">平台财务与核心指标 (KPI)</h2>
        <Button onClick={fetchKpis} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> 刷新
        </Button>
      </div>

      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><ShoppingCart className="w-6 h-6" /></div>
                <div>
                  <div className="text-sm font-bold text-gray-500">今日订单数</div>
                  <div className="text-2xl font-black">{kpis.orders_today || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <div className="text-sm font-bold text-gray-500">当月利润 (MTD)</div>
                  <div className="text-2xl font-black text-emerald-600">${kpis.profit_mtd || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Wallet className="w-6 h-6" /></div>
                <div>
                  <div className="text-sm font-bold text-gray-500">API 接口状态</div>
                  <div className="text-2xl font-black">{kpis.api_status || '未知'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                <div>
                  <div className="text-sm font-bold text-gray-500">熔断/异常商品数</div>
                  <div className="text-2xl font-black">{kpis.melting_count || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {balanceSheet && (
        <Card className="border-2 border-emerald-500/20">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
            <CardTitle>总账报表 (Balance Sheet & Ledger)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm font-bold text-gray-500 mb-2">总交易额 (GMV)</div>
                <div className="text-4xl font-black">${balanceSheet.total_sales?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm font-bold text-gray-500 mb-2">总销货成本 (COGS)</div>
                <div className="text-4xl font-black text-red-500">-${balanceSheet.total_cogs?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-sm font-bold text-emerald-700 mb-2">预估净利润 (Net Profit)</div>
                <div className="text-4xl font-black text-emerald-600">${balanceSheet.net_profit?.toFixed(2) || '0.00'}</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-sm font-bold text-amber-700 mb-2">签到返现准备金 (Cashback Liability Reserve)</div>
              <div className="text-2xl font-black text-amber-600">${balanceSheet.cashback_reserve?.toFixed(2) || '0.00'}</div>
              <p className="text-sm text-amber-700/80 mt-2 font-medium">
                用于支撑平台“20期签到 100% 全额返现”政策的储备资金总额。系统会冻结此部分预估负债以防范资金链断裂。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};