import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { adminApi } from '../../../services/api';
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { CandidateAuditDrawer } from './CandidateAuditDrawer';

export const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'active'>('candidates');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeProducts, setActiveProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  const fetchCandidates = async () => {
    try {
      const res = await adminApi.getCandidates('pending,new');
      if (res.data?.status === 'success') {
        setCandidates(res.data.candidates || []);
      } else if (Array.isArray(res.data)) {
        setCandidates(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveProducts = async () => {
    try {
      const res = await adminApi.getSyncStatus();
      if (Array.isArray(res.data)) {
        setActiveProducts(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'candidates') {
      await fetchCandidates();
    } else {
      await fetchActiveProducts();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await adminApi.approveCandidate(id);
      else await adminApi.rejectCandidate(id);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || `Failed to ${action} candidate`);
    }
  };

  const getStatusBadge = (status: string, label?: string) => {
    // Priority for 8.5.8 Category Labels
    if (label) {
      switch(label) {
        case 'MAGNET': return <Badge variant="default" className="bg-purple-600 text-white border-purple-700">MAGNET ($0元购)</Badge>;
        case 'REBATE': return <Badge variant="success" className="bg-emerald-600 text-white border-emerald-700">REBATE (返现款)</Badge>;
        case 'NORMAL': return <Badge variant="outline" className="bg-blue-600 text-white border-blue-700">NORMAL (常规款)</Badge>;
        case 'HOT': return <Badge variant="outline" className="bg-orange-600 text-white border-orange-700">HOT (趋势爆款)</Badge>;
      }
    }

    switch(status) {
      case 'synced': return <Badge variant="success">已同步 (Synced)</Badge>;
      case 'pending': return <Badge variant="warning">待审核 (Audit)</Badge>;
      case 'rejected': return <Badge variant="danger">已拒绝</Badge>;
      case 'new': return <Badge variant="default">新抓取 (New)</Badge>;
      default: return <Badge variant="default">{status || '未知'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">商品管理</h2>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> 刷新
        </Button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'candidates' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('candidates')}
        >
          选品审核 (Sourcing Candidates)
        </button>
        <button
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'active' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('active')}
        >
          已上架商品 (Active Catalog)
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-gray-500 font-bold">加载商品数据中...</div>
      ) : activeTab === 'candidates' ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-y-2 border-gray-900">
              <TableHead className="w-[300px] font-black text-gray-900 uppercase text-[10px] tracking-widest">商品预览 (Preview)</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest text-center">Alibaba 采购 (USD)</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest text-center">Official DDP</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest text-center">Amazon Truth</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest text-center">0Buck Retail</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest text-center">ROI / Net</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">锚点仓 (Warehouse)</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">状态 (Status)</TableHead>
              <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">决策操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-500">暂无待审商品。</TableCell></TableRow>
            ) : (
              candidates.map((item) => (
                <TableRow key={item.id} className={
                  (() => {
                    const landed = (parseFloat(item.cost_usd) || 0) + parseFloat(item.freight_fee || 0);
                    const target = item.sell_price || (item.amazon_price * 0.6) || 0;
                    const is_loss = item.product_category_label !== 'MAGNET' && target > 0 && target < landed;
                    const is_suicide_magnet = item.product_category_label === 'MAGNET' && (parseFloat(item.cost_usd) > 10);
                    
                    if (item.status === 'rejected' || is_loss || is_suicide_magnet) {
                      return "bg-red-50 hover:bg-red-100 transition-colors border-l-4 border-l-red-600";
                    }
                    return "hover:bg-gray-50 transition-colors";
                  })()
                }>
                    <TableCell>
                      <div className="font-bold text-gray-900 line-clamp-2 leading-tight">
                        {item.title_zh || item.title || item.title_en || (
                          <span className="text-red-500 underline">未知商品 (Missing Title)</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase text-white bg-orange-600">
                          ALIBABA INTL
                        </span>
                        <span className="font-mono bg-gray-100 px-1 rounded">#{item.source_pid || item.id}</span>
                        {item.source_url && (
                          <a href={item.source_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 font-black flex items-center">
                            溯源 <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm font-black text-gray-900">${item.cost_usd || '0.00'}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mt-1">Alibaba USD</div>
                  </TableCell>
                  <TableCell className="text-center border-x bg-gray-50/30">
                    <div className="text-sm font-black text-emerald-600">
                      {item.freight_fee ? `$${item.freight_fee}` : <span className="text-red-500 underline decoration-dotted font-bold">待填 (需同步)</span>}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mt-1">Official DDP</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-black text-gray-900">${item.amazon_price || '0.00'}</div>
                      <div className="text-[10px] text-amber-600 font-bold">+${item.amazon_shipping_cost || '0.00'} S&H</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center border-x bg-indigo-50/30">
                    <div className="text-sm font-black text-indigo-700">
                      {item.product_category_label === 'MAGNET' ? (
                        <span className="text-orange-600 font-black italic">0-BUCK</span>
                      ) : (
                        `$${item.sell_price || (item.amazon_price * 0.6).toFixed(2) || '0.00'}`
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mt-1">Target Price</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                      {item.product_category_label === 'MAGNET' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-orange-600 uppercase font-black tracking-tighter">Net Margin</span>
                          <span className={((item.amazon_shipping_cost || 0) - ((parseFloat(item.cost_usd) || 0) + parseFloat(item.freight_fee || 0))) < 0 ? "text-red-600 animate-pulse" : "text-emerald-600"}>
                            ${((item.amazon_shipping_cost || 0) - ((parseFloat(item.cost_usd) || 0) + parseFloat(item.freight_fee || 0))).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        (() => {
                          const landed = (parseFloat(item.cost_usd) || 0) + parseFloat(item.freight_fee || 0);
                          const target = item.sell_price || (item.amazon_price * 0.6) || 0;
                          const is_loss = target > 0 && target < landed;
                          const roi = landed > 0 ? (target / landed).toFixed(2) + 'x' : '数据不全';
                          
                          return (
                            <div className="flex flex-col items-center">
                              {is_loss && <span className="text-[8px] bg-red-600 text-white px-1 rounded mb-1 animate-bounce">亏损警告</span>}
                              <span className={is_loss ? "text-red-600 font-black" : "text-blue-600"}>{roi}</span>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.warehouse_anchor ? (
                      <Badge variant="outline" className="font-black border-2 border-gray-900 uppercase text-[10px] bg-white">
                        {item.warehouse_anchor}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-[10px] font-bold italic">未指定</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.product_category_label || item.category_type)}
                  </TableCell>
                  <TableCell>
                    {(item.status === 'pending' || item.status === 'new') && (
                      <div className="flex flex-col gap-1.5">
                        <Button variant="outline" className="h-8 w-full text-blue-600 border-blue-200 hover:bg-blue-50 font-black text-xs" onClick={() => setSelectedCandidate(item)}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> 审核审计 (Audit)
                        </Button>
                        <Button variant="outline" className="h-8 w-full text-red-600 border-red-200 hover:bg-red-50 font-black text-xs" onClick={() => handleAction(item.id, 'reject')}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> 拒绝 (Reject)
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品信息</TableHead>
              <TableHead>Shopify ID</TableHead>
              <TableHead>落地成本 (USD)</TableHead>
              <TableHead>原价/售价</TableHead>
              <TableHead>利润倍率</TableHead>
              <TableHead>风险评估</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeProducts.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无已上架商品。</TableCell></TableRow>
            ) : (
              activeProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.category}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">{item.shopify_id || '未同步'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">${item.buffered_cost_usd?.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">${item.price_usd?.toFixed(2)}</div>
                    <div className="text-xs text-gray-400 line-through">${item.compare_at_price?.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono font-bold text-emerald-600">{item.margin_multiplier?.toFixed(1)}x</div>
                  </TableCell>
                  <TableCell>
                    {item.is_risk ? (
                      <Badge variant="danger">高风险 (利润率 &lt; 4x)</Badge>
                    ) : (
                      <Badge variant="success">安全</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Audit Drawer Modal */}
      <CandidateAuditDrawer 
        isOpen={selectedCandidate !== null}
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onRefresh={fetchData}
      />
    </div>
  );
};