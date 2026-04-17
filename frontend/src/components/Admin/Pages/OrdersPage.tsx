import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { adminApi } from '../../../services/api';
import { RefreshCw, ExternalLink } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders();
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getFinancialBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'paid': return <Badge variant="success">已支付</Badge>;
      case 'refunded': return <Badge variant="danger">已退款</Badge>;
      case 'pending': return <Badge variant="warning">待支付</Badge>;
      default: return <Badge variant="default">{status || '未知'}</Badge>;
    }
  };

  const getFulfillmentBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'fulfilled': return <Badge variant="success">已发货</Badge>;
      case 'unfulfilled': return <Badge variant="warning">待处理</Badge>;
      default: return <Badge variant="default">{status || '未知'}</Badge>;
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold">加载订单中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">订单履约监控</h2>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> 刷新
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>订单号 (Shopify)</TableHead>
            <TableHead>用户 ID</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>订单总额</TableHead>
            <TableHead>财务状态</TableHead>
            <TableHead>履约状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无订单数据。</TableCell></TableRow>
          ) : (
            orders.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="font-bold text-gray-900">{item.order_id}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">User #{item.customer_id}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono font-bold">${item.total_price?.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  {getFinancialBadge(item.financial_status)}
                </TableCell>
                <TableCell>
                  {getFulfillmentBadge(item.fulfillment_status)}
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="h-8 px-2 text-xs">
                    查看详情
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
