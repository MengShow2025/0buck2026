import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { adminApi } from '../../../services/api';
import { Save, RefreshCw, Plus } from 'lucide-react';

export const AIPersonaPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tplRes = await adminApi.getPersonaTemplates();
      setTemplates(tplRes.data || []);
    } catch (e) {
      console.error(e);
      alert('Failed to load persona templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (tpl: any) => {
    setSaving(tpl.id);
    try {
      await adminApi.updatePersonaTemplate(tpl.id, {
        name: tpl.name || 'New Template',
        style_prompt: tpl.style_prompt || '',
        empathy_weight: parseFloat(tpl.empathy_weight) || 0.5,
        formality_score: parseFloat(tpl.formality_score) || 0.5,
        vibrancy_level: parseFloat(tpl.vibrancy_level) || 0.5,
        emoji_density: parseFloat(tpl.emoji_density) || 0.5,
        is_active: tpl.is_active !== false
      });
      alert('Persona template saved successfully!');
      await fetchData();
    } catch (e) {
      alert('Error saving template');
    } finally {
      setSaving(null);
    }
  };

  const updateTemplate = (id: string, field: string, value: any) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addNewTemplate = () => {
    const newId = `template_${Date.now()}`;
    setTemplates([{
      id: newId,
      name: 'New Persona',
      style_prompt: 'You are a helpful AI assistant...',
      empathy_weight: 0.5,
      formality_score: 0.5,
      vibrancy_level: 0.5,
      emoji_density: 0.5,
      is_active: true
    }, ...templates]);
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold">加载 AI 管家配置中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">AI 管家人格 (L2 策略层)</h2>
        <div className="flex gap-2">
          <Button onClick={addNewTemplate} variant="default" className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" /> 新增模板
          </Button>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> 刷新
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {templates.map(tpl => (
          <Card key={tpl.id} className={`border-2 ${tpl.is_active ? 'border-amber-500/20' : 'border-gray-200 opacity-70'}`}>
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b pb-4">
              <div>
                <CardTitle className="text-lg">ID: <span className="text-amber-600">{tpl.id}</span></CardTitle>
                <div className="text-xs text-gray-500 mt-1">L2 皮肤与语气模板</div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tpl.is_active !== false}
                    onChange={(e) => updateTemplate(tpl.id, 'is_active', e.target.checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-bold text-gray-700">启用</span>
                </label>
                <Button 
                  onClick={() => handleSave(tpl)} 
                  disabled={saving === tpl.id}
                  className="bg-black hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" /> 
                  {saving === tpl.id ? '保存中...' : '保存'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">展示名称</label>
                <Input 
                  value={tpl.name || ''} 
                  onChange={(e: any) => updateTemplate(tpl.id, 'name', e.target.value)} 
                  placeholder="例如：专业管家"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">人设与系统提示词 (System Prompt)</label>
                <Textarea 
                  value={tpl.style_prompt || ''} 
                  onChange={(e: any) => updateTemplate(tpl.id, 'style_prompt', e.target.value)}
                  className="min-h-[120px] font-mono text-xs"
                  placeholder="定义角色的边界、说话方式及特定规则..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">同理心权重 (Empathy)</label>
                    <span className="text-xs text-amber-600 font-mono">{tpl.empathy_weight || 0.5}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={tpl.empathy_weight || 0.5} 
                    onChange={(e) => updateTemplate(tpl.id, 'empathy_weight', e.target.value)}
                    className="w-full accent-amber-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">正式度 (Formality)</label>
                    <span className="text-xs text-amber-600 font-mono">{tpl.formality_score || 0.5}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={tpl.formality_score || 0.5} 
                    onChange={(e) => updateTemplate(tpl.id, 'formality_score', e.target.value)}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">活跃度 (Vibrancy)</label>
                    <span className="text-xs text-amber-600 font-mono">{tpl.vibrancy_level || 0.5}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={tpl.vibrancy_level || 0.5} 
                    onChange={(e) => updateTemplate(tpl.id, 'vibrancy_level', e.target.value)}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">表情符号密度 (Emoji Density)</label>
                    <span className="text-xs text-amber-600 font-mono">{tpl.emoji_density || 0.5}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={tpl.emoji_density || 0.5} 
                    onChange={(e) => updateTemplate(tpl.id, 'emoji_density', e.target.value)}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 font-bold mb-4">数据库中暂无任何人设模板。</p>
            <Button onClick={addNewTemplate} variant="outline">创建首个模板</Button>
          </div>
        )}
      </div>
    </div>
  );
};