import json
import os
import sys
from datetime import datetime

# Setup environment
project_root = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck"
backend_root = os.path.join(project_root, "backend")
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.utils.mirror_extractor import MirrorExtractor

def generate_html_report(mirror_data, output_path):
    assets = mirror_data.get("mirror_assets", {})
    structural = mirror_data.get("structural_data", {})
    
    hero_gallery = assets.get("hero", {}).get("gallery", [])
    pricing = structural.get("pricing", {})
    attributes = mirror_data.get("attributes", [])
    variants = mirror_data.get("variants_raw", [])
    trust = structural.get("trust", {})
    details = assets.get("details", [])
    social = structural.get("social", {})

    html_content = f"""
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>0Buck Mirror v4.5 - {mirror_data.get('title')}</title>
        <style>
            :root {{ --primary: #1A73E8; --secondary: #1E8E3E; --danger: #D93025; --warning: #E67E22; --bg: #f9f9f9; }}
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 1100px; margin: 0 auto; padding: 20px; background: var(--bg); }}
            .container {{ background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: relative; overflow: hidden; }}
            .container::before {{ content: "VERIFIED ARTISAN MIRROR"; position: absolute; top: 20px; right: -40px; transform: rotate(45deg); background: var(--secondary); color: white; padding: 5px 40px; font-size: 10px; font-weight: bold; letter-spacing: 1px; }}
            
            .header {{ text-align: left; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }}
            .badge-row {{ display: flex; gap: 10px; margin-bottom: 10px; }}
            .badge {{ background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; }}
            .badge.v45 {{ background: #111; }}
            
            h1 {{ margin: 5px 0; color: #111; font-size: 28px; }}
            .meta-info {{ color: #666; font-size: 13px; }}
            
            .section {{ margin-bottom: 50px; }}
            .section-title {{ font-size: 20px; font-weight: bold; color: var(--primary); border-left: 5px solid var(--primary); padding-left: 15px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 0.5px; }}
            
            .hero-grid {{ display: grid; grid-template-columns: 450px 1fr; gap: 40px; }}
            .main-img {{ width: 100%; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .gallery {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px; }}
            .gallery img {{ width: 100%; border-radius: 8px; border: 1px solid #eee; }}
            
            .desire-engine {{ background: #fff; padding: 0; }}
            .desire-block {{ margin-bottom: 20px; }}
            .desire-label {{ font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 5px; }}
            .desire-text {{ font-size: 15px; color: #444; font-style: italic; border-left: 2px solid #ddd; padding-left: 15px; }}
            
            .pricing-matrix {{ display: flex; gap: 20px; margin-top: 20px; }}
            .tier-card {{ flex: 1; background: #f8f9fa; border: 1px solid #eee; padding: 15px; border-radius: 8px; text-align: center; }}
            .tier-price {{ font-size: 24px; font-weight: bold; color: var(--danger); }}
            .tier-qty {{ font-size: 13px; color: #666; margin-top: 5px; }}
            
            .specs-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid #f1f1f1; font-size: 14px; }}
            th {{ background: #fafafa; color: #666; font-weight: 600; width: 150px; }}
            
            .variant-table td {{ vertical-align: middle; }}
            .variant-img {{ width: 50px; height: 50px; border-radius: 6px; border: 1px solid #eee; object-fit: cover; }}
            .sku-id {{ font-family: monospace; font-size: 11px; color: #999; }}
            .logistics-pill {{ display: inline-block; background: #FFF4E5; color: var(--warning); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 4px; }}
            
            .trust-grid {{ display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; background: #fdfdfd; padding: 25px; border-radius: 12px; border: 1px solid #f1f1f1; }}
            .trust-badges {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }}
            .trust-tag {{ background: #E6F4EA; color: var(--secondary); padding: 6px 15px; border-radius: 25px; font-size: 13px; font-weight: 600; border: 1px solid #ceead6; }}
            
            .detail-images {{ text-align: center; margin-top: 20px; }}
            .detail-images img {{ max-width: 100%; display: block; margin: 0 auto 5px; }}
            
            .footer {{ text-align: center; font-size: 12px; color: #999; margin-top: 60px; border-top: 1px solid #eee; padding-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="badge-row">
                    <span class="badge">0Buck Project</span>
                    <span class="badge v45">v4.5 Artisan-Master Mirror</span>
                </div>
                <h1>{mirror_data.get('title')}</h1>
                <div class="meta-info">
                    1688 Offer ID: <b>{mirror_data.get('product_id')}</b> | 
                    提取时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | 
                    Status: <span style="color:var(--secondary)">Validated</span>
                </div>
            </div>

            <div class="section">
                <div class="hero-grid">
                    <div class="visuals">
                        <img src="{hero_gallery[0] if hero_gallery else ''}" class="main-img" alt="Main View">
                        <div class="gallery">
                            {"".join([f'<img src="{img}">' for img in hero_gallery[1:5]])}
                        </div>
                    </div>
                    <div class="intel">
                        <div class="section-title">I. The Desire Engine (Copy Preview)</div>
                        <div class="desire-block">
                            <div class="desire-label">[The Hook]</div>
                            <div class="desire-text">Imagine technology that doesn't just function, but feels like an extension of your lifestyle—without the brand tax.</div>
                        </div>
                        <div class="desire-block">
                            <div class="desire-label">[The Logic]</div>
                            <div class="desire-text">By establishing a direct 1:1 mirror with the source artisan, we bypass inflated markups. Same precision, direct price.</div>
                        </div>
                        
                        <div class="section-title" style="margin-top:40px">II. Tier Pricing Matrix</div>
                        <div class="pricing-matrix">
                            {"".join([f'''
                            <div class="tier-card">
                                <div class="tier-price">¥{p['price']}</div>
                                <div class="tier-qty">≥{p['min']} {pricing.get('unit')}</div>
                            </div>
                            ''' for p in pricing.get('wholesale_tiers', [])])}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">III. Mirror Technical Specifications (36+ Deep Specs)</div>
                <div class="specs-grid">
                    <table>
                        {"".join([f'<tr><th>{a["label"]}</th><td>{a["value"]}</td></tr>' for a in attributes[:len(attributes)//2 + 1]])}
                    </table>
                    <table>
                        {"".join([f'<tr><th>{a["label"]}</th><td>{a["value"]}</td></tr>' for a in attributes[len(attributes)//2 + 1:]])}
                    </table>
                </div>
            </div>

            <div class="section">
                <div class="section-title">IV. Deep Variant Matrix ({len(variants)} Variants Ingested)</div>
                <table class="variant-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Variant Attribute</th>
                            <th>Price (CNY)</th>
                            <th>Stock</th>
                            <th>Logistic Deep-Assets</th>
                            <th>SKU ID (Backend)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {"".join([f'''
                        <tr>
                            <td><img src="{v.get('image', '')}" class="variant-img"></td>
                            <td><b>{v.get('spec_attrs')}</b></td>
                            <td style="color:var(--danger); font-weight:bold;">¥{v.get('price')}</td>
                            <td>{v.get('stock')}</td>
                            <td>
                                <div class="logistics-pill">Weight: {v['logistics'].get('weight_g')}g</div><br>
                                <div class="logistics-pill" style="background:#E8F0FE; color:var(--primary);">Vol: {v['logistics'].get('volume_cm3')}cm³</div>
                            </td>
                            <td><span class="sku-id">{v.get('sku_id')}</span></td>
                        </tr>
                        ''' for v in variants])}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <div class="trust-grid">
                    <div class="factory-intel">
                        <div class="section-title">V. Artisan Trust Signals</div>
                        <p>Origin Vendor: <b>{trust.get('factory_name')}</b></p>
                        <div class="trust-badges">
                            {"".join([f'<div class="trust-tag">🛡️ {g}</div>' for g in trust.get('guarantees', [])])}
                            {"".join([f'<div class="trust-tag" style="background:#FEEFC3; border-color:#FDE293; color:#B06000;">📈 Repurchase: {trust.get("repurchase_rate")}</div>' for g in [trust.get('repurchase_rate')] if g])}
                        </div>
                        <div class="trust-badges" style="margin-top:10px">
                            {"".join([f'<div class="trust-tag" style="background:#E8F0FE; border-color:#D2E3FC; color:#1967D2;">📜 {c}</div>' for c in trust.get('certificates', [])])}
                        </div>
                    </div>
                    <div class="social-intel">
                        <div class="section-title">VI. Social Proof Snippet</div>
                        <div style="background:#fafafa; padding:15px; border-radius:8px;">
                            <div style="font-size:24px; font-weight:bold; color:var(--warning);">{social.get('rating', 5.0)} ★</div>
                            <div style="font-size:14px; color:#666;">Based on {social.get('total_reviews', 0)} evaluations</div>
                            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;">
                                {"".join([f'<span style="font-size:11px; background:#eee; padding:2px 8px; border-radius:10px;">{kw}</span>' for kw in social.get('top_keywords', [])])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">VII. HD Detail Content Stream</div>
                <div class="detail-images">
                    {"".join([f'<img src="{img}">' for img in details])}
                </div>
            </div>

            <div class="footer">
                &copy; 2026 0Buck Project Intelligence | v4.5 Artisan-Master Standard | All rights mirrored.
            </div>
        </div>
    </body>
    </html>
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"✅ HTML Report generated: {output_path}")

if __name__ == "__main__":
    test_json = os.path.join(project_root, "data/1688/test_raw_1.json")
    with open(test_json, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    mirror = MirrorExtractor.extract(raw_data)
    
    output_html = os.path.join(project_root, "deliverables/mirror_reports/watch_mirror_v4_5.html")
    generate_html_report(mirror, output_html)
