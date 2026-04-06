import json
import os
import sys
import requests
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.units import cm

# Ensure backend root is in sys.path to resolve imports
project_root = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck"
backend_root = os.path.join(project_root, "backend")
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.utils.mirror_extractor import MirrorExtractor

def generate_mirror_pdf(json_path, output_pdf_path):
    # 1. Extract Data
    with open(json_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    mirror = MirrorExtractor.extract(raw_data)
    
    # Create directory if not exists
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    
    # 2. Setup Document
    doc = SimpleDocTemplate(output_pdf_path, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    story = []
    
    # Custom Styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=18, spaceAfter=20, alignment=1)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], fontSize=14, color=colors.hexColor("#1A73E8"), spaceBefore=15, spaceAfter=10)
    normal_style = styles['Normal']
    label_style = ParagraphStyle('LabelStyle', parent=styles['Normal'], fontName='Helvetica-Bold')
    
    # 3. Header Section
    story.append(Paragraph("0Buck Project: Verified Artisan Mirror Report", title_style))
    story.append(Paragraph(f"Product: {mirror.get('title')}", styles['Heading3']))
    story.append(Paragraph(f"1688 ID: {mirror.get('product_id')}", normal_style))
    story.append(Spacer(1, 0.5*cm))
    
    # 4. Hero Image (Download if possible)
    main_image_url = mirror.get('gallery', [None])[0]
    if main_image_url:
        if main_image_url.startswith("//"): main_image_url = "https:" + main_image_url
        img_temp_path = "/tmp/main_image_temp.jpg"
        try:
            resp = requests.get(main_image_url, timeout=5)
            with open(img_temp_path, 'wb') as f:
                f.write(resp.content)
            img = Image(img_temp_path, width=15*cm, height=15*cm)
            story.append(img)
            story.append(Spacer(1, 0.5*cm))
        except Exception as e:
            story.append(Paragraph(f"[Image placeholder: {main_image_url}]", normal_style))
    
    # 5. The Desire Engine (Marketing Logic)
    story.append(Paragraph("I. The Desire Engine (AI Marketing Logic)", header_style))
    hook = "Imagine a world where your technology doesn't just work, but works for you—seamlessly, elegantly, and without the brand markup."
    logic = "By cutting out the middlemen and going straight to the source, we bring you the same precision engineering at a fraction of the cost. This is the 0Buck promise."
    closing = "Join the 0Buck revolution today. Sign up, sign in, and claim your rewards."
    
    story.append(Paragraph("<b>[The Hook]:</b> " + hook, normal_style))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph("<b>[The Logic]:</b> " + logic, normal_style))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph("<b>[The Closing]:</b> " + closing, normal_style))
    story.append(Spacer(1, 1*cm))
    
    # 6. Technical Specifications Table
    story.append(Paragraph("II. Mirror Technical Specifications", header_style))
    spec_data = [["Attribute", "Value"]]
    for attr in mirror.get('attributes', []):
        spec_data.append([attr.get('label'), attr.get('value')])
    
    t = Table(spec_data, colWidths=[6*cm, 10*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor("#F1F3F4")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t)
    story.append(PageBreak())
    
    # 7. Variant Matrix
    story.append(Paragraph("III. Variant & Inventory Matrix", header_style))
    variant_data = [["Variant (Spec)", "Price (CNY)", "Stock"]]
    for v in mirror.get('variants', [])[:20]: # Show top 20
        variant_data.append([v.get('spec_attrs'), v.get('price'), v.get('stock')])
    
    vt = Table(variant_data, colWidths=[10*cm, 3*cm, 3*cm])
    vt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor("#E8F0FE")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(vt)
    story.append(Spacer(1, 1*cm))
    
    # 8. Anti-Dispute Logistics Board
    story.append(Paragraph("IV. Anti-Dispute Logistics Board", header_style))
    log_data = [["Metric", "Value"]]
    rl = mirror.get('raw_logistics', {})
    log_data.append(["Unit Weight (g)", rl.get('weight_g')])
    log_data.append(["Logistics Category", "General Cargo" if rl.get('is_general') else "Sensitive Cargo"])
    
    lt = Table(log_data, colWidths=[6*cm, 10*cm])
    lt.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor("#FFF4E5")),
    ]))
    story.append(lt)
    
    # 9. Build
    doc.build(story)
    print(f"✅ Mirror PDF generated successfully: {output_pdf_path}")

if __name__ == "__main__":
    test_json = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck/data/1688/test_raw_1.json"
    output_pdf = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck/deliverables/mirror_reports/watch_mirror_v3.pdf"
    generate_mirror_pdf(test_json, output_pdf)
